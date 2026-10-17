const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const timeInput = document.querySelector("#task-time");
const priorityInput = document.querySelector("#task-priority");
const list = document.querySelector("#task-list");

let tasks = JSON.parse(localStorage.getItem("todo-tasks") || "[]");
// Fill in fields for tasks saved by older versions of the app.
tasks = tasks.map((task) => ({
  ...task,
  time: task.time || "",
  priority: ["low", "medium", "high"].includes(task.priority) ? task.priority : "medium",
}));

function saveTasks() {
  localStorage.setItem("todo-tasks", JSON.stringify(tasks));
}

function renderTasks() {
  list.replaceChildren();

  tasks.forEach((task, index) => {
    const item = document.createElement("li");
    if (task.done) item.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "Completed the Task");

    checkbox.addEventListener("change", () => {
      tasks[index].done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.textContent = task.text;
    text.className = "task-text";

    const details = document.createElement("div");
    details.className = "task-details";

    const time = document.createElement("input");
    time.type = "time";
    time.value = task.time;
    time.setAttribute("aria-label", `Time for ${task.text}`);
    time.addEventListener("change", () => {
      tasks[index].time = time.value;
      saveTasks();
    });

    const priority = document.createElement("select");
    priority.className = `priority priority-${task.priority}`;
    priority.setAttribute("aria-label", `Priority for ${task.text}`);
    [["low", "Low"], ["medium", "Medium"], ["high", "High"]].forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = `${label} priority`;
      priority.append(option);
    });
    priority.value = task.priority;
    priority.addEventListener("change", () => {
      tasks[index].priority = priority.value;
      saveTasks();
      renderTasks();
    });
    details.append(time, priority);

    const moveControls = document.createElement("div");
    moveControls.className = "move-controls";
    [["↑", -1, "Move up"], ["↓", 1, "Move down"]].forEach(([label, offset, title]) => {
      const moveButton = document.createElement("button");
      moveButton.type = "button";
      moveButton.className = "move-button";
      moveButton.textContent = label;
      moveButton.title = title;
      moveButton.setAttribute("aria-label", `${title}: ${task.text}`);
      moveButton.disabled = index + offset < 0 || index + offset >= tasks.length;
      moveButton.addEventListener("click", () => {
        const target = index + offset;
        [tasks[index], tasks[target]] = [tasks[target], tasks[index]];
        saveTasks();
        renderTasks();
      });
      moveControls.append(moveButton);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";

    deleteButton.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    item.classList.add(`task-${task.priority}`);
    item.append(checkbox, text, details, moveControls, deleteButton);
    list.append(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  tasks.push({ text, done: false, time: timeInput.value, priority: priorityInput.value });
  saveTasks();
  renderTasks();
  input.value = "";
  timeInput.value = "";
  priorityInput.value = "medium";
  input.focus();
});

renderTasks();
