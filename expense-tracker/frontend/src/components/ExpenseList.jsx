import { useState, useEffect } from 'react';
import axios from 'axios';
//I added this outside so it wont recreate on every render
  const categoryColors = {
      Food: 'bg-emerald-500',
      Transport: 'bg-indigo-500',
      Shopping: 'bg-pink-500',
      Entertainment: 'bg-amber-400',
      Bills: 'bg-rose-500',
      Other: 'bg-gray-500',
    };

function ExpenseList({ userId }) {
    const categories =
    JSON.parse(localStorage.getItem('categories')) || [
      'Food',
      'Transport',
      'Shopping',
      'Entertainment',
      'Bills',
      'Other'
    ];

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        amount: '',
        category: '',
        description: '',
        date: ''
    });
    const[filterCategory,setFilterCategory]=useState(`All`);

    const filteredExpenses=filterCategory===`All`?expenses:expenses.filter(
      expense=>expense.category===filterCategory
    );
    const total=filteredExpenses.reduce((sum,expense)=>sum+Number(expense.amount),0);
    const totalByCategory= expenses.reduce((sum,expense)=>{
      const amount=Number(expense.amount);
      const category=expense.category;

      sum[category] = (sum[category] ?? 0) + amount;
      return sum;

    },{});
  
    useEffect(() => {
      fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(
          `http://localhost:5000/api/expenses/${userId}`
        );
        setExpenses(response.data);
      } catch (err) {
        setError('Failed to load expenses. Please try again.');
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    };

    const handleDelete = async (expenseId) => {
        try {
            await axios.delete(`http://localhost:5000/api/expenses/${expenseId}`);
            setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    };

      const handleUpdate = async (expenseId) => {
          try {
              await axios.put(`http://localhost:5000/api/expenses/${expenseId}`, editForm);
              setExpenses((prev) =>
                  prev.map((expense) => (expense.id === expenseId ? { ...expense, ...editForm } : expense))
              );
              setEditingId(null);
          } catch (err) {
              console.error(err.message);
          }
      };

const handleEditClick = (expense) => {
  setEditingId(expense.id);
  setEditForm({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date
  });
};

if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading expenses...
      </div>
    );
  }

  if (error) {
      return (
        <div className="text-center py-10 text-red-600">
          {error}
        </div>
      );
    }

    if (expenses.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
              No expenses yet. Add your first expense!
            </div>
        );
      }

        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                <p className='text-sm text-gray-500'>Total Spent</p>
                <p className='text-2xl font-extrabold text-emerald-600'>Rs {total}</p>
              </div>

              <div className="flex items-center gap-3">
                <select value={filterCategory} onChange={(e)=>setFilterCategory(e.target.value)}
                  className='border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200'>
                  <option value='All'>All categories</option>
                  {categories.map(c=>(
                    <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Spent by Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(totalByCategory).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`${categoryColors[category] ?? 'bg-slate-400'} w-3 h-3 rounded-full inline-block`} />
                  <span className="text-sm text-gray-700">{category}</span>
                </div>
                <div className="text-sm font-semibold text-gray-800">Rs {amount}</div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Expenses</h2>

        <div className="space-y-4">
          {filteredExpenses.map((expense) => (
            <div key={expense.id} className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition-shadow duration-200">
              {editingId === expense.id ? (
                <div className="space-y-3 mb-4">
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    value={editForm.amount}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, amount: e.target.value }))}
                  />

                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option>Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />

                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />

                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(expense.id)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition">
                      Save
                    </button>

                    <button onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`${categoryColors[expense.category] ?? 'bg-blue-500'} text-white px-3 py-1 rounded-full text-sm font-medium capitalize`}>{expense.category}</span>
                    <span className="text-2xl font-bold text-gray-800">Rs {expense.amount}</span>
                  </div>

                  {expense.description && (
                    <p className="text-gray-600 mb-3">{expense.description}</p>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{new Date(expense.date).toLocaleDateString()}</span>

                    <div className="flex gap-2">
                      <button onClick={() => handleEditClick(expense)}
                        className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800">
                        Edit
                      </button>

                      <button onClick={() => handleDelete(expense.id)}
                        className="px-3 py-1 text-sm text-rose-600 hover:text-rose-800">
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
}

export default ExpenseList;
