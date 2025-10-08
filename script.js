// 取得 DOM 元素
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

// 讀取 localStorage 中的任務
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// 顯示任務函式
function renderTasks() {
  // 先依日期排序（從最近的日期排到最早）
  tasks.sort((a, b) => {
    // 比較日期字串（YYYY-MM-DD 格式） => 早的在前
    if (a.date < b.date) return -1;
    else if (a.date > b.date) return 1;
    else return 0;
  });

  taskList.innerHTML = ''; // 清空列表
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <span>${task.name} — ${task.date}</span>
      <button onclick="deleteTask(${i})">刪除</button>
    `;
    taskList.appendChild(li);
  }

  // 存回 localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 新增任務
addBtn.addEventListener('click', () => {
  const name = taskInput.value.trim();
  const date = dateInput.value;
  if (!name || !date) {
    alert('請輸入任務名稱與日期');
    return;
  }
  tasks.push({ name, date });
  taskInput.value = '';
  dateInput.value = '';
  renderTasks();
});

// 刪除任務
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// 初次載入時顯示任務
renderTasks();
