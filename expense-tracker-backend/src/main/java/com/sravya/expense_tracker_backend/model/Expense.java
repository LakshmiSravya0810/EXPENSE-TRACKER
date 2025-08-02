package com.sravya.expense_tracker_backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Double amount;
    private LocalDate date;

    private String category;  // <-- New field added

    // Constructors
    public Expense() {}

    public Expense(String title, Double amount, LocalDate date, String category) {
        this.title = title;
        this.amount = amount;
        this.date = date;
        this.category = category;
    }

    // Getters and Setters
    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
