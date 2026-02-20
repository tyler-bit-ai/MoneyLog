import { fetchBudgetRows, fetchChecklist } from "@/lib/sheets";
import { BudgetRow, CategoryBreakdown, DashboardSnapshot } from "@/lib/types";

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

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const [budgetRows, checklist] = await Promise.all([fetchBudgetRows(), fetchChecklist()]);

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
    oneTimeIncomeRows: sortByAmount(oneTimeIncomeRows),
    oneTimeExpenseRows: sortByAmount(oneTimeExpenseRows),
    fixedExpenseRows: sortByAmount(fixedExpenseRows),
    investmentRows: sortByAmount(investmentRows),
    checklist: {
      cards: checklist.cards.sort((a, b) => b.targetAmount - a.targetAmount),
      transfers: checklist.transfers.sort((a, b) => b.targetAmount - a.targetAmount),
    },
  };
}
