
import { useExpense } from '@/contexts/ExpenseContext';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/expense-utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import ThemeModeToggle from './ThemeModeToggle';
import { Home, CreditCard, History, Settings, RefreshCcw, Download } from 'lucide-react';
import { useState } from 'react';

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const { budget, resetMonth, currentMonthExpenses } = useExpense();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  
  const handleExport = () => {
    if (currentMonthExpenses.length === 0) {
      alert('No expenses to export');
      return;
    }
    
    // Create CSV content
    const headers = ['Name', 'Amount', 'Date', 'Category'];
    const rows = currentMonthExpenses.map(expense => [
      expense.name,
      expense.amount.toString(),
      expense.date,
      expense.category || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <>
      <Sidebar>
        <SidebarHeader className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            <span className="text-lg font-semibold">ExpenseTrack</span>
          </div>
          <SidebarTrigger className="shrink-0 lg:hidden">
            <Button variant="ghost" size="icon">
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SidebarTrigger>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className={activeTab === 'dashboard' ? 'bg-sidebar-accent' : ''} 
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className={activeTab === 'budget' ? 'bg-sidebar-accent' : ''}
                    onClick={() => setActiveTab('budget')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Budget Setup</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className={activeTab === 'expense' ? 'bg-sidebar-accent' : ''}
                    onClick={() => setActiveTab('expense')}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>Add Expense</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    className={activeTab === 'history' ? 'bg-sidebar-accent' : ''}
                    onClick={() => setActiveTab('history')}
                  >
                    <History className="h-4 w-4 mr-2" />
                    <span>Expense History</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setResetDialogOpen(true)}>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    <span>Reset Month</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    <span>Export CSV</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-4 border-t dark:border-slate-700">
            <div className="flex flex-col space-y-1 mb-2">
              <span className="text-xs font-semibold">Monthly Budget</span>
              <span className="text-lg font-bold">{formatCurrency(budget.monthly)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">© 2025 ExpenseTrack</span>
              <ThemeModeToggle />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Month</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all expenses for the current month. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              resetMonth();
              setResetDialogOpen(false);
            }}>
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
