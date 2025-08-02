import React, { useState, useEffect } from 'react';
import '../App.css';


const categories = [
  'Food', 'Transport', 'Shopping', 'Work',
  'Utilities', 'Health', 'Entertainment', 'Travel'
];

function App() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [expenses, setExpenses] = useState([]);

  const [filterCategories, setFilterCategories] = useState([...categories]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTitle, setSearchTitle] = useState('');

  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [editExpense, setEditExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const response = await fetch('http://localhost:8080/api/expenses');
    const data = await response.json();
    setExpenses(data);
  };

  const handleAddExpense = async () => {
    if (!title || !amount || !date || !category) return;
    const expense = { title, amount, date, category };
    await fetch('http://localhost:8080/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });
    setTitle('');
    setAmount('');
    setDate('');
    setCategory('');
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/expenses/${id}`, {
      method: 'DELETE',
    });
    fetchExpenses();
  };

  const toggleCategory = (cat) => {
    if (filterCategories.length === 1 && filterCategories[0] === cat) {
      setFilterCategories([...categories]);
    } else {
      setFilterCategories([cat]);
    }
  };

  const toggleSelectAll = () => {
    if (filterCategories.length === categories.length) {
      setFilterCategories([]);
    } else {
      setFilterCategories([...categories]);
    }
  };

  const filteredExpenses = expenses.filter(exp => {
    const expenseDate = new Date(exp.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (!filterCategories.includes(exp.category)) return false;
    if (start && expenseDate < start) return false;
    if (end && expenseDate > end) return false;
    if (searchTitle && !exp.title.toLowerCase().includes(searchTitle.toLowerCase())) return false;
    return true;
  });

  const openEditPopup = (expense) => {
    setEditExpense(expense);
    setEditPopupVisible(true);
  };

  const closeEditPopup = () => {
    setEditExpense(null);
    setEditPopupVisible(false);
  };

  const handleEditSave = async () => {
    await fetch(`http://localhost:8080/api/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editExpense),
    });
    closeEditPopup();
    fetchExpenses();
  };

  return (
    <div className="App">
      <h1>💸 My Expense Tracker</h1>

      {/* Add Expense Form */}
      <div className="form">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'Food' ? '🍔 Food' :
              cat === 'Transport' ? '🚌 Transport' :
              cat === 'Shopping' ? '🛍️ Shopping' :
              cat === 'Work' ? '💻 Work' :
              cat === 'Utilities' ? '💡 Utilities' :
              cat === 'Health' ? '💊 Health' :
              cat === 'Entertainment' ? '🎉 Entertainment' :
              cat === 'Travel' ? '✈️ Travel' : cat}
            </option>
          ))}
        </select>
        <button onClick={handleAddExpense}>Add Expense</button>
      </div>

      {/* Filter by Category */}
      <div className="filter-section">
        <h3>Filter by Categories:</h3>
        <div className="category-grid">
          <button
            className={`filter-pill ${filterCategories.length === categories.length ? 'active' : ''}`}
            onClick={toggleSelectAll}
          >
            ✅ Select All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${filterCategories.includes(cat) ? 'active' : ''}`}
              onClick={() => toggleCategory(cat)}
            >
              {cat === 'Food' ? '🍔 Food' :
              cat === 'Transport' ? '🚌 Transport' :
              cat === 'Shopping' ? '🛍️ Shopping' :
              cat === 'Work' ? '💻 Work' :
              cat === 'Utilities' ? '💡 Utilities' :
              cat === 'Health' ? '💊 Health' :
              cat === 'Entertainment' ? '🎉 Entertainment' :
              cat === 'Travel' ? '✈️ Travel' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Date Filter */}
      <div style={{ marginBottom: '25px' }}>
        <label htmlFor="startDate" style={{ marginRight: 12 }}><strong>Start Date:</strong></label>
        <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label htmlFor="endDate" style={{ marginLeft: 30, marginRight: 12 }}><strong>End Date:</strong></label>
        <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {/* Search by Title */}
      <div style={{ marginBottom: '30px' }}>
        <label htmlFor="searchTitle" style={{ marginRight: '10px' }}><strong>Search Title:</strong></label>
        <input
          type="text"
          id="searchTitle"
          placeholder="Type to search expenses..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #ccc', minWidth: '220px' }}
        />
      </div>

      {/* Total */}
      {filteredExpenses.length > 0 && (
        <div style={{
          marginBottom: '25px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
          backgroundColor: '#e8f5e9',
          padding: '12px 20px',
          borderRadius: '10px',
          maxWidth: '300px'
        }}>
          Total Expense: ₹{filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0)}
        </div>
      )}

      {/* Expense List */}
      <div className="expense-list">
        {filteredExpenses.length === 0 ? (
          <p>No expenses found.</p>
        ) : (
          filteredExpenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <strong>{expense.title}</strong>
              <span>₹{expense.amount}</span>
              <span>{new Date(expense.date).toLocaleDateString('en-GB')}</span>
              <span className="category-tag">{expense.category}</span>
              <div className="action-icons">
                <button className="icon-btn" onClick={() => openEditPopup(expense)} title="Edit">✏️</button>
                <button className="icon-btn" onClick={() => handleDelete(expense.id)} title="Delete">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Expense Popup */}
      {editPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Edit Expense</h3>
            <input
              type="text"
              value={editExpense.title}
              onChange={(e) => setEditExpense({ ...editExpense, title: e.target.value })}
            />
            <input
              type="number"
              value={editExpense.amount}
              onChange={(e) => setEditExpense({ ...editExpense, amount: e.target.value })}
            />
            <input
              type="date"
              value={editExpense.date}
              onChange={(e) => setEditExpense({ ...editExpense, date: e.target.value })}
            />
            <select
              value={editExpense.category}
              onChange={(e) => setEditExpense({ ...editExpense, category: e.target.value })}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="popup-actions">
              <button onClick={handleEditSave}>Save</button>
              <button className="cancel-btn" onClick={closeEditPopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
