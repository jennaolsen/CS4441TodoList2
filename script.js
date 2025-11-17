let tasks = [];
let editingIndex = null;
let selectedIndex = null;
const STORAGE_KEY = "tasks_project_a";

// open modal
document.getElementById("newTaskBtn").onclick = () => openModal();

// add due date button
document.getElementById("showDateBtn").onclick = () => {
    document.getElementById("taskDateInput").style.display = "block";
};

// create task
document.getElementById("createTaskBtn").onclick = saveTask;

document.getElementById("deleteBtn").onclick = () => {
    if (selectedIndex !== null) {
        deleteTask(selectedIndex);
    }
};
document.getElementById("closeModalBtn").onclick = closeModal;

// load tasks
window.onload = () => {
    tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    renderTasks();
};

function openModal(isEdit = false) {
    document.getElementById("taskModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("taskModal").style.display = "none";
    document.getElementById("taskNameInput").value = "";
    document.getElementById("taskDateInput").value = "";
    document.getElementById("taskDateInput").style.display = "none";
}

function deleteTask(i) {
    tasks.splice(i, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    if (tasks.length === 0) {
        selectedIndex = null;       // no tasks left
    } else if (i >= tasks.length) {
        selectedIndex = tasks.length - 1;  // deleted the last item → select new last item
    } else {
        selectedIndex = i;          // select the item that shifted into this index
    }
    renderTasks();
}


function saveTask() {
    let name = document.getElementById("taskNameInput").value.trim();
    let date = document.getElementById("taskDateInput").value;

    if (!name) return;

    let task = { text: name, date: date || null, done: false };

    if (editingIndex !== null) {
        tasks[editingIndex] = task;
        editingIndex = null;
    } else {
        tasks.push(task);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    renderTasks();
    closeModal();
}

function renderTasks() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks
        .sort((a, b) => new Date(a.date || Infinity) - new Date(b.date || Infinity))
        .forEach((task, i) => {
            let li = document.createElement("li");

            // APPLY SELECTED STYLE HERE
            li.classList.toggle("selected", i === selectedIndex);

            li.innerHTML = `
                <input type="checkbox" ${task.done ? "checked" : ""}>
                ${task.text} ${task.date ? `(Due: ${formatDate(task.date)})` : ""}
            `;
            
            // toggle done
            li.querySelector("input").onclick = (e) => {
                e.stopPropagation();
                task.done = !task.done;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            };

            li.ondblclick = () => editTask(i);
            // CLICK (or double click) selects the task
            li.onclick = () => {
                selectedIndex = i;     // <-- THIS SWITCHES SELECTION
                renderTasks();         // <-- RE-RENDERS TO APPLY .selected CLASS
            };

            list.appendChild(li);
        });
}


function editTask(i) {
    editingIndex = i;
    let t = tasks[i];

    // fill modal
    document.getElementById("taskNameInput").value = t.text;
    if (t.date) {
        document.getElementById("taskDateInput").value = t.date;
        document.getElementById("taskDateInput").style.display = "block";
    }

    document.getElementById("modalTitle").innerText = "Edit Task";
    document.getElementById("createTaskBtn").innerText = "Save Changes";

    openModal(true);
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
}
