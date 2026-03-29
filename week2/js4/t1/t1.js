// array for todo list
const todoList = [
  {
    id: 1,
    task: 'Learn HTML',
    completed: true,
  },
  {
    id: 2,
    task: 'Learn CSS',
    completed: true,
  },
  {
    id: 3,
    task: 'Learn JS',
    completed: false,
  },
  {
    id: 4,
    task: 'Learn TypeScript',
    completed: false,
  },
  {
    id: 5,
    task: 'Learn React',
    completed: false,
  },
];

// add your code here
// DOM Elements
const todoListElement = document.getElementById('todo-list');
const addBtn = document.getElementById('add-btn');
const modal = document.getElementById('add-modal');
const addForm = document.getElementById('add-form');
const todoInput = document.getElementById('todo-input');
const cancelBtn = document.getElementById('cancel-btn');
// Generate unique ID for new items
let nextId = Math.max(...todoList.map(item => item.id)) + 1;

// Render the TODO list
function renderTodoList() {
  // Clear existing list items
  todoListElement.innerHTML = '';
  // Create list items for each todo
  todoList.forEach(todo => {
    const li = document.createElement('li');
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.dataset.id = todo.id;
    // Label
    const label = document.createElement('label');
    label.textContent = todo.task;
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';
    deleteBtn.dataset.id = todo.id;
    // Append elements
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteBtn);
    // Add to list
    todoListElement.appendChild(li);
  });
  
  // Add event listeners after rendering
  addEventListeners();
}

// Event Listeners
function addEventListeners() {
  // Checkbox change events (Task 1 - Update completion status)
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckboxChange);
  });
  
  // Delete button click events (Task 2 - Delete items)
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', handleDeleteClick);
  });
}

// Update todoList Array on Item Completion
function handleCheckboxChange(event) {
  const checkbox = event.target;
  const id = parseInt(checkbox.dataset.id);
  const isChecked = checkbox.checked;
  // Find and update the todo item in the array
  const todoItem = todoList.find(todo => todo.id === id);
  if (todoItem) {
    todoItem.completed = isChecked;
  }
  console.log('Checkbox changed - Updated todoList:', todoList);
}

// Add Delete Button to List Items
function handleDeleteClick(event) {
  const deleteBtn = event.target;
  const id = parseInt(deleteBtn.dataset.id);
  // Find the index of the item to delete
  const index = todoList.findIndex(todo => todo.id === id);
  if (index !== -1) {
    // Remove from array
    todoList.splice(index, 1);
    // Remove from DOM using removeChild
    const li = deleteBtn.parentElement;
    todoListElement.removeChild(li);
    // Log the updated array
    console.log('🗑️ Item deleted - Updated todoList:', todoList);
  }
}

// Open modal when Add button is clicked
addBtn.addEventListener('click', () => {
  modal.showModal();
  todoInput.focus();
});

// Close modal when Cancel button is clicked
cancelBtn.addEventListener('click', () => {
  modal.close();
  todoInput.value = '';
});

// Handle form submission (Add new todo item)
addForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const taskName = todoInput.value.trim();
  if (taskName) {
    const newTodo = {
      id: nextId++,
      task: taskName,
      completed: false,
    };
    todoList.push(newTodo);
    console.log('Item added - Updated todoList:', todoList);
    // Re-render the list
    renderTodoList();
    // Close modal and clear input
    modal.close();
    todoInput.value = '';
  }
});

// Close modal when clicking outside
modal.addEventListener('click', (event) => {
  const rect = modal.getBoundingClientRect();
  const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
    && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
  
  if (!isInDialog) {
    modal.close();
    todoInput.value = '';
  }
});

// Initialize the TODO list on page load
document.addEventListener('DOMContentLoaded', () => {
  renderTodoList();
  console.log('Initial todoList:', todoList);
});