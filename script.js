// Select DOM elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// Modal elements
const editModal = document.getElementById('edit-modal');
const closeBtn = document.querySelector('.close-btn');
const editTaskInput = document.getElementById('edit-task-input');
const saveEditBtn = document.getElementById('save-edit-btn');

let tasks = [];
let currentFilter = 'all';
let editTaskId = null;

// Load tasks from localStorage
window.onload = function() {
    if(localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    renderTasks();
};

// Add Task
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if(taskText === '') {
        alert('Please enter a task.');
        return;
    }
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
});

// Mark as Complete or Incomplete
taskList.addEventListener('click', (e) => {
    if(e.target.classList.contains('task-text')) {
        const taskId = e.target.parentElement.dataset.id;
        toggleTaskCompletion(taskId);
    }

    if(e.target.classList.contains('delete-btn')) {
        const taskId = e.target.parentElement.parentElement.dataset.id;
        deleteTask(taskId);
    }

    if(e.target.classList.contains('edit-btn')) {
        const taskId = e.target.parentElement.parentElement.dataset.id;
        openEditModal(taskId);
    }
});

// Filter Tasks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Toggle Task Completion
function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
        if(task.id == id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// Delete Task
function deleteTask(id) {
    if(confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id != id);
        saveTasks();
        renderTasks();
    }
}

// Open Edit Modal
function openEditModal(id) {
    editTaskId = id;
    const task = tasks.find(t => t.id == id);
    editTaskInput.value = task.text;
    editModal.style.display = 'block';
}

// Close Edit Modal
closeBtn.addEventListener('click', () => {
    editModal.style.display = 'none';
});

// Save Edited Task
saveEditBtn.addEventListener('click', () => {
    const updatedText = editTaskInput.value.trim();
    if(updatedText === '') {
        alert('Task cannot be empty.');
        return;
    }
    tasks = tasks.map(task => {
        if(task.id == editTaskId) {
            return { ...task, text: updatedText };
        }
        return task;
    });
    saveTasks();
    renderTasks();
    editModal.style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if(e.target == editModal) {
        editModal.style.display = 'none';
    }
});

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if(currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if(currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;

        if(task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="edit-btn" title="Edit">&#9998;</button>
                <button class="delete-btn" title="Delete">&#10006;</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}
