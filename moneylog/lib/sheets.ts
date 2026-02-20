import { parse } from "csv-parse/sync";

import { SHEET_GID_BUDGET, SHEET_GID_CHECKLIST, SHEET_ID } from "@/lib/env";
import { maskSensitiveText } from "@/lib/mask";
import {
  BudgetRow,
  CardTargetRow,
  SectionType,
  TransferTodoRow,
} from "@/lib/types";

const BASE_URL = "https://docs.google.com/spreadsheets/d";

function parseAmount(raw: string | undefined): number | null {
  if (!raw) {
    return null;
  }
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "-") {
    return null;
  }
  const normalized = trimmed.replaceAll(",", "").replaceAll(" ", "");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function toSectionType(major: string): SectionType {
  switch (major) {
    case "수입":
      return "income";
    case "고정지출":
      return "fixed_expense";
    case "투자":
      return "investment";
    case "일회성수입":
      return "one_time_income";
    case "일회성지출":
      return "one_time_expense";
    case "합계":
      return "summary";
    default:
      return "unknown";
  }
}

function makeCsvUrl(gid: number): string {
  return `${BASE_URL}/${SHEET_ID}/export?format=csv&gid=${gid}`;
}

async function fetchCsv(gid: number): Promise<string> {
  const response = await fetch(makeCsvUrl(gid), {
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet gid=${gid}: ${response.status}`);
  }

  return response.text();
}

export async function fetchBudgetRows(): Promise<BudgetRow[]> {
  const csv = await fetchCsv(SHEET_GID_BUDGET);
  const rows = parse(csv, {
    relax_quotes: true,
    relax_column_count: true,
  }) as string[][];

  let currentMajor = "";
  let currentMinor = "";

  const parsed: BudgetRow[] = [];

  rows.forEach((cols, index) => {
    if (index < 1) {
      return;
    }

    const majorRaw = (cols[1] ?? "").trim();
    const minorRaw = (cols[2] ?? "").trim();
    const detail = (cols[3] ?? "").trim();
    const amountRaw = cols[4] ?? "";
    const noteRaw = (cols[5] ?? "").trim();

    if (majorRaw === "대분류" || minorRaw === "소분류") {
      return;
    }

    if (!majorRaw && !minorRaw && !detail && !amountRaw && !noteRaw) {
      return;
    }

    if (majorRaw) {
      currentMajor = majorRaw;
    }
    if (minorRaw) {
      currentMinor = minorRaw;
    }

    const major = majorRaw || currentMajor;
    const minor = minorRaw || currentMinor;
    const sectionType = toSectionType(major);

    parsed.push({
      rowIndex: index + 1,
      major,
      minor,
      detail,
      amount: parseAmount(amountRaw),
      note: maskSensitiveText(noteRaw),
      sectionType,
    });
  });

  return parsed;
}

export async function fetchChecklist(): Promise<{
  cards: CardTargetRow[];
  transfers: TransferTodoRow[];
}> {
  const csv = await fetchCsv(SHEET_GID_CHECKLIST);
  const rows = parse(csv, {
    relax_quotes: true,
    relax_column_count: true,
  }) as string[][];

  const cards: CardTargetRow[] = [];
  const transfers: TransferTodoRow[] = [];

  let mode: "cards" | "transfers" = "cards";

  rows.forEach((cols, index) => {
    if (index < 1) {
      return;
    }

    const title = (cols[1] ?? "").trim();
    const amountRaw = cols[2] ?? "";
    const note = maskSensitiveText((cols[3] ?? "").trim());

    if (!title && !amountRaw && !note) {
      return;
    }

    if (title === "매달써야 하는 카드") {
      mode = "cards";
      return;
    }

    if (title === "챙겨야하는 자동이체") {
      mode = "transfers";
      return;
    }

    const amount = parseAmount(amountRaw) ?? 0;

    if (mode === "cards") {
      cards.push({ cardName: title, targetAmount: amount, note });
      return;
    }

    transfers.push({ name: title, targetAmount: amount, note });
  });

  return { cards, transfers };
}
