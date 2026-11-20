const input = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const list = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-button');

let todos = loadTodos();
let currentFilter = 'all';

function loadTodos() {
  const saved = localStorage.getItem('todos');
  return saved ? JSON.parse(saved) : [];
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function matchesFilter(todo) {
  if (currentFilter === 'active') return !todo.done;
  if (currentFilter === 'done') return todo.done;
  return true;
}

function startEditing(li, span, index) {
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.value = todos[index].text;
  editInput.className = 'edit-input';

  li.replaceChild(editInput, span);
  editInput.focus();

  function finishEditing() {
    const newText = editInput.value.trim();
    if (newText !== '') {
      todos[index].text = newText;
      saveTodos();
    }
    renderAll();
  }

  editInput.addEventListener('blur', finishEditing);
  editInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      editInput.blur();
    }
  });
}

function renderTodo(todo, index) {
  const li = document.createElement('li');
  li.classList.toggle('done', todo.done);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.done;
  checkbox.addEventListener('change', () => {
    todos[index].done = checkbox.checked;
    saveTodos();
    renderAll();
  });

  const span = document.createElement('span');
  span.textContent = todo.text;
  span.addEventListener('dblclick', () => {
    startEditing(li, span, index);
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = '削除';
  deleteButton.addEventListener('click', () => {
    todos.splice(index, 1);
    saveTodos();
    renderAll();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteButton);
  list.appendChild(li);
}

function renderAll() {
  list.innerHTML = '';
  todos.forEach((todo, index) => {
    if (matchesFilter(todo)) {
      renderTodo(todo, index);
    }
  });
}

function addTodo() {
  const text = input.value.trim();
  if (text === '') return;

  todos.push({ text: text, done: false });
  saveTodos();
  renderAll();

  input.value = '';
}

addButton.addEventListener('click', addTodo);

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((b) => b.classList.toggle('active', b === button));
    renderAll();
  });
});

renderAll();
