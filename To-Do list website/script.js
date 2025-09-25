$(function () {
  const STORAGE_KEY = "todo_tasks_v1";
  let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  let currentFilter = "all"; // "all", "active", "completed"

  // Save to localStorage
  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // Render list according to tasks[] and currentFilter
  function renderTasks() {
    const $list = $("#taskList").empty();

    tasks.forEach((task) => {
      // apply filter
      if (currentFilter === "active" && task.completed) return;
      if (currentFilter === "completed" && !task.completed) return;

      const $li = $(`
        <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${task.id}">
          <div class="d-flex align-items-center">
            <input type="checkbox" class="form-check-input me-2 toggle-complete">
            <span class="task-text"></span>
          </div>
          <div class="task-actions">
            <button class="btn btn-sm btn-warning edit-task">Edit</button>
            <button class="btn btn-sm btn-danger delete-task">Delete</button>
          </div>
        </li>
      `);

      $li.find(".task-text").text(task.text).toggleClass("task-completed", task.completed);
      $li.find(".toggle-complete").prop("checked", task.completed);

      $list.append($li);
    });
  }

  // Add a new task
  function addTask(text) {
    tasks.push({ id: Date.now(), text: text.trim(), completed: false });
    saveTasks();
    renderTasks();
  }

  // Update a task's completed state
  function setTaskCompleted(id, completed) {
    const t = tasks.find((x) => x.id == id);
    if (!t) return;
    t.completed = completed;
    saveTasks();
    renderTasks();
  }

  // Edit a task
  function editTask(id, newText) {
    const t = tasks.find((x) => x.id == id);
    if (!t) return;
    t.text = newText.trim();
    saveTasks();
    renderTasks();
  }

  // Delete a task
  function deleteTask(id) {
    tasks = tasks.filter((x) => x.id != id);
    saveTasks();
    renderTasks();
  }

  // UI events
  $("#addTaskBtn").on("click", function () {
    const text = $("#taskInput").val();
    if (!text || !text.trim()) return;
    addTask(text);
    $("#taskInput").val("").focus();
  });

  // allow Enter key to add
  $("#taskInput").on("keypress", function (e) {
    if (e.key === "Enter") $("#addTaskBtn").click();
  });

  // toggle completed
  $(document).on("change", ".toggle-complete", function () {
    const id = $(this).closest("li").data("id");
    setTaskCompleted(id, $(this).prop("checked"));
  });

  // edit
  $(document).on("click", ".edit-task", function () {
    const id = $(this).closest("li").data("id");
    const t = tasks.find((x) => x.id == id);
    if (!t) return;
    const newText = prompt("Edit task:", t.text);
    if (newText !== null && newText.trim() !== "") {
      editTask(id, newText);
    }
  });

  // delete
  $(document).on("click", ".delete-task", function () {
    const id = $(this).closest("li").data("id");
    if (confirm("Delete this task?")) deleteTask(id);
  });

  // filters
  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    currentFilter = $(this).data("filter");
    renderTasks();
  });

  // initial render
  renderTasks();
});
