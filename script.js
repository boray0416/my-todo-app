console.log("script loaded");

const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const categoryInput = document.getElementById('category-input');
const priorityInput = document.getElementById('priority-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

const sortDateBtn = document.getElementById('sort-date-btn');
const sortPriorityBtn = document.getElementById('sort-priority-btn');

const categoryFilter = document.getElementById('category-filter');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// 優先級權重，用來排序
const priorityWeight = {
  '高': 3,
  '中': 2,
  '低': 1,
};

// 預設排序：日期、篩選：全部
let currentSort = 'date';
let currentFilter = 'all';

function renderTasks() {
  let filteredTasks = [...tasks];

  // 篩選類別
  if (currentFilter !== 'all') {
    filteredTasks = filteredTasks.filter(task => task.category === currentFilter);
  }

  // 排序
  if (currentSort === 'date') {
    filteredTasks.sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  } else if (currentSort === 'priority') {
    filteredTasks.sort((a, b) => {
      if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
    });
  }

  taskList.innerHTML = '';
  filteredTasks.forEach((task) => {
    const originalIndex = tasks.findIndex(t =>
      t.name === task.name &&
      t.date === task.date &&
      t.priority === task.priority &&
      t.category === task.category
    );

    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <div class="task-info">
        ${task.name} — ${task.date} — <strong>${task.priority}</strong> — <em>${task.category}</em>
      </div>
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
  const category = categoryInput.value;
  if (!name || !date) {
    alert('請輸入任務名稱與日期');
    return;
  }
  tasks.push({ name, date, priority, category });
  taskInput.value = '';
  dateInput.value = '';
  priorityInput.value = '中';
  categoryInput.value = '工作';
  renderTasks();
});

// 刪除任務
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// 切換排序
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

// 篩選類別事件
categoryFilter.addEventListener('change', () => {
  currentFilter = categoryFilter.value;
  renderTasks();
});

sortDateBtn.addEventListener('click', () => setSort('date'));
sortPriorityBtn.addEventListener('click', () => setSort('priority'));

// 初始載入
renderTasks();
