package com.sravya.expense_tracker_backend.repository;

import com.sravya.expense_tracker_backend.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    // Spring Data JPA gives you all CRUD methods automatically!
}
