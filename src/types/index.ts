
export type ExpenseCategory = 
  | "food" 
  | "housing" 
  | "transportation" 
  | "utilities" 
  | "entertainment" 
  | "healthcare" 
  | "personal" 
  | "education" 
  | "other";

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  category?: ExpenseCategory;
}

export interface Budget {
  monthly: number;
  weekly: number;
  daily: number;
}
