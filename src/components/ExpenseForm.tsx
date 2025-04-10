
import { useState } from 'react';
import { useExpense } from '@/contexts/ExpenseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDateForInput } from '@/lib/expense-utils';
import { ExpenseCategory, Expense } from '@/types';
import { PlusCircle } from 'lucide-react';

interface ExpenseFormProps {
  editExpense?: Expense;
  onSubmit?: () => void;
}

export default function ExpenseForm({ editExpense, onSubmit }: ExpenseFormProps) {
  const { addExpense, editExpense: updateExpense, categories } = useExpense();
  
  const [name, setName] = useState<string>(editExpense?.name || '');
  const [amount, setAmount] = useState<string>(editExpense?.amount.toString() || '');
  const [date, setDate] = useState<string>(editExpense?.date || formatDateForInput());
  const [category, setCategory] = useState<ExpenseCategory | undefined>(editExpense?.category);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData = {
      name,
      amount: parseFloat(amount),
      date,
      category
    };
    
    if (editExpense) {
      updateExpense({ ...expenseData, id: editExpense.id });
    } else {
      addExpense(expenseData);
    }
    
    // Reset form
    setName('');
    setAmount('');
    setDate(formatDateForInput());
    setCategory(undefined);
    
    // Call onSubmit callback if provided
    if (onSubmit) onSubmit();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{editExpense ? 'Edit Expense' : 'Add New Expense'}</CardTitle>
        <CardDescription>
          {editExpense 
            ? 'Update expense information' 
            : 'Enter the details of your expense'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Expense Name</Label>
            <Input
              id="name"
              placeholder="e.g., Groceries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ExpenseCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="w-full">
            {editExpense ? 'Update Expense' : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
