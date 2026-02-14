import { useState } from 'react';
import axios from 'axios';

function ExpenseForm({ onExpenseAdded }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const defaultCategories = [
    'Food',
    'Transport',
    'Shopping',
    'Entertainment',
    'Bills',
    'Other'
  ];

  const [categories, setCategories] = useState(() => {
    try {
      const raw = localStorage.getItem('categories');
      return raw ? JSON.parse(raw) : defaultCategories;
    } catch {
      return defaultCategories;
    }
  });

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    if (value === '__new__') {
      setShowNewCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setShowNewCategory(false);
      setFormData(prev => ({ ...prev, category: value }));
    }
  };

  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;

    if (!categories.includes(name)) {
      const next = [...categories, name];
      setCategories(next);
      try {
        localStorage.setItem('categories', JSON.stringify(next));
      } catch {}
    }

    setFormData(prev => ({ ...prev, category: name }));
    setNewCategoryName('');
    setShowNewCategory(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.category) {
      setError('Please select or add a category');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/expenses',
        {
          user_id: 1,
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date
        }
      );

      setSuccess('Expense added successfully!');

      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });

      if (onExpenseAdded) {
        onExpenseAdded(response.data);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(
          Array.isArray(err.response.data.errors)
            ? err.response.data.errors.join(', ')
            : err.response.data.errors
        );
      } else {
        setError('Failed to add expense. Please try again');
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add new Expense</h2>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded bg-green-50 text-green-700">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            required
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            required
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="__new__">Add new category...</option>
          </select>
        </div>

        {showNewCategory && (
          <div className="flex gap-2">
            <input
              id="newCategory"
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm"
              placeholder="New category"
            />
            <button type="button" onClick={handleAddCategory} className="px-4 py-2 bg-gray-100 rounded text-sm">Add</button>
          </div>
        )}

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Add Expense</button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
