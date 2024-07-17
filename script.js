let expenses = localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) : [];
let currentEditIndex = -1;
let totalAmount = 0;

document.getElementById('expense-form').addEventListener('submit', (e) => {
  e.preventDefault();
  let description = document.getElementById('description').value;
  let amount = parseFloat(document.getElementById('amount').value);
  let category = document.getElementById('category').value;
  expenses.push({ description, amount, category });
  localStorage.setItem('expenses', JSON.stringify(expenses));
  updateTotals();
  renderExpenses();
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('category').value = '';
});

function updateTotals() {
  totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  document.getElementById('total-amount').innerText = totalAmount.toFixed(2);
  let categoryBreakdown = {};
  expenses.forEach((expense) => {
    if (!categoryBreakdown[expense.category]) {
      categoryBreakdown[expense.category] = 0;
    }
    categoryBreakdown[expense.category] += expense.amount;
  });
  let categoryBreakdownList = document.getElementById('category-breakdown');
  categoryBreakdownList.innerHTML = '';
  Object.keys(categoryBreakdown).forEach((category) => {
    let li = document.createElement('li');
    li.innerText = `${category}: ${categoryBreakdown[category].toFixed(2)}`;
    categoryBreakdownList.appendChild(li);
  });
}

function renderExpenses() {
  let expensesList = document.getElementById('expenses');
  expensesList.innerHTML = '';
  expenses.forEach((expense, index) => {
    let expenseItem = document.createElement('li');
    expenseItem.className = 'expense-item';
    expenseItem.innerText = `${expense.description}: ${expense.amount} (${expense.category})`;
    let editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerText = 'Edit';
    editBtn.addEventListener('click', () => {
      currentEditIndex = index;
      document.getElementById('edit-description').value = expense.description;
      document.getElementById('edit-amount').value = expense.amount;
      document.getElementById('edit-category').value = expense.category;
      document.getElementById('expense-form').parentElement.style.display = 'none';
      document.getElementById('edit-form').parentElement.style.display = 'block';
    });
    let deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerText = 'Delete';
    deleteBtn.addEventListener('click', () => {
      expenses.splice(index, 1);
      localStorage.setItem('expenses', JSON.stringify(expenses));
      updateTotals();
      renderExpenses();
    });
    expenseItem.appendChild(editBtn);
    expenseItem.appendChild(deleteBtn);
    expensesList.appendChild(expenseItem);
  });
}

document.getElementById('edit-form').addEventListener('submit', (e) => {
  e.preventDefault();
  let description = document.getElementById('edit-description').value;
  let amount = parseFloat(document.getElementById('edit-amount').value);
  let category = document.getElementById('edit-category').value;
  expenses[currentEditIndex] = { description, amount, category };
  localStorage.setItem('expenses', JSON.stringify(expenses));
  updateTotals();
  renderExpenses();
  document.getElementById('expense-form').parentElement.style.display = 'block';
  document.getElementById('edit-form').parentElement.style.display = 'none';
  currentEditIndex = -1;
});

updateTotals();
renderExpenses();
