export type TransactionType = "income" | "expense";

export type Category =
  | "Food"
  | "Transport"
  | "Housing"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Income"
  | "Savings"
  | "Other";

export interface Transaction {
  id: string;
  statementId: string | null;
  date: string;           // "YYYY-MM-DD"
  description: string;
  amount: number;         // always positive
  type: TransactionType;
  category: Category;
  createdAt: string;
}

export interface Statement {
  id: string;
  filename: string;
  transactionCount: number;
  uploadedAt: string;
}

export interface FinanceData {
  transactions: Transaction[];
  statements: Statement[];
}

export interface MonthSummary {
  month: string;          // "Jan", "Feb" …
  income: number;
  expenses: number;
}

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percentage: number;
}