
import { Budget, Expense } from "@/types";

// Calculate weekly and daily budgets based on monthly budget
export function calculateBudgets(monthlyBudget: number): Budget {
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const weeklyBudget = (monthlyBudget / daysInMonth) * 7;
  const dailyBudget = monthlyBudget / daysInMonth;
  
  return {
    monthly: monthlyBudget,
    weekly: weeklyBudget,
    daily: dailyBudget
  };
}

// Calculate total expenses
export function calculateTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Calculate budget percentage used
export function calculateBudgetPercentage(expenses: Expense[], budget: number): number {
  if (budget <= 0) return 0;
  
  const totalExpenses = calculateTotalExpenses(expenses);
  return (totalExpenses / budget) * 100;
}

// Get budget status based on percentage used
export function getBudgetStatus(percentage: number): 'safe' | 'warning' | 'danger' {
  if (percentage < 50) {
    return 'safe';
  } else if (percentage < 80) {
    return 'warning';
  } else {
    return 'danger';
  }
}

// Format date for display
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Filter expenses by current month
export function filterCurrentMonthExpenses(expenses: Expense[]): Expense[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && 
           expenseDate.getFullYear() === currentYear;
  });
}

// Format date for input fields (YYYY-MM-DD)
export function formatDateForInput(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}
