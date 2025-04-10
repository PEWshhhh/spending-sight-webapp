
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Budget, Expense, ExpenseCategory } from '@/types';
import { calculateBudgets, generateId, filterCurrentMonthExpenses } from '@/lib/expense-utils';
import { useToast } from '@/components/ui/use-toast';

interface ExpenseContextType {
  budget: Budget;
  expenses: Expense[];
  categories: ExpenseCategory[];
  currentMonthExpenses: Expense[];
  setBudget: (monthlyBudget: number) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  editExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  resetMonth: () => void;
}

const defaultBudget: Budget = {
  monthly: 0,
  weekly: 0,
  daily: 0
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [budget, setBudgetState] = useState<Budget>(defaultBudget);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { toast } = useToast();
  
  const categories: ExpenseCategory[] = [
    'food',
    'housing',
    'transportation',
    'utilities',
    'entertainment',
    'healthcare',
    'personal',
    'education',
    'other'
  ];
  
  const currentMonthExpenses = filterCurrentMonthExpenses(expenses);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedBudget = localStorage.getItem('budget');
    const savedExpenses = localStorage.getItem('expenses');
    
    if (savedBudget) {
      setBudgetState(JSON.parse(savedBudget));
    }
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [budget]);
  
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);
  
  const setBudget = (monthlyBudget: number) => {
    const newBudget = calculateBudgets(monthlyBudget);
    setBudgetState(newBudget);
    toast({
      title: "Budget Updated",
      description: "Your monthly budget has been updated successfully."
    });
  };
  
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: generateId()
    };
    
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
    toast({
      title: "Expense Added",
      description: `${expense.name} has been added to your expenses.`
    });
  };
  
  const editExpense = (expense: Expense) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(e => e.id === expense.id ? expense : e)
    );
    toast({
      title: "Expense Updated",
      description: `${expense.name} has been updated successfully.`
    });
  };
  
  const deleteExpense = (id: string) => {
    const expenseName = expenses.find(e => e.id === id)?.name || 'Expense';
    setExpenses(prevExpenses => prevExpenses.filter(e => e.id !== id));
    toast({
      title: "Expense Deleted",
      description: `${expenseName} has been deleted from your expenses.`
    });
  };
  
  const resetMonth = () => {
    setExpenses(prevExpenses => 
      prevExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return !(expenseDate.getMonth() === currentMonth && 
                 expenseDate.getFullYear() === currentYear);
      })
    );
    toast({
      title: "Month Reset",
      description: "All expenses for the current month have been cleared."
    });
  };

  return (
    <ExpenseContext.Provider
      value={{
        budget,
        expenses,
        categories,
        currentMonthExpenses,
        setBudget,
        addExpense,
        editExpense,
        deleteExpense,
        resetMonth
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
}
