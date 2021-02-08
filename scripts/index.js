function showFormModal() {
  const modal = document.getElementById("form-modal");
  const modalCloseButton = document.getElementById("modal-close");
  const formSubmitButton = document.getElementById("todo-form-submit");
  const tagSubmitButton = document.getElementById("tag-submit-button");
  modal.classList.add("show");
  modal.addEventListener("click", closeFormModal);
  modalCloseButton.addEventListener("click", closeFormModal);
  formSubmitButton.addEventListener("click", getFormData);
  tagSubmitButton.addEventListener("click", addTagToList);
}

function closeFormModal() {
  const modal = document.getElementById("form-modal");
  modal.classList.remove("show");
}

function addTagToList() {
  const tagInput = document.getElementById("todo-tags");
  const tagList = document.getElementById("form-tag-list");
  const newTag = document.createElement("li");
  const tagText = document.createTextNode(tagInput.value);
  newTag.appendChild(tagText);
  tagList.appendChild(newTag);
  newTag.addEventListener("click", removeTagFromList);
  tagInput.value = "";
}

function removeTagFromList() {
  const tagList = document.getElementById("form-tag-list");
  const tag = event.target;
  tagList.removeChild(tag);
}

function getFormData() {
  const form = document.getElementById("todo-form");
  const tags = document.getElementById("form-tag-list").childNodes;
  const todo = { done: false };
  const formElements = form.elements;
  for (const element of formElements) {
    todo[element.name] = element.value;
    element.value = "";
  }
  const tagArr = [];
  for (const tag of tags) {
    tagArr.push(tag.textContent);
  }
  todo["todo-tags"] = tagArr;
  addTodoToStorage(todo);
  closeFormModal();
  return false;
}

function addTodoToStorage(newTodo) {
  let todos;
  let nextId;
  if (window.todos) {
    todos = window.todos;
    const maxId = Math.max(...Object.keys(todos).map(id => parseInt(id)));
    nextId = maxId + 1;
  } else {
    todos = {};
    nextId = 1;
  }
  todos = Object.assign(todos, { [nextId]: newTodo });
  window.todos = todos;
  localStorage.setItem("todos", JSON.stringify(todos));
  refreshTodoList();
}

function getTodosFromStorage() {
  if (localStorage.key("todos")) {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));
    if (savedTodos) {
      window.todos = savedTodos;
    }
  } else {
    window.todos = {
      1: {
        done: false,
        "todo-title": "Clean the garage",
        "todo-description": "Time to clean out the filthy garage!",
        "todo-due": "2021-02-13",
        "todo-category": "home",
        "todo-tags": ["home", "cleaning"],
        "": "",
      },
      2: {
        done: false,
        "todo-title": "Zoom pub quiz with friends",
        "todo-description":
          "Have a nice few drinks and some crazy trivia with the gang 😁",
        "todo-due": "2021-02-12",
        "todo-category": "social",
        "todo-tags": ["fun", "relax", "after work"],
        "": "",
      },
      3: {
        done: false,
        "todo-title": "Finish working on Todo App",
        "todo-description": "Get this todo app working nicely",
        "todo-due": "2021-02-09",
        "todo-category": "work",
        "todo-tags": ["javascript", "css", "html", "a bit of sass"],
        "": "",
      },
    };
  }
}

function refreshTodoList() {
  let todos = window.todos;
  if (!todos) {
    return false;
  }
  console.log("refreshing...");
  const todoKeys = Object.keys(todos);
  const todoList = document.getElementById("todo-list");
  while (todoList.firstChild) {
    todoList.removeChild(todoList.firstChild);
  }
  for (const key of todoKeys) {
    const todo = todos[key];
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    if (todo["done"]) {
      todoItem.classList.add("done");
    }
    const mainInfo = document.createElement("div");
    mainInfo.classList.add("main-info");

    // Main info
    //  Checkbox
    const checkbox = document.createElement("label");
    checkbox.classList.add("checkbox");
    const checkboxInput = document.createElement("input");
    checkboxInput.setAttribute("type", "checkbox");
    checkbox.appendChild(checkboxInput);
    const checkboxSpan = document.createElement("span");
    checkboxSpan.classList.add("checkmark");
    checkbox.appendChild(checkboxSpan);
    checkbox.addEventListener("click", toggleDone(key));
    mainInfo.appendChild(checkbox);

    // Title and Category
    const todoTitle = document.createElement("h3");
    todoTitle.textContent = todo["todo-title"];
    todoTitle.classList.add("todo-title");
    mainInfo.appendChild(todoTitle);

    const categoryButton = document.createElement("button");
    categoryButton.classList.add("category");
    categoryButton.textContent = getCategoryIcon(todo["todo-category"]);
    mainInfo.appendChild(categoryButton);

    todoItem.appendChild(mainInfo);

    // More Info
    const moreInfo = document.createElement("div");
    moreInfo.classList.add("more-info");
    const dateAndDetails = document.createElement("div");
    dateAndDetails.classList.add("date-and-details");

    // Date and details
    const dateDue = document.createElement("div");
    dateDue.classList.add("date-due");
    dateDue.innerText = "Due: ";
    const dateSpan = document.createElement("span");
    dateSpan.textContent = todo["todo-due"];
    dateDue.appendChild(dateSpan);
    dateAndDetails.appendChild(dateDue);

    const details = document.createElement("div");
    details.classList.add("details");
    details.textContent = todo["todo-description"];
    dateAndDetails.appendChild(details);
    moreInfo.appendChild(dateAndDetails);

    // Tags
    const tagList = document.createElement("ul");
    tagList.classList.add("tag-list");
    const tagListHeader = document.createElement("h3");
    tagListHeader.textContent = "Tags";
    tagList.appendChild(tagListHeader);

    for (const tagText of todo["todo-tags"]) {
      const tag = document.createElement("li");
      tag.classList.add("tag");
      tag.textContent = tagText;
      tagList.appendChild(tag);
    }

    moreInfo.appendChild(tagList);
    todoItem.appendChild(moreInfo);
    todoList.appendChild(todoItem);
    todoTitle.addEventListener("click", toggleShow(moreInfo));
  }
}

function toggleDone(key) {
  return function (event) {
    event.preventDefault();
    const todo = window.todos[key];
    todo["done"] = !todo["done"];
    console.log("hi");
    console.log(todo);
    localStorage.setItem("todos", JSON.stringify(window.todos));
    refreshTodoList();
  };
}

function toggleShow(details) {
  return function (event) {
    event.preventDefault();
    details.classList.toggle("show");
  };
}

function getCategoryIcon(category) {
  switch (category) {
    case "work":
      return "💼";
    case "home":
      return "🏡";
    case "social":
      return "🥳";
    default:
      return "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  getTodosFromStorage();
  refreshTodoList();
  const addTodoButton = document.getElementById("add-todo-button");
  addTodoButton.addEventListener("click", showFormModal);
});
