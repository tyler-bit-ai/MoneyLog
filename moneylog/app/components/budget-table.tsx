import { formatKrw } from "@/lib/format";
import { BudgetRow } from "@/lib/types";

type Props = {
  title: string;
  rows: BudgetRow[];
  emptyText?: string;
};

export function BudgetTable({ title, rows, emptyText = "데이터가 없습니다." }: Props) {
  return (
    <article className="card">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[var(--ink)]">{title}</h3>
        <span className="text-xs text-[var(--muted)]">{rows.length}건</span>
      </div>
      {rows.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">{emptyText}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] text-left text-xs text-[var(--muted)]">
                <th className="px-2 py-2">소분류</th>
                <th className="px-2 py-2">세부항목</th>
                <th className="px-2 py-2 text-right">비용</th>
                <th className="px-2 py-2">비고</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
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
