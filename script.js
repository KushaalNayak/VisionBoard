// --- GoalSetter App Logic ---

const goalForm = document.getElementById('goalForm');
const goalInput = document.getElementById('goalInput');
const deadlineInput = document.getElementById('deadlineInput');
const goalsList = document.getElementById('goalsList');
const motivationalQuote = document.getElementById('motivationalQuote');
const darkModeToggle = document.getElementById('darkModeToggle');

const QUOTES = [
  "Success is the sum of small efforts, repeated day in and day out.",
  "Dream big. Start small. Act now.",
  "Discipline is the bridge between goals and accomplishment.",
  "Don’t watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Stay focused and never give up.",
  "You are capable of amazing things.",
  "Crush your goals!"
];

function getGoals() {
  return JSON.parse(localStorage.getItem('goals') || '[]');
}
function saveGoals(goals) {
  localStorage.setItem('goals', JSON.stringify(goals));
}

function showRandomQuote() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  motivationalQuote.textContent = quote;
}

function renderGoals() {
  const goals = getGoals();
  goalsList.innerHTML = '';
  if (goals.length === 0) {
    goalsList.innerHTML = '<p style="text-align:center;color:#aaa;">No goals yet. Add one above!</p>';
    return;
  }
  goals.forEach((goal, idx) => {
    const card = document.createElement('div');
    card.className = 'goal-card' + (goal.completed ? ' completed' : '');

    const title = document.createElement('div');
    title.className = 'goal-title';
    title.textContent = goal.title;
    card.appendChild(title);

    if (goal.deadline) {
      const deadline = document.createElement('div');
      deadline.className = 'goal-deadline';
      deadline.textContent = `Deadline: ${goal.deadline}`;
      card.appendChild(deadline);
    }

    const progressSection = document.createElement('div');
    progressSection.className = 'goal-progress-section';
    const progressBar = document.createElement('div');
    progressBar.className = 'goal-progress-bar';
    const progressFill = document.createElement('div');
    progressFill.className = 'goal-progress-fill';
    progressFill.style.width = ((goal.progress || 0) + '%');
    progressBar.appendChild(progressFill);
    progressSection.appendChild(progressBar);
    const progressLabel = document.createElement('span');
    progressLabel.className = 'goal-progress-label';
    progressLabel.textContent = `${goal.progress || 0}% done`;
    progressSection.appendChild(progressLabel);
    const progressInput = document.createElement('input');
    progressInput.type = 'range';
    progressInput.min = 0;
    progressInput.max = 100;
    progressInput.value = goal.progress || 0;
    progressInput.className = 'goal-progress-range';
    progressInput.oninput = (e) => {
      updateGoalProgress(idx, parseInt(e.target.value, 10));
    };
    progressSection.appendChild(progressInput);
    card.appendChild(progressSection);

    const actions = document.createElement('div');
    actions.className = 'goal-actions';

    const doneBtn = document.createElement('button');
    doneBtn.className = 'mark-done-btn' + (goal.completed ? ' completed' : '');
    doneBtn.textContent = goal.completed ? 'Undo' : 'Mark as Done';
    doneBtn.onclick = () => toggleGoalCompleted(idx);
    actions.appendChild(doneBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteGoal(idx);
    actions.appendChild(deleteBtn);

    card.appendChild(actions);
    goalsList.appendChild(card);
  });
}

goalForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const title = goalInput.value.trim();
  const deadline = deadlineInput.value;
  if (!title) return;
  const goals = getGoals();
  goals.push({ title, deadline, completed: false, progress: 0 });
  saveGoals(goals);
  goalInput.value = '';
  deadlineInput.value = '';
  renderGoals();
});

function toggleGoalCompleted(idx) {
  const goals = getGoals();
  goals[idx].completed = !goals[idx].completed;
  saveGoals(goals);
  renderGoals();
}

function deleteGoal(idx) {
  const goals = getGoals();
  goals.splice(idx, 1);
  saveGoals(goals);
  renderGoals();
}

function updateGoalProgress(idx, value) {
  const goals = getGoals();
  goals[idx].progress = value;
  saveGoals(goals);
  renderGoals();
}

function setDarkMode(on) {
  if (on) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', '1');
    darkModeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', '0');
    darkModeToggle.textContent = '🌙';
  }
}
darkModeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  setDarkMode(!isDark);
});
window.addEventListener('DOMContentLoaded', () => {
  showRandomQuote();
  renderGoals();
  const dark = localStorage.getItem('darkMode') === '1';
  setDarkMode(dark);
}); 