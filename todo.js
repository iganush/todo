const button = document.getElementById('done');
const taskInput = document.getElementById('todo');
const descInput = document.getElementById('Description');
const prioritySelect = document.getElementById('task-priority');
const categorySelect = document.getElementById('Category');
const dateInput = document.getElementById('task-date');
const taskList = document.getElementById('list');
const searchInput = document.getElementById('Search');
const filterButtons = document.querySelectorAll('.button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// ✅ Display tasks
function displayTasks(filtered = "all", search = "") {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (filtered === "completed") return task.completed;
    if (filtered === "active") return !task.completed;
    return true;
  });

  filteredTasks = filteredTasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""} data-index="${index}">
      <span class="task-title ${task.completed ? "done" : ""}">${task.title}</span>
      <div class="task-meta">
        <small>📌 ${task.priority} | 🗂️ ${task.category} | 📅 ${task.date}</small>
        ${task.description ? `<p class="task-desc">${task.description}</p>` : ""}
      </div>
      <button class="delete-btn" data-index="${index}">❌</button>
    `;
    taskList.appendChild(li);
  });
}

// ✅ Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ✅ Add Task
button.addEventListener("click", () => {
  const title = taskInput.value.trim();
  const description = descInput.value.trim();
  const priority = prioritySelect.value;
  const category = categorySelect.value;
  const date = dateInput.value;

  if (!title) return alert("Task title can't be empty");

  const task = {
    title,
    description,
    priority,
    category,
    date,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  displayTasks();
  clearForm();
});

// ✅ Clear form fields
function clearForm() {
  taskInput.value = "";
  descInput.value = "";
  prioritySelect.value = "high";
  categorySelect.value = "personal";
  dateInput.value = "";
}

// ✅ Toggle complete / delete task
taskList.addEventListener("click", e => {
  const index = e.target.dataset.index;
  if (e.target.classList.contains("task-check")) {
    tasks[index].completed = e.target.checked;
  }

  if (e.target.classList.contains("delete-btn")) {
    tasks.splice(index, 1);
  }

  saveTasks();
  displayTasks();
});

// ✅ Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const filterType = btn.textContent.toLowerCase().trim(); // "All Tasks", "Active", etc.
    let key = "all";
    if (filterType.includes("active")) key = "active";
    if (filterType.includes("completed")) key = "completed";
    displayTasks(key, searchInput.value);
  });
});

// ✅ Search input
searchInput.addEventListener("input", () => {
  displayTasks("all", searchInput.value);
});

// ✅ Load tasks on page load
displayTasks();
