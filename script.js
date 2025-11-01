const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const allBtn = document.getElementById("all");
const completedBtn = document.getElementById("completed");
const pendingBtn = document.getElementById("pending");
const clearAllBtn = document.getElementById("clearAll");
const toggleThemeBtn = document.getElementById("toggleTheme");

let currentFilter = "all";
let draggedItem = null;

// Load tasks from localStorage
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => addTask(task.text, task.completed));
};

// Add new task
addBtn.addEventListener("click", () => {
  if (taskInput.value.trim() !== "") {
    addTask(taskInput.value, false);
    saveTasks();
    taskInput.value = "";
  }
});

// Add task function
function addTask(text, completed) {
  const li = document.createElement("li");
  li.textContent = text;
  li.draggable = true;
  if (completed) li.classList.add("completed");

  const actions = document.createElement("span");
  actions.classList.add("task-actions");

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const newText = prompt("Edit task:", li.firstChild.textContent);
    if (newText) {
      li.firstChild.textContent = newText;
      saveTasks();
    }
  });

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
  });

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);
  li.appendChild(actions);

  // Toggle complete
  li.addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  // Drag events
  li.addEventListener("dragstart", () => {
    draggedItem = li;
    setTimeout(() => li.style.display = "none", 0);
  });

  li.addEventListener("dragend", () => {
    draggedItem.style.display = "flex";
    draggedItem = null;
    saveTasks();
  });

  li.addEventListener("dragover", (e) => e.preventDefault());

  li.addEventListener("drop", (e) => {
    e.preventDefault();
    if (li !== draggedItem) {
      taskList.insertBefore(draggedItem, li.nextSibling);
    }
  });

  taskList.appendChild(li);
  applyFilter();
}

// Save tasks
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({ text: li.firstChild.textContent, completed: li.classList.contains("completed") });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filters
allBtn.addEventListener("click", () => { currentFilter = "all"; applyFilter(); });
completedBtn.addEventListener("click", () => { currentFilter = "completed"; applyFilter(); });
pendingBtn.addEventListener("click", () => { currentFilter = "pending"; applyFilter(); });

function applyFilter() {
  document.querySelectorAll("#taskList li").forEach(li => {
    li.style.display = "flex";
    if (currentFilter === "completed" && !li.classList.contains("completed")) li.style.display = "none";
    if (currentFilter === "pending" && li.classList.contains("completed")) li.style.display = "none";
  });
}

// Clear all
clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    taskList.innerHTML = "";
    saveTasks();
  }
});

// Dark/light mode
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleThemeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
const progressBar = document.getElementById("progressBar");

// Update progress bar
function updateProgress() {
  const tasks = document.querySelectorAll("#taskList li");
  if (tasks.length === 0) {
    progressBar.style.width = "0%";
    return;
  }
  const completedTasks = document.querySelectorAll("#taskList li.completed").length;
  const percent = (completedTasks / tasks.length) * 100;
  progressBar.style.width = percent + "%";
}

// Call updateProgress whenever tasks change
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({ text: li.firstChild.textContent, completed: li.classList.contains("completed") });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateProgress();
}

// Also call it after adding a task
addTask = ((originalAddTask) => {
  return function(text, completed) {
    originalAddTask(text, completed);
    updateProgress();
  };
})(addTask);
