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
  oneTimeIncomeRows: BudgetRow[];
  oneTimeExpenseRows: BudgetRow[];
  fixedExpenseRows: BudgetRow[];
  investmentRows: BudgetRow[];
  checklist: {
    cards: CardTargetRow[];
    transfers: TransferTodoRow[];
  };
};
