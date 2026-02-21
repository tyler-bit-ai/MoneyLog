export type SectionType =
  | "income"
  | "fixed_expense"
  | "investment"
  | "one_time_income"
  | "one_time_expense"
  | "summary"
  | "unknown";

export type BudgetRow = {
  rowIndex: number;
  major: string;
  minor: string;
  detail: string;
  amount: number | null;
  note: string;
  sectionType: SectionType;
};

export type BudgetSummary = {
  section: Exclude<SectionType, "summary" | "unknown">;
  totalAmount: number;
};

export type CardTargetRow = {
  cardName: string;
  targetAmount: number;
  note: string;
};

export type CardMonthlyStatus = "ok" | "nok" | "empty";

export type CardMonthlyPerformanceRow = {
  category: string;
  cardName: string;
  requirement: string;
  reason: string;
  status: CardMonthlyStatus;
};

export type CardMonthlyPerformanceSummary = {
  okCount: number;
  nokCount: number;
  emptyCount: number;
  completionRate: number;
};

export type TransferTodoRow = {
  name: string;
  targetAmount: number;
  note: string;
};

export type Kpis = {
  monthlyIncome: number;
  monthlyFixedExpense: number;
  monthlyInvestment: number;
  monthlySurplus: number;
};

export type CategoryBreakdown = {
  name: string;
  amount: number;
  ratio: number;
};

export type DashboardSnapshot = {
  kpis: Kpis;
  sourceUpdatedAt: string;
  fetchedAt: string;
  fixedExpenseByMinor: CategoryBreakdown[];
  investmentByMinor: CategoryBreakdown[];
  incomeRows: BudgetRow[];
  oneTimeIncomeRows: BudgetRow[];
  oneTimeExpenseRows: BudgetRow[];
  fixedExpenseRows: BudgetRow[];
  investmentRows: BudgetRow[];
  checklist: {
    cards: CardTargetRow[];
    transfers: TransferTodoRow[];
  };
  cardPerformance: {
    year: number;
    month: number;
    label: string;
    summary: CardMonthlyPerformanceSummary;
    rows: CardMonthlyPerformanceRow[];
  };
};
