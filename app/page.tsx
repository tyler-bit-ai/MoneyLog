import { redirect } from "next/navigation";

import { BudgetTable } from "@/app/components/budget-table";
import { CardPerformancePanel } from "@/app/components/card-performance-panel";
import { ChecklistPanel } from "@/app/components/checklist-panel";
import { CollapsibleSection } from "@/app/components/collapsible-section";
import { ExpensePieChart } from "@/app/components/expense-pie-chart";
import { KpiCard } from "@/app/components/kpi-card";
import { RefreshButton } from "@/app/components/refresh-button";
import { getSessionCookieName, verifySessionToken } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/dashboard";
import { compactDate } from "@/lib/format";

import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!verifySessionToken(token)) {
    redirect("/login");
  }

  const snapshot = await getDashboardSnapshot();

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 rounded-2xl border border-[var(--line)] bg-white/85 p-4 backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">MoneyLog Dashboard</h1>
            <p className="text-sm text-[var(--muted)]">
              동기화 시각: {compactDate(snapshot.fetchedAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RefreshButton />
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="rounded-xl border border-[var(--line)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--surface)]"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="월 수입" value={snapshot.kpis.monthlyIncome} tone="positive" />
        <KpiCard title="월 고정지출" value={snapshot.kpis.monthlyFixedExpense} tone="negative" />
        <KpiCard title="월 투자" value={snapshot.kpis.monthlyInvestment} />
        <KpiCard
          title="월 잉여자금"
          value={snapshot.kpis.monthlySurplus}
          tone={snapshot.kpis.monthlySurplus >= 0 ? "positive" : "negative"}
        />
      </section>

      <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ExpensePieChart data={snapshot.fixedExpenseByMinor} title="고정지출 구성" />
        </div>
        <ChecklistPanel cards={snapshot.checklist.cards} transfers={snapshot.checklist.transfers} />
      </section>

      <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-2">
        <CardPerformancePanel cardPerformance={snapshot.cardPerformance} />
        <BudgetTable title="월수입 상세" rows={snapshot.incomeRows} totalAmount={snapshot.kpis.monthlyIncome} />
      </section>

      <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-2">
        <BudgetTable
          title="고정지출 상세"
          rows={snapshot.fixedExpenseRows}
          totalAmount={snapshot.kpis.monthlyFixedExpense}
        />
        <BudgetTable title="투자 상세" rows={snapshot.investmentRows} totalAmount={snapshot.kpis.monthlyInvestment} />
      </section>

      <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-2">
        <CollapsibleSection title="일회성 수입" count={snapshot.oneTimeIncomeRows.length} defaultOpen={false}>
          <BudgetTable title="일회성 수입 상세" rows={snapshot.oneTimeIncomeRows} />
        </CollapsibleSection>
        <CollapsibleSection title="일회성 지출" count={snapshot.oneTimeExpenseRows.length} defaultOpen={false}>
          <BudgetTable title="일회성 지출 상세" rows={snapshot.oneTimeExpenseRows} />
        </CollapsibleSection>
      </section>
    </main>
  );
}
