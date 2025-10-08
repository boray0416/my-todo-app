console.log("script loaded");

function deleteTask(index) {
  console.log("刪除任務", index);
  tasks.splice(index, 1);
  renderTasks();
}

const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const priorityInput = document.getElementById('priority-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

const sortDateBtn = document.getElementById('sort-date-btn');
const sortPriorityBtn = document.getElementById('sort-priority-btn');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// 優先級權重，用來排序
const priorityWeight = {
  '高': 3,
  '中': 2,
  '低': 1,
};

// 目前排序方式，預設是「依日期排序」
let currentSort = 'date';

function renderTasks() {
  let sortedTasks = [...tasks]; // 複製陣列

  if (currentSort === 'date') {
    sortedTasks.sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  } else if (currentSort === 'priority') {
    sortedTasks.sort((a, b) => {
      if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });
  }

  taskList.innerHTML = '';
  sortedTasks.forEach((task, i) => {
    // 找原始 tasks 中的 index，用來刪除
    const originalIndex = tasks.indexOf(task);

    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <div class="task-info">${task.name} — ${task.date} — <strong>${task.priority}</strong></div>
      <button onclick="deleteTask(${originalIndex})">刪除</button>
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

// 刪除任務，這邊用全域函式方便 HTML onclick 呼叫
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// 切換排序方式並更新按鈕狀態
function setSort(sortType) {
  currentSort = sortType;
  if (sortType === 'date') {
    sortDateBtn.classList.add('active');
    sortPriorityBtn.classList.remove('active');
  } else {
    sortPriorityBtn.classList.add('active');
    sortDateBtn.classList.remove('active');
  }
  renderTasks();
}

sortDateBtn.addEventListener('click', () => setSort('date'));
sortPriorityBtn.addEventListener('click', () => setSort('priority'));

// 頁面初始渲染
renderTasks();

