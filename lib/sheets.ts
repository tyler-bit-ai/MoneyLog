import { parse } from "csv-parse/sync";

import {
  CARD_PERF_SHEET_GID,
  CARD_PERF_SHEET_ID,
  SHEET_GID_BUDGET,
  SHEET_GID_CHECKLIST,
  SHEET_ID,
} from "@/lib/env";
import { maskSensitiveText } from "@/lib/mask";
import {
  BudgetRow,
  CardMonthlyPerformanceRow,
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

function makeCsvUrl(sheetId: string, gid: number): string {
  return `${BASE_URL}/${sheetId}/export?format=csv&gid=${gid}`;
}

async function fetchCsv(gid: number, sheetId = SHEET_ID): Promise<string> {
  const response = await fetch(makeCsvUrl(sheetId, gid), {
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet gid=${gid}: ${response.status}`);
  }

  return response.text();
}

function normalizeHeaderText(value: string): string {
  return value.trim().replaceAll(" ", "");
}

function parseYearMonthFromHeader(value: string): { shortYear: number; month: number } | null {
  const normalized = normalizeHeaderText(value).replaceAll("년", ".");
  const patterns = [/^(\d{2})\.(\d{1,2})월$/, /^(\d{2})(\d{1,2})월$/];

  for (const pattern of patterns) {
    const matched = normalized.match(pattern);
    if (!matched) {
      continue;
    }
    const shortYear = Number(matched[1]);
    const month = Number(matched[2]);
    if (!Number.isInteger(shortYear) || !Number.isInteger(month) || month < 1 || month > 12) {
      continue;
    }
    return { shortYear, month };
  }

  return null;
}

function getCurrentKstYearMonth(): { year: number; shortYear: number; month: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());

  const yearPart = parts.find((part) => part.type === "year")?.value;
  const monthPart = parts.find((part) => part.type === "month")?.value;

  const year = Number(yearPart);
  const month = Number(monthPart);

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    throw new Error("Failed to resolve current KST year/month");
  }

  return { year, shortYear: year % 100, month };
}

function normalizeCardStatus(raw: string): "ok" | "nok" | "empty" {
  const normalized = raw.trim().toUpperCase();
  if (normalized === "OK") {
    return "ok";
  }
  if (normalized === "NOK") {
    return "nok";
  }
  return "empty";
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

export async function fetchCardMonthlyPerformance(): Promise<{
  year: number;
  month: number;
  label: string;
  rows: CardMonthlyPerformanceRow[];
}> {
  const { year, shortYear, month } = getCurrentKstYearMonth();
  const label = `${shortYear}.${month}월`;

  const csv = await fetchCsv(CARD_PERF_SHEET_GID, CARD_PERF_SHEET_ID);
  const rows = parse(csv, {
    relax_quotes: true,
    relax_column_count: true,
  }) as string[][];

  let headerRowIndex = -1;
  let monthColIndex = -1;

  rows.forEach((cols, rowIndex) => {
    cols.forEach((cell, colIndex) => {
      const ym = parseYearMonthFromHeader(cell ?? "");
      if (headerRowIndex >= 0 || !ym) {
        return;
      }
      if (ym.shortYear === shortYear && ym.month === month) {
        headerRowIndex = rowIndex;
        monthColIndex = colIndex;
      }
    });
  });

  if (headerRowIndex < 0 || monthColIndex < 0) {
    return {
      year,
      month,
      label: `${label} (미발견)`,
      rows: [],
    };
  }

  const headerRow = rows[headerRowIndex] ?? [];
  const categoryCol = headerRow.findIndex((cell) => normalizeHeaderText(cell ?? "") === "구분");
  const requirementCol = headerRow.findIndex((cell) => normalizeHeaderText(cell ?? "") === "실적");
  const reasonCol = headerRow.findIndex((cell) => normalizeHeaderText(cell ?? "") === "사유");

  const resolvedCategoryCol = categoryCol >= 0 ? categoryCol : 1;
  const resolvedCardNameCol = resolvedCategoryCol + 1;
  const resolvedRequirementCol = requirementCol >= 0 ? requirementCol : 3;
  const resolvedReasonCol = reasonCol >= 0 ? reasonCol : 4;

  const parsedRows: CardMonthlyPerformanceRow[] = [];
  let currentCategory = "";

  rows.forEach((cols, rowIndex) => {
    if (rowIndex <= headerRowIndex) {
      return;
    }

    const categoryRaw = (cols[resolvedCategoryCol] ?? "").trim();
    const cardName = (cols[resolvedCardNameCol] ?? "").trim();
    const requirement = (cols[resolvedRequirementCol] ?? "").trim();
    const reason = maskSensitiveText((cols[resolvedReasonCol] ?? "").trim());
    const statusRaw = (cols[monthColIndex] ?? "").trim();

    if (!categoryRaw && !cardName && !requirement && !reason && !statusRaw) {
      return;
    }

    if (categoryRaw) {
      currentCategory = categoryRaw;
    }

    if (!cardName) {
      return;
    }

    parsedRows.push({
      category: currentCategory,
      cardName,
      requirement,
      reason,
      status: normalizeCardStatus(statusRaw),
    });
  });

  return {
    year,
    month,
    label,
    rows: parsedRows,
  };
}
