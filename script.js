const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");

let tasks = JSON.parse(localStorage.getItem("todo-tasks") || "[]");

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
    checkbox.setAttribute("aria-label", "কাজটি সম্পন্ন হয়েছে");

    checkbox.addEventListener("change", () => {
      tasks[index].done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "মুছুন";
    deleteButton.className = "delete-button";

    deleteButton.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, text, deleteButton);
    list.append(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  tasks.push({ text, done: false });
  saveTasks();
  renderTasks();
  input.value = "";
  input.focus();
});

renderTasks();