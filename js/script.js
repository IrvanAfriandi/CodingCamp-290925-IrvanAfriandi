// Initialize todos array
let todos = [];
let currentFilter = 'all';

// Get DOM elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const dateInput = document.getElementById('dateInput');
const todoList = document.getElementById('todoList');
const filterButtons = document.querySelectorAll('.filter-btn');

// Load todos from memory on page load
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
});

// Form submit event
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo();
});

// Filter button events
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

// Add new todo
function addTodo() {
    const task = todoInput.value.trim();
    const date = dateInput.value;

    // Validation
    if (!task) {
        alert('Please enter a task description!');
        return;
    }

    if (!date) {
        alert('Please select a due date!');
        return;
    }

    // Create todo object
    const todo = {
        id: Date.now(),
        task: task,
        date: date,
        completed: false
    };

    // Add to array
    todos.push(todo);

    // Clear form
    todoInput.value = '';
    dateInput.value = '';

    // Re-render
    renderTodos();
}

// Delete todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
    }
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Render todos
function renderTodos() {
    // Filter todos based on current filter
    let filteredTodos = todos;
    
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    // Clear list
    todoList.innerHTML = '';

    // Show empty message if no todos
    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<p class="empty-message">No tasks found for this filter.</p>';
        return;
    }

    // Create todo items
    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        todoItem.innerHTML = `
            <div class="todo-left">
                <div class="checkbox-wrapper">
                    <input 
                        type="checkbox" 
                        ${todo.completed ? 'checked' : ''}
                        onchange="toggleTodo(${todo.id})"
                    >
                </div>
                <div class="todo-content">
                    <h4>${escapeHtml(todo.task)}</h4>
                    <p class="todo-date">${formatDate(todo.date)}</p>
                </div>
            </div>
            <button class="btn-delete" onclick="deleteTodo(${todo.id})">
                Delete
            </button>
        `;

        todoList.appendChild(todoItem);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}