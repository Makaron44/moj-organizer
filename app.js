// ===== app.js – pełna wersja z poprawkami =====

// Formatowanie daty do czytelnego formatu
function formatDateTime(isoString) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(isoString).toLocaleString('pl-PL', options);
}

// Przełączanie widoku zakładek
function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(tabName).classList.remove('hidden');
}

// Zadania
function addTask() {
  const input = document.getElementById('taskInput');
  const dateInput = document.getElementById('taskDate');
  const task = input.value.trim();
  const date = dateInput.value;

  if (!task || !date) return;

  // Zapis do localStorage
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.push({ text: task, date });
  localStorage.setItem('tasks', JSON.stringify(savedTasks));

  // Tworzenie elementu na liście
  const li = document.createElement('li');
  const spanText = document.createElement('span');
  const formattedDate = new Date(date).toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  spanText.textContent = `✅ ${task} – ${formattedDate}`;
  spanText.onclick = () => li.classList.toggle('done');

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '🗑️';
  deleteBtn.className = 'delete-btn';
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    li.remove();

    const updatedTasks = savedTasks.filter(t => !(t.text === task && t.date === date));
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  li.appendChild(spanText);
  li.appendChild(deleteBtn);
  document.getElementById('taskList').appendChild(li);

  input.value = '';
  dateInput.value = '';

  loadTasks();
}

function loadTasks() {
  const taskList = document.getElementById('taskList');
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  taskList.innerHTML = '';

  savedTasks.forEach(({ text, date }) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = `✅ ${text} – ${formatDateTime(date)}`;
    span.onclick = () => li.classList.toggle('done');

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      li.remove();

      const updated = savedTasks.filter(t => !(t.text === text && t.date === date));
      localStorage.setItem('tasks', JSON.stringify(updated));
    };

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Przypomnienia
function addReminder() {
  const text = document.getElementById('reminderText').value.trim();
  const date = document.getElementById('reminderDate').value;

  if (!text || !date) return;

  // Zapis do localStorage
  const savedReminders = JSON.parse(localStorage.getItem('reminders')) || [];
  savedReminders.push({ text, date });
  localStorage.setItem('reminders', JSON.stringify(savedReminders));

  // Tworzenie elementu na liście
  const li = document.createElement('li');
  const spanText = document.createElement('span');
  spanText.textContent = `🧠 ${text} – ${formatDateTime(date)}`;
  spanText.onclick = () => li.classList.toggle('done');

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '🗑️';
  deleteBtn.className = 'delete-btn';
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    li.remove();

    const updatedReminders = savedReminders.filter(r => !(r.text === text && r.date === date));
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
  };

  li.appendChild(spanText);
  li.appendChild(deleteBtn);
  document.getElementById('reminderList').appendChild(li);

  document.getElementById('reminderText').value = '';
  document.getElementById('reminderDate').value = '';

  loadReminders();
}

function loadReminders() {
  const reminderList = document.getElementById('reminderList');
  const savedReminders = JSON.parse(localStorage.getItem('reminders')) || [];
  reminderList.innerHTML = '';

  savedReminders.forEach(({ text, date }) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = `🧠 ${text} – ${formatDateTime(date)}`;
    span.onclick = () => li.classList.toggle('done');

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      li.remove();

      const updated = savedReminders.filter(r => !(r.text === text && r.date === date));
      localStorage.setItem('reminders', JSON.stringify(updated));
    };

    li.appendChild(span);
    li.appendChild(deleteBtn);
    reminderList.appendChild(li);
  });
}

// Lista zakupów
function addProduct() {
  const input = document.getElementById("productInput");
  const quantityInput = document.getElementById("quantityInput");
  const productName = input.value.trim();
  const quantity = parseInt(quantityInput?.value || 1);

  if (!productName) return;

  const shoppingList = document.getElementById("shoppingList");

  const item = document.createElement("div");
  item.className = "shopping-item fade-in";

  const label = document.createElement("label");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.onchange = function () {
    item.classList.toggle("checked", checkbox.checked);
    saveShoppingList();
    updateSummary();
  };

  const span = document.createElement("span");
  span.className = "product-name";
  span.textContent = quantity > 1 ? `${productName} (${quantity} szt.)` : productName;

  label.appendChild(checkbox);
  label.appendChild(span);

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.onclick = function () {
    item.classList.add("fade-out");
    setTimeout(() => {
      item.remove();
      saveShoppingList();
      updateSummary();
    }, 300);
  };

  item.appendChild(label);
  item.appendChild(deleteBtn);
  shoppingList.appendChild(item);

  input.value = "";
  if (quantityInput) quantityInput.value = "1";

  saveShoppingList();
  updateSummary();
}

function saveShoppingList() {
  const items = document.querySelectorAll(".shopping-item");
  const data = Array.from(items).map(item => {
    const checkbox = item.querySelector("input[type='checkbox']");
    const name = item.querySelector(".product-name").textContent;
    return { name, checked: checkbox.checked };
  });
  localStorage.setItem("shoppingList", JSON.stringify(data));
}

function loadShoppingList() {
  const data = JSON.parse(localStorage.getItem("shoppingList")) || [];
  for (const { name, checked } of data) {
    const shoppingList = document.getElementById("shoppingList");
    const item = document.createElement("div");
    item.className = "shopping-item";
    if (checked) item.classList.add("checked");

    const label = document.createElement("label");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    checkbox.onchange = function () {
      item.classList.toggle("checked", checkbox.checked);
      saveShoppingList();
      updateSummary();
    };

    const span = document.createElement("span");
    span.className = "product-name";
    span.textContent = name;

    label.appendChild(checkbox);
    label.appendChild(span);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.onclick = function () {
      item.classList.add("fade-out");
      setTimeout(() => {
        item.remove();
        saveShoppingList();
        updateSummary();
      }, 300);
    };

    item.appendChild(label);
    item.appendChild(deleteBtn);
    shoppingList.appendChild(item);
  }
  updateSummary();
}

function updateSummary() {
  const all = document.querySelectorAll(".shopping-item").length;
  const bought = document.querySelectorAll(".shopping-item.checked").length;
  const summary = document.getElementById("shoppingSummary");
  if (summary) {
    summary.textContent = `Kupione: ${bought} / ${all}`;
    summary.classList.remove("animate");
    void summary.offsetWidth;
    summary.classList.add("animate");
  }
}

// Tryb jasny/ciemny
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark');
  const isDark = body.classList.contains('dark');
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}
let currentDate = new Date();

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function renderCalendar() {
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const title = `${currentDate.toLocaleString('pl-PL', { month: 'long' })} ${currentYear}`;
  document.getElementById('calendarTitle').textContent = title;

  const calendarGrid = document.getElementById('calendarGrid');
  calendarGrid.innerHTML = '';

  const firstDay = new Date(currentYear, currentMonth, 1).getDay() || 7;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const weekdays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];
  weekdays.forEach(d => {
    const dayEl = document.createElement('div');
    dayEl.className = 'day-name';
    dayEl.textContent = d;
    calendarGrid.appendChild(dayEl);
  });

  for (let i = 1; i < firstDay; i++) {
    const empty = document.createElement('div');
    calendarGrid.appendChild(empty);
  }

  const today = new Date();
  const todayKey = formatDateKey(today);

  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.className = 'day';
    day.textContent = i;

    const thisDate = new Date(currentYear, currentMonth, i);
    const dateKey = formatDateKey(thisDate);

    if (dateKey === todayKey) {
      day.classList.add('today');
    }

    const note = localStorage.getItem(`note-${dateKey}`);
    if (note) {
      const icon = document.createElement('span');
      icon.textContent = '📝';
      icon.title = note;
      day.appendChild(icon);
    }

    day.onclick = () => openNotePopup(dateKey);
    calendarGrid.appendChild(day);
  }
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

function openNotePopup(dateKey) {
  const popup = document.createElement('div');
  popup.className = 'note-popup';

  const textarea = document.createElement('textarea');
  textarea.placeholder = 'Zapisz notatkę na ten dzień';
  textarea.value = localStorage.getItem(`note-${dateKey}`) || '';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = '💾 Zapisz';
  saveBtn.onclick = () => {
    localStorage.setItem(`note-${dateKey}`, textarea.value);
    document.body.removeChild(popup);
    renderCalendar();
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑️ Usuń';
  deleteBtn.onclick = () => {
    localStorage.removeItem(`note-${dateKey}`);
    document.body.removeChild(popup);
    renderCalendar();
  };

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = '❌ Anuluj';
  cancelBtn.onclick = () => document.body.removeChild(popup);

  popup.appendChild(textarea);
  popup.appendChild(saveBtn);
  popup.appendChild(deleteBtn);
  popup.appendChild(cancelBtn);

  document.body.appendChild(popup);
}
// Uruchomienie po załadowaniu strony
window.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
  loadTasks();
  loadReminders();
  loadShoppingList();
  

  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark');
  }
});

