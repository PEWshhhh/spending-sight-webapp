
import { useState } from 'react';
import { useExpense } from '@/contexts/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/expense-utils';

export default function BudgetSetupForm() {
  const { budget, setBudget } = useExpense();
  const [monthlyBudget, setMonthlyBudget] = useState<string>(budget.monthly.toString());
  
  const calculateWeeklyBudget = (monthly: number) => {
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    return (monthly / daysInMonth) * 7;
  };
  
  const calculateDailyBudget = (monthly: number) => {
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    return monthly / daysInMonth;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBudget = parseFloat(monthlyBudget);
    
    if (!isNaN(parsedBudget) && parsedBudget > 0) {
      setBudget(parsedBudget);
    }
  };
  
  // Preview the weekly and daily budgets based on the current input
  const previewMonthly = parseFloat(monthlyBudget) || 0;
  const previewWeekly = calculateWeeklyBudget(previewMonthly);
  const previewDaily = calculateDailyBudget(previewMonthly);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Setup</CardTitle>
        <CardDescription>Set your monthly budget and we'll calculate the rest</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="monthlyBudget">Monthly Budget</Label>
            <Input
              id="monthlyBudget"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter your monthly budget"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="text-lg"
              required
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-muted-foreground">Weekly Budget</Label>
              <div className="text-xl font-medium">{formatCurrency(previewWeekly)}</div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-muted-foreground">Daily Budget</Label>
              <div className="text-xl font-medium">{formatCurrency(previewDaily)}</div>
            </div>
          </div>
          
          <Button type="submit" className="w-full">Save Budget</Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <p>Current monthly budget: {formatCurrency(budget.monthly)}</p>
      </CardFooter>
    </Card>
  );
}
