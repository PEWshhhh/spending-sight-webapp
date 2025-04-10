
import { useState } from 'react';
import { useExpense } from '@/contexts/ExpenseContext';
import { formatCurrency, formatDate } from '@/lib/expense-utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense } from '@/types';
import { Edit, Trash2 } from 'lucide-react';
import ExpenseForm from './ExpenseForm';

export default function ExpenseHistory() {
  const { currentMonthExpenses, deleteExpense } = useExpense();
  const [search, setSearch] = useState('');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter expenses based on search term
  const filteredExpenses = currentMonthExpenses.filter(expense => 
    expense.name.toLowerCase().includes(search.toLowerCase()) ||
    expense.category?.toLowerCase().includes(search.toLowerCase())
  );
  
  // Sort expenses by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedExpense(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold">Expense History</h2>
        <Input
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      
      {sortedExpenses.length > 0 ? (
        <div className="grid gap-4">
          {sortedExpenses.map((expense) => (
            <Card key={expense.id} className="expense-card">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{expense.name}</span>
                      {expense.category && (
                        <Badge variant="outline" className="capitalize">
                          {expense.category}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(expense.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{formatCurrency(expense.amount)}</span>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-2">No expenses found.</p>
            {search && <Button variant="link" onClick={() => setSearch('')}>Clear search</Button>}
          </CardContent>
        </Card>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <ExpenseForm 
              editExpense={selectedExpense} 
              onSubmit={closeDialog} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
