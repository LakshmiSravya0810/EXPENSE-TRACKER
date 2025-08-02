package com.sravya.expense_tracker_backend.controller;

import com.sravya.expense_tracker_backend.model.Expense;
import com.sravya.expense_tracker_backend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") // Enable frontend to connect
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    // ✅ Root route to show backend status
    @GetMapping("/")
    public String home() {
        return "Expense Tracker Backend is running!";
    }

    @GetMapping("/api/expenses")
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @GetMapping("/api/expenses/{id}")
    public Expense getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id);
    }

    @PostMapping("/api/expenses")
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseService.addExpense(expense);
    }

    @DeleteMapping("/api/expenses/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }
}
