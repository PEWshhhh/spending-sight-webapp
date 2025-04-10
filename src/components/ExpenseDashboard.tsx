
import { useExpense } from '@/contexts/ExpenseContext';
import { calculateTotalExpenses, calculateBudgetPercentage, getBudgetStatus, formatCurrency } from '@/lib/expense-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ExpenseCategory } from '@/types';
import { BarChart3, AlertTriangle, DollarSign, Wallet } from 'lucide-react';

export default function ExpenseDashboard() {
  const { budget, currentMonthExpenses, categories } = useExpense();
  
  const totalExpenses = calculateTotalExpenses(currentMonthExpenses);
  const remainingBudget = budget.monthly - totalExpenses;
  const percentageUsed = calculateBudgetPercentage(currentMonthExpenses, budget.monthly);
  const budgetStatus = getBudgetStatus(percentageUsed);
  
  // Calculate category data for pie chart
  const categoryData = categories.map(category => {
    const categoryExpenses = currentMonthExpenses.filter(e => e.category === category);
    const amount = calculateTotalExpenses(categoryExpenses);
    return {
      name: category,
      value: amount
    };
  }).filter(item => item.value > 0);
  
  // Colors for pie chart
  const COLORS = ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e74c3c', '#1abc9c', '#e67e22', '#34495e', '#7f8c8d'];
  
  // Check if user is overspending
  const isOverspending = totalExpenses > budget.monthly * 0.8;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>
            Your budget usage for the current month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Used: {formatCurrency(totalExpenses)}</span>
              <span className="text-muted-foreground">
                Remaining: {formatCurrency(remainingBudget)}
              </span>
            </div>
            
            <Progress 
              className="budget-progress" 
              value={percentageUsed > 100 ? 100 : percentageUsed}
            />
            
            <div className={`flex items-center ${
              budgetStatus === 'danger' ? 'text-expense-red' : 
              budgetStatus === 'warning' ? 'text-expense-yellow' : 
              'text-expense-green'
            }`}>
              {isOverspending && (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  <span>You are overspending based on your monthly budget!</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Monthly Budget</CardTitle>
            <CardDescription>Total budget for this month</CardDescription>
          </div>
          <Wallet className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(budget.monthly)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Total Expenses</CardTitle>
            <CardDescription>Money spent this month</CardDescription>
          </div>
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Daily Budget</CardTitle>
            <CardDescription>Average daily spending</CardDescription>
          </div>
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(budget.daily)}</div>
        </CardContent>
      </Card>
      
      {categoryData.length > 0 && (
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
