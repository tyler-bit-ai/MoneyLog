"use client";

import { useMemo, useState } from "react";

import { formatKrw } from "@/lib/format";
import { BudgetRow } from "@/lib/types";

type SortKey = "minor" | "amount";
type SortOrder = "asc" | "desc";

type Props = {
  title: string;
  rows: BudgetRow[];
  emptyText?: string;
  totalAmount?: number;
};

function compareMinor(a: string, b: string): number {
  return (a || "").localeCompare(b || "", "ko");
}

export function BudgetTable({ title, rows, emptyText = "데이터가 없습니다.", totalAmount }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("amount");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sortedRows = useMemo(() => {
    const next = [...rows];

    next.sort((a, b) => {
      if (sortKey === "minor") {
        const minorDiff = compareMinor(a.minor, b.minor);
        return sortOrder === "asc" ? minorDiff : -minorDiff;
      }

      const aAmount = a.amount;
      const bAmount = b.amount;

      if (aAmount === null && bAmount === null) {
        return 0;
      }
      if (aAmount === null) {
        return 1;
      }
      if (bAmount === null) {
        return -1;
      }

      const amountDiff = aAmount - bAmount;
      return sortOrder === "asc" ? amountDiff : -amountDiff;
    });

    return next;
  }, [rows, sortKey, sortOrder]);

  const toggleSort = (nextKey: SortKey) => {
    if (sortKey === nextKey) {
      setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
      return;
    }
    setSortKey(nextKey);
    setSortOrder("desc");
  };

  const sortMarker = (key: SortKey) => {
    if (sortKey !== key) {
      return "↕";
    }
    return sortOrder === "desc" ? "▼" : "▲";
  };

  return (
    <article className="card">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-[var(--ink)]">{title}</h3>
          {typeof totalAmount === "number" ? (
            <span className="text-sm font-semibold text-[var(--ink)]">{formatKrw(totalAmount)}</span>
          ) : null}
        </div>
        <span className="text-xs text-[var(--muted)]">{rows.length}건</span>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">{emptyText}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-left text-xs text-[var(--muted)]">
                <th className="px-2 py-2">
                  <button
                    type="button"
                    onClick={() => toggleSort("minor")}
                    className="inline-flex items-center gap-1 font-medium hover:text-[var(--ink)]"
                  >
                    소분류
                    <span>{sortMarker("minor")}</span>
                  </button>
                </th>
                <th className="px-2 py-2">세부항목</th>
                <th className="px-2 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort("amount")}
                    className="inline-flex items-center gap-1 font-medium hover:text-[var(--ink)]"
                  >
                    비용
                    <span>{sortMarker("amount")}</span>
                  </button>
                </th>
                <th className="px-2 py-2">비고</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <tr key={`${row.sectionType}-${row.rowIndex}`} className="border-b border-[var(--line)]/60 align-top">
                  <td className="px-2 py-2 font-medium text-[var(--ink)]">{row.minor || "-"}</td>
                  <td className="px-2 py-2 text-[var(--ink)]">{row.detail || "-"}</td>
                  <td className="px-2 py-2 text-right font-semibold text-[var(--ink)]">
                    {row.amount === null ? "-" : formatKrw(row.amount)}
                  </td>
                  <td className="px-2 py-2 text-[var(--muted)]">{row.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
