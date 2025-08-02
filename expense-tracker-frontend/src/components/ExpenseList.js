import React from 'react';
import './ExpenseList.css';

const ExpenseList = ({ expenses, onDelete }) => {
  return (
    <div className="expense-list">
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id} className="expense-item">
              <div>
                <strong>{expense.title}</strong>
                <span>₹{expense.amount}</span>
                <em>{new Date(expense.date).toLocaleDateString()}</em>
              </div>
              <button onClick={() => onDelete(expense.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;
