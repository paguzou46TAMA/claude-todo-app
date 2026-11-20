const input = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const list = document.getElementById('todo-list');

let todos = loadTodos();

function loadTodos() {
  const saved = localStorage.getItem('todos');
  return saved ? JSON.parse(saved) : [];
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodo(todo, index) {
  const li = document.createElement('li');
  li.classList.toggle('done', todo.done);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.done;
  checkbox.addEventListener('change', () => {
    todos[index].done = checkbox.checked;
    li.classList.toggle('done', checkbox.checked);
    saveTodos();
  });

  const span = document.createElement('span');
  span.textContent = todo.text;

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
  todos.forEach((todo, index) => renderTodo(todo, index));
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

renderAll();
