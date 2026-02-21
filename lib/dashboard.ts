import { fetchBudgetRows, fetchCardMonthlyPerformance, fetchChecklist } from "@/lib/sheets";
import { BudgetRow, CardMonthlyPerformanceSummary, CategoryBreakdown, DashboardSnapshot } from "@/lib/types";

function sumAmounts(rows: BudgetRow[]): number {
  return rows.reduce((acc, row) => acc + (row.amount ?? 0), 0);
}

function toBreakdown(rows: BudgetRow[]): CategoryBreakdown[] {
  const map = new Map<string, number>();

  rows.forEach((row) => {
    const key = row.minor || "미분류";
    const amount = row.amount ?? 0;
    map.set(key, (map.get(key) ?? 0) + amount);
  });

  const total = Array.from(map.values()).reduce((a, b) => a + b, 0);

  return Array.from(map.entries())
    .map(([name, amount]) => ({
      name,
      amount,
      ratio: total === 0 ? 0 : amount / total,
    }))
    .sort((a, b) => b.amount - a.amount);
}

function sortByAmount(rows: BudgetRow[]): BudgetRow[] {
  return rows
    .filter((row) => row.sectionType !== "summary")
    .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0));
}

function summarizeCardPerformance(
  rows: DashboardSnapshot["cardPerformance"]["rows"],
): CardMonthlyPerformanceSummary {
  const okCount = rows.filter((row) => row.status === "ok").length;
  const nokCount = rows.filter((row) => row.status === "nok").length;
  const emptyCount = rows.filter((row) => row.status === "empty").length;
  const completionDenominator = okCount + nokCount;

  return {
    okCount,
    nokCount,
    emptyCount,
    completionRate: completionDenominator > 0 ? okCount / completionDenominator : 0,
  };
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const [budgetRows, checklist, cardPerformance] = await Promise.all([
    fetchBudgetRows(),
    fetchChecklist(),
    fetchCardMonthlyPerformance(),
  ]);

  const incomeRows = budgetRows.filter((row) => row.sectionType === "income");
  const fixedExpenseRows = budgetRows.filter((row) => row.sectionType === "fixed_expense");
  const investmentRows = budgetRows.filter((row) => row.sectionType === "investment");
  const oneTimeIncomeRows = budgetRows.filter((row) => row.sectionType === "one_time_income");
  const oneTimeExpenseRows = budgetRows.filter((row) => row.sectionType === "one_time_expense");

  const monthlyIncome = sumAmounts(incomeRows);
  const monthlyFixedExpense = sumAmounts(fixedExpenseRows);
  const monthlyInvestment = sumAmounts(investmentRows);

  return {
    kpis: {
      monthlyIncome,
      monthlyFixedExpense,
      monthlyInvestment,
      monthlySurplus: monthlyIncome - monthlyFixedExpense - monthlyInvestment,
    },
    sourceUpdatedAt: new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    fixedExpenseByMinor: toBreakdown(fixedExpenseRows),
    investmentByMinor: toBreakdown(investmentRows),
    incomeRows: sortByAmount(incomeRows),
    oneTimeIncomeRows: sortByAmount(oneTimeIncomeRows),
    oneTimeExpenseRows: sortByAmount(oneTimeExpenseRows),
    fixedExpenseRows: sortByAmount(fixedExpenseRows),
    investmentRows: sortByAmount(investmentRows),
    checklist: {
      cards: checklist.cards.sort((a, b) => b.targetAmount - a.targetAmount),
      transfers: checklist.transfers.sort((a, b) => b.targetAmount - a.targetAmount),
    },
    cardPerformance: {
      year: cardPerformance.year,
      month: cardPerformance.month,
      label: cardPerformance.label,
      rows: cardPerformance.rows,
      summary: summarizeCardPerformance(cardPerformance.rows),
    },
  };
}
