
import { useState, useEffect } from 'react';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import ExpenseDashboard from '@/components/ExpenseDashboard';
import BudgetSetupForm from '@/components/BudgetSetupForm';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseHistory from '@/components/ExpenseHistory';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Check for theme preference on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || 
        (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExpenseDashboard />;
      case 'budget':
        return <BudgetSetupForm />;
      case 'expense':
        return <ExpenseForm />;
      case 'history':
        return <ExpenseHistory />;
      default:
        return <ExpenseDashboard />;
    }
  };

  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
              <div className="container max-w-5xl mx-auto">
                {renderTabContent()}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </div>
    </ExpenseProvider>
  );
};

export default Index;
