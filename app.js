"use strict";

// Selectors
const errormsgEl = document.querySelector(".error-message");
const budgetInputEl = document.querySelector(".budget-input");
const expenseDesEl = document.querySelector(".expenses_input");
const expenseAmountEl = document.querySelector(".expenses_amount");
const tablRecordEl = document.querySelector(".table_data");
const budgetCardEl = document.querySelector(".budget_card");
const expensesCardEl = document.querySelector(".expenses_card");
const balanceCardEl = document.querySelector(".balance_card");

// Validate selectors
if (!errormsgEl || !budgetInputEl || !expenseDesEl || !expenseAmountEl || !tablRecordEl || !budgetCardEl || !expensesCardEl || !balanceCardEl) {
  console.error("One or more DOM elements could not be found. Please check your HTML structure.");
}

let itemList = [];
let itemId = 0;

// Button Events
function btnEvents() {
  const btnBudgetCal = document.querySelector("#btn-budget");
  const btnExpensesCal = document.querySelector("#btn_expenses");

  if (!btnBudgetCal || !btnExpensesCal) {
    console.error("Buttons could not be found. Please check the IDs in your HTML.");
    return;
  }

  btnBudgetCal.addEventListener("click", (e) => {
    e.preventDefault();
    budgetFunc();
  });

  btnExpensesCal.addEventListener("click", (e) => {
    e.preventDefault();
    expensesFun();
  });
}

// Call Button Events
document.addEventListener("DOMContentLoaded", btnEvents);

// Budget Function
function budgetFunc() {
  if (!budgetInputEl || !budgetCardEl) return;

  const budgetValue = budgetInputEl.value.trim();

  if (budgetValue === "" || parseInt(budgetValue) <= 0) {
    errorMessage("Please Enter Your Budget (More Than 0)");
  } else {
    budgetCardEl.textContent = budgetValue;
    budgetInputEl.value = "";
    showBalance();
  }
}

// Expenses Function
function expensesFun() {
  if (!expenseDesEl || !expenseAmountEl) return;

  let expensesDescValue = expenseDesEl.value.trim();
  let expensesAmountValue = expenseAmountEl.value.trim();

  if (expensesDescValue === "" || expensesAmountValue === "" || parseInt(expensesAmountValue) <= 0) {
    errorMessage("Please Enter a Valid Description and Amount!");
  } else {
    let expenses = {
      id: itemId,
      title: expensesDescValue,
      amount: parseInt(expensesAmountValue),
    };
    itemId++;
    itemList.push(expenses);

    expenseDesEl.value = "";
    expenseAmountEl.value = "";

    addExpenses(expenses);
    showBalance();
  }
}

// Add Expenses Function
function addExpenses(expense) {
  const html = `
    <ul class="tbl_tr_content">
      <li>${expense.id}</li>
      <li>${expense.title}</li>
      <li><span>$</span>${expense.amount}</li>
      <li>
        <button type="button" class="btn_edit">Edit</button>
        <button type="button" class="btn_delete">Delete</button>
      </li>
    </ul>`;
  tablRecordEl.insertAdjacentHTML("beforeend", html);
}

// Show Balance Function (updated for chart)
function showBalance() {
  const expenses = totalExpenses();
  const budget = parseInt(budgetCardEl.textContent) || 0;
  const balance = budget - expenses;

  balanceCardEl.textContent = balance >= 0 ? balance : 0;
  expensesCardEl.textContent = expenses;

  // Update the pie chart
  updatePieChart();
}

// Total Expenses Function
function totalExpenses() {
  return itemList.reduce((acc, curr) => acc + curr.amount, 0);
}

// Error Message Function
function errorMessage(message) {
  errormsgEl.innerHTML = `<p>${message}</p>`;
  errormsgEl.classList.add("error");
  setTimeout(() => {
    errormsgEl.classList.remove("error");
  }, 2500);
}

// Chart.js Variables
const ctx = document.getElementById("budgetPieChart").getContext("2d");
let pieChart;

// Function to Render the Pie Chart
function renderPieChart(budget, expenses, balance) {
  if (pieChart) {
    pieChart.destroy(); // Destroy the old chart before creating a new one
  }

  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Budget", "Expenses", "Balance"],
      datasets: [
        {
          data: [budget, expenses, balance],
          backgroundColor: ["#1976d2", "#d32f2f", "#368e3c"], // Colors for segments
          hoverBackgroundColor: ["#1565c0", "#c62828", "#2e7d32"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}

// Update the Pie Chart when values change
function updatePieChart() {
  const budget = parseInt(budgetCardEl.textContent) || 0;
  const expenses = totalExpenses();
  const balance = budget - expenses;

  renderPieChart(budget, expenses, balance);
}

// Call Render Chart initially when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
  renderPieChart(0, 0, 0); // Default values for the chart on initial load
});
