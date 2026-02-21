import { formatPercent } from "@/lib/format";
import { DashboardSnapshot } from "@/lib/types";

type Props = {
  cardPerformance: DashboardSnapshot["cardPerformance"];
};

function statusLabel(status: DashboardSnapshot["cardPerformance"]["rows"][number]["status"]): string {
  if (status === "ok") {
    return "OK";
  }
  if (status === "nok") {
    return "NOK";
  }
  return "미입력";
}

function statusClass(status: DashboardSnapshot["cardPerformance"]["rows"][number]["status"]): string {
  if (status === "ok") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (status === "nok") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export function CardPerformancePanel({ cardPerformance }: Props) {
  const { rows, summary } = cardPerformance;

  return (
    <article className="card space-y-4">
      <header className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-[var(--ink)]">신용카드 실적</h3>
        <p className="text-xs text-[var(--muted)]">{cardPerformance.label}</p>
      </header>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1">
          <p className="text-xs text-emerald-700">달성</p>
          <p className="font-semibold text-emerald-700">{summary.okCount}건</p>
        </div>
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1">
          <p className="text-xs text-rose-700">미달성</p>
          <p className="font-semibold text-rose-700">{summary.nokCount}건</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
          <p className="text-xs text-slate-700">미입력</p>
          <p className="font-semibold text-slate-700">{summary.emptyCount}건</p>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-white px-2 py-1">
          <p className="text-xs text-[var(--muted)]">달성률</p>
          <p className="font-semibold text-[var(--ink)]">{formatPercent(summary.completionRate)}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">해당 월 데이터가 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={`${row.category}-${row.cardName}`} className="rounded-xl border border-[var(--line)] bg-white px-3 py-2">
              <div className="mb-1 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-[var(--muted)]">{row.category || "기타"}</p>
                  <p className="font-medium text-[var(--ink)]">{row.cardName}</p>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusClass(row.status)}`}>
                  {statusLabel(row.status)}
                </span>
              </div>
              {row.requirement ? (
                <p className="text-sm text-[var(--ink)]">실적: {row.requirement}</p>
              ) : null}
              {row.reason ? <p className="text-xs text-[var(--muted)]">{row.reason}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
