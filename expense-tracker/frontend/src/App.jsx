import { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

const App = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExpenseAdded = (newExpense) => {
    console.log('New expense added:', newExpense);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <div className="w-full max-w-3xl px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Expense Tracker</h1>
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <ExpenseForm onExpenseAdded={handleExpenseAdded} />
          </div>
          <ExpenseList userId={1} key={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default App;
