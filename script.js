const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const priorityInput = document.getElementById('priority-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// 優先級權重，用來排序
const priorityWeight = {
  '高': 3,
  '中': 2,
  '低': 1,
};

function renderTasks() {
  tasks.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    // 日期相同，比較優先級
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  taskList.innerHTML = '';
  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <div class="task-info">${task.name} — ${task.date} — <strong>${task.priority}</strong></div>
      <button onclick="deleteTask(${i})">刪除</button>
    `;
    taskList.appendChild(li);
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

addBtn.addEventListener('click', () => {
  const name = taskInput.value.trim();
  const date = dateInput.value;
  const priority = priorityInput.value;
  if (!name || !date) {
    alert('請輸入任務名稱與日期');
    return;
  }
  tasks.push({ name, date, priority });
  taskInput.value = '';
  dateInput.value = '';
  priorityInput.value = '中';
  renderTasks();
});

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

renderTasks();
