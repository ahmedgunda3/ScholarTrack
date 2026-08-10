const STORAGE_KEY = 'scholartrack_state_v1';
const DEFAULT_SUBJECTS = [
  { name: 'English', icon: 'E', color: '#5377ff' },
  { name: 'Math', icon: 'M', color: '#16a34a' },
  { name: 'Science', icon: 'S', color: '#8b5cf6' },
  { name: 'ICT', icon: 'I', color: '#14b8a6' },
  { name: 'Geography', icon: 'G', color: '#f59e0b' }
];
const SUBJECT_COLORS = ['#5377ff', '#0ea5e9', '#22c55e', '#f97316', '#8b5cf6', '#ef4444', '#14b8a6', '#f59e0b', '#ec4899', '#10b981'];

function getDefaultSubjectEntry(subjectInfo) {
  return {
    name: subjectInfo.name,
    icon: subjectInfo.icon,
    color: subjectInfo.color,
    items: [],
    learned: [],
    note: '',
    pdfText: '',
    pdfName: '',
    pdfStatus: 'No file uploaded yet.',
    pdfMastery: { totalTopics: 0, masteredTopics: 0, matched: [] }
  };
}

function getDefaultState() {
  const subjects = {};
  DEFAULT_SUBJECTS.forEach((subject) => {
    subjects[subject.name] = getDefaultSubjectEntry(subject);
  });

  return {
    subjects,
    filters: {
      subject: 'all',
      status: 'all',
      sort: 'dueSoon'
    }
  };
}

function normalizeState(rawState) {
  const base = getDefaultState();
  const merged = {
    subjects: { ...base.subjects },
    filters: { ...base.filters, ...(rawState?.filters || {}) }
  };

  const incomingSubjects = rawState?.subjects || {};
  Object.keys(incomingSubjects).forEach((subjectName) => {
    const source = incomingSubjects[subjectName] || {};
    const baseEntry = base.subjects[subjectName] || {
      name: subjectName,
      icon: subjectName.slice(0, 1).toUpperCase(),
      color: SUBJECT_COLORS[Object.keys(merged.subjects).length % SUBJECT_COLORS.length],
      items: [],
      learned: [],
      note: '',
      pdfText: '',
      pdfName: '',
      pdfStatus: 'No file uploaded yet.',
      pdfMastery: { totalTopics: 0, masteredTopics: 0, matched: [] }
    };

    merged.subjects[subjectName] = {
      ...baseEntry,
      ...source,
      items: Array.isArray(source.items) ? source.items : [],
      learned: Array.isArray(source.learned) ? source.learned : []
    };
  });

  return merged;
}

let state = loadState();

const subjectGrid = document.getElementById('subject-grid');
const filterSubject = document.getElementById('filter-subject');
const filterStatus = document.getElementById('filter-status');
const filterSort = document.getElementById('filter-sort');
const reportPanel = document.getElementById('weekly-report');
const importFileInput = document.getElementById('import-file');

initializeApp();

function initializeApp() {
  bindGlobalControls();
  bindFilterControls();
  render();
}

function bindGlobalControls() {
  document.getElementById('add-subject-btn').addEventListener('click', addCustomSubject);
  document.getElementById('export-data-btn').addEventListener('click', exportData);
  document.getElementById('import-data-btn').addEventListener('click', () => importFileInput.click());
  importFileInput.addEventListener('change', handleImportFile);
}

function bindFilterControls() {
  filterSubject.addEventListener('change', (event) => {
    state.filters.subject = event.target.value;
    saveState();
    render();
  });

  filterStatus.addEventListener('change', (event) => {
    state.filters.status = event.target.value;
    saveState();
    render();
  });

  filterSort.addEventListener('change', (event) => {
    state.filters.sort = event.target.value;
    saveState();
    render();
  });
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initial = getDefaultState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return normalizeState(JSON.parse(stored));
  } catch (error) {
    console.warn('Could not load saved state. Resetting.', error);
    const initial = getDefaultState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function buildSubjectOptions() {
  if (!filterSubject) return;
  filterSubject.innerHTML = '<option value="all">All subjects</option>';
  getSubjectEntries().forEach((subject) => {
    const option = document.createElement('option');
    option.value = subject.name;
    option.textContent = subject.name;
    filterSubject.appendChild(option);
  });

  filterSubject.value = state.filters.subject || 'all';
  filterStatus.value = state.filters.status || 'all';
  filterSort.value = state.filters.sort || 'dueSoon';
}

function render() {
  renderOverview();
  renderWeeklyReport();
  renderSubjectCards();
  buildSubjectOptions();
}

function renderOverview() {
  const allItems = getAllTasks();
  const completed = allItems.filter((item) => item.completed).length;
  const total = allItems.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById('overall-progress-label').textContent = `${completed}/${total} done`;
  document.getElementById('overall-progress-fill').style.width = `${percentage}%`;
}

function renderWeeklyReport() {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  let completedThisWeek = 0;
  let tasksThisWeek = 0;
  let dueSoon = 0;
  let overdue = 0;
  let mostActiveSubject = 'None';
  let strongestCount = 0;

  getSubjectEntries().forEach((subject) => {
    const count = (subject.items || []).filter((item) => {
      if (!item.dueAt) return false;
      const dueDate = new Date(item.dueAt);
      return dueDate >= startOfWeek && dueDate < endOfWeek;
    }).length;

    if (count > strongestCount) {
      strongestCount = count;
      mostActiveSubject = subject.name;
    }
  });

  getAllTasks().forEach((item) => {
    if (item.completed) {
      const completedAt = new Date(item.createdAt || item.dueAt || now);
      if (completedAt >= startOfWeek && completedAt < endOfWeek) {
        completedThisWeek += 1;
      }
    }

    if (item.dueAt) {
      const dueDate = new Date(item.dueAt);
      if (dueDate >= startOfWeek && dueDate < endOfWeek) tasksThisWeek += 1;
      if (!item.completed && dueDate < now) overdue += 1;

      const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (!item.completed && diffHours <= 168 && diffHours >= 0) dueSoon += 1;
    }
  });

  reportPanel.innerHTML = `
    <h3>Weekly report</h3>
    <div class="report-grid">
      <div class="report-box"><strong>${completedThisWeek}</strong><span>Completed this week</span></div>
      <div class="report-box"><strong>${tasksThisWeek}</strong><span>Tasks due this week</span></div>
      <div class="report-box"><strong>${dueSoon}</strong><span>Upcoming in 7 days</span></div>
      <div class="report-box"><strong>${overdue}</strong><span>Overdue</span></div>
      <div class="report-box"><strong>${mostActiveSubject}</strong><span>Most active subject</span></div>
    </div>
  `;
}

function renderSubjectCards() {
  const subjectFilter = state.filters.subject;
  const statusFilter = state.filters.status;
  const sortMode = state.filters.sort;

  const visibleSubjects = getSubjectEntries().filter((subject) => {
    if (subjectFilter !== 'all' && subject.name !== subjectFilter) return false;
    return true;
  });

  subjectGrid.innerHTML = '';

  visibleSubjects.forEach((subjectMeta) => {
    const subjectState = state.subjects[subjectMeta.name];
    const items = [...subjectState.items]
      .filter((item) => {
        if (statusFilter === 'done' && !item.completed) return false;
        if (statusFilter === 'pending' && item.completed) return false;
        return true;
      })
      .sort((a, b) => sortTasks(a, b, sortMode));

    const doneCount = subjectState.items.filter((item) => item.completed).length;
    const totalCount = subjectState.items.length;
    const masterySummary = calculateMastery(subjectMeta.name);

    const card = document.createElement('section');
    card.className = 'subject-card';
    card.innerHTML = `
      <div class="subject-header">
        <div class="subject-brand">
          <div class="subject-token" style="background:${subjectMeta.color}22; color:${subjectMeta.color};">${subjectMeta.icon || subjectMeta.name.slice(0, 1).toUpperCase()}</div>
          <div>
            <p class="subject-title">${escapeHtml(subjectMeta.name)}</p>
          </div>
        </div>
        <div class="subject-progress">${doneCount}/${totalCount} done</div>
      </div>

      <div class="subject-body">
        <div class="meta-row">
          <div class="panel-box">
            <h3>What I learnt</h3>
            <ul class="learned-list">
              ${subjectState.learned.length ? subjectState.learned.map((topic) => `
                <li class="learned-item">
                  <span>${escapeHtml(topic)}</span>
                  <button class="tag-delete" data-delete-topic="${escapeHtml(topic)}" type="button" aria-label="Remove learned topic">×</button>
                </li>
              `).join('') : '<li class="empty-state">No written notes yet.</li>'}
            </ul>
            <form class="learned-form" data-learned-form="${escapeHtml(subjectMeta.name)}">
              <input name="topic" type="text" placeholder="Add a mastered topic" maxlength="100" required />
              <button class="primary-button" type="submit">Add</button>
            </form>
          </div>

          <div class="panel-box">
            <h3>Mastery check</h3>
            <div class="mastery-summary">
              <p><strong>${masterySummary.mastered}</strong> / <strong>${masterySummary.total}</strong> topics mastered</p>
              <p>${masterySummary.message}</p>
            </div>
            <label class="pdf-upload">
              <span>Upload PDF textbook</span>
              <input type="file" accept="application/pdf,.pdf" data-pdf-upload="${escapeHtml(subjectMeta.name)}" />
              <small>${subjectState.pdfStatus || 'No file uploaded yet.'}</small>
            </label>
          </div>
        </div>

        <div class="panel-box">
          <h3>Subject note</h3>
          <textarea class="subject-note" data-subject-note="${escapeHtml(subjectMeta.name)}" placeholder="What did you learn or struggle with in this subject?">${escapeHtml(subjectState.note || '')}</textarea>
        </div>

        <div class="panel-box">
          <h3>Tasks</h3>
          <form class="task-form" data-task-form="${escapeHtml(subjectMeta.name)}">
            <input name="taskText" type="text" placeholder="Homework, revision, assignment..." maxlength="140" required />
            <input name="taskDue" type="datetime-local" />
            <button class="primary-button" type="submit">Add task</button>
          </form>
          <ul class="task-list">
            ${items.length ? items.map((item) => `
              <li class="task-item ${item.completed ? 'completed' : ''}" data-task-id="${item.id}">
                <input class="task-check" data-toggle-complete="${item.id}" type="checkbox" ${item.completed ? 'checked' : ''} />
                <div class="task-main">
                  <div class="task-text">${escapeHtml(item.text)}</div>
                  <div class="task-meta">
                    ${item.dueAt ? `Due: ${formatDateTime(item.dueAt)}` : 'No due date'}
                    ${item.completed ? ' • Completed' : ''}
                  </div>
                </div>
                <div class="task-actions">
                  <button class="secondary-button" data-edit-task="${item.id}" type="button">Edit</button>
                  <button class="danger-button" data-delete-task="${item.id}" type="button">Delete</button>
                </div>
              </li>
            `).join('') : '<li class="empty-state">No tasks for this subject.</li>'}
          </ul>
        </div>
      </div>
    `;

    const learnedForm = card.querySelector('[data-learned-form]');
    learnedForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = learnedForm.querySelector('input[name="topic"]');
      const value = input.value.trim();
      if (!value) return;
      state.subjects[subjectMeta.name].learned.push(value);
      saveState();
      render();
    });

    card.querySelectorAll('[data-delete-topic]').forEach((button) => {
      button.addEventListener('click', () => {
        const topic = button.getAttribute('data-delete-topic');
        state.subjects[subjectMeta.name].learned = state.subjects[subjectMeta.name].learned.filter((entry) => entry !== topic);
        saveState();
        render();
      });
    });

    const noteField = card.querySelector('[data-subject-note]');
    noteField.addEventListener('input', (event) => {
      state.subjects[subjectMeta.name].note = event.target.value;
      saveState();
    });

    const taskForm = card.querySelector('[data-task-form]');
    taskForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(taskForm);
      const text = String(formData.get('taskText') || '').trim();
      const due = String(formData.get('taskDue') || '').trim();
      if (!text) return;

      state.subjects[subjectMeta.name].items.push({
        id: generateId(),
        text,
        dueAt: due || null,
        completed: false,
        createdAt: Date.now(),
        notified: false
      });

      taskForm.reset();
      saveState();
      render();
    });

    card.querySelectorAll('[data-toggle-complete]').forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const taskId = checkbox.getAttribute('data-toggle-complete');
        const item = state.subjects[subjectMeta.name].items.find((entry) => entry.id === taskId);
        if (!item) return;
        item.completed = checkbox.checked;
        saveState();
        render();
      });
    });

    card.querySelectorAll('[data-edit-task]').forEach((button) => {
      button.addEventListener('click', () => {
        const taskId = button.getAttribute('data-edit-task');
        const item = state.subjects[subjectMeta.name].items.find((entry) => entry.id === taskId);
        if (!item) return;

        const updatedText = prompt('Edit task', item.text);
        if (updatedText === null) return;
        if (updatedText.trim()) item.text = updatedText.trim();

        const nextDue = prompt('Edit due date/time (leave blank to clear)', item.dueAt || '');
        if (nextDue !== null) item.dueAt = nextDue.trim() || null;

        saveState();
        render();
      });
    });

    card.querySelectorAll('[data-delete-task]').forEach((button) => {
      button.addEventListener('click', () => {
        const taskId = button.getAttribute('data-delete-task');
        state.subjects[subjectMeta.name].items = state.subjects[subjectMeta.name].items.filter((entry) => entry.id !== taskId);
        saveState();
        render();
      });
    });

    const pdfInput = card.querySelector('[data-pdf-upload]');
    pdfInput.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        alert('Please choose a valid PDF file.');
        event.target.value = '';
        return;
      }

      try {
        const text = await extractPdfText(file);
        state.subjects[subjectMeta.name].pdfText = text;
        state.subjects[subjectMeta.name].pdfName = file.name;
        state.subjects[subjectMeta.name].pdfStatus = `Uploaded: ${file.name}`;
        state.subjects[subjectMeta.name].pdfMastery = computePdfMastery(subjectMeta.name, text);
        saveState();
        render();
      } catch (error) {
        console.error('PDF upload failed:', error);
        state.subjects[subjectMeta.name].pdfStatus = 'Could not read this PDF. Please try another file.';
        saveState();
        render();
      }
    });

    subjectGrid.appendChild(card);
  });
}

function addCustomSubject() {
  const name = prompt('Name your subject:', 'Biology');
  if (name === null) return;

  const trimmed = name.trim();
  if (!trimmed) return;
  if (Object.prototype.hasOwnProperty.call(state.subjects, trimmed)) {
    alert('That subject already exists.');
    return;
  }

  const nextIndex = Object.keys(state.subjects).length;
  state.subjects[trimmed] = {
    name: trimmed,
    icon: trimmed.slice(0, 1).toUpperCase(),
    color: SUBJECT_COLORS[nextIndex % SUBJECT_COLORS.length],
    items: [],
    learned: [],
    note: '',
    pdfText: '',
    pdfName: '',
    pdfStatus: 'No file uploaded yet.',
    pdfMastery: { totalTopics: 0, masteredTopics: 0, matched: [] }
  };

  state.filters.subject = 'all';
  saveState();
  render();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const urlObject = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = urlObject;
  link.download = 'scholartrack-backup.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(urlObject);
}

function handleImportFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      state = normalizeState(parsed);
      saveState();
      render();
      alert('Your backup has been imported successfully.');
    } catch (error) {
      console.error('Import failed:', error);
      alert('This backup file could not be read.');
    } finally {
      importFileInput.value = '';
    }
  };
  reader.readAsText(file);
}

function getAllTasks() {
  return getSubjectEntries().flatMap((subject) => subject.items || []);
}

function getSubjectEntries() {
  return Object.keys(state.subjects).map((subjectName) => ({
    ...state.subjects[subjectName],
    name: subjectName
  }));
}

function calculateMastery(subjectName) {
  const subjectState = state.subjects[subjectName];
  const topics = subjectState.learned || [];
  const pdfText = subjectState.pdfText || '';

  if (!pdfText && !topics.length) {
    return { total: 0, mastered: 0, message: 'Add a topic or upload a textbook PDF to track mastery.' };
  }

  const normalizedPdf = normalizeText(pdfText);
  const matched = topics.filter((topic) => {
    const normalizedTopic = normalizeText(topic);
    if (!normalizedTopic) return false;
    return normalizedPdf.includes(normalizedTopic);
  });

  const total = Math.max(topics.length, matched.length, subjectState.pdfMastery?.totalTopics || 0);
  const mastered = matched.length;

  return {
    total,
    mastered,
    message: total === 0 ? 'No content to measure yet.' : mastered >= total ? 'You have mastered all tracked topics in this subject.' : `${Math.max(0, total - mastered)} more topic(s) to review.`
  };
}

function computePdfMastery(subjectName, pdfText) {
  const subjectState = state.subjects[subjectName];
  const learnedTopics = subjectState.learned || [];
  const normalizedPdf = normalizeText(pdfText || '');

  if (!pdfText || !learnedTopics.length) {
    return { totalTopics: 0, masteredTopics: 0, matched: [] };
  }

  const matched = learnedTopics.filter((topic) => {
    const normalizedTopic = normalizeText(topic);
    return normalizedTopic && normalizedPdf.includes(normalizedTopic);
  });

  return { totalTopics: learnedTopics.length, masteredTopics: matched.length, matched };
}

function extractPdfText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const pdfData = new Uint8Array(reader.result);
        const pdf = await window.pdfjsLib.getDocument({ data: pdfData }).promise;
        let allText = '';

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const textContent = await page.getTextContent();
          const strings = textContent.items.map((item) => item.str || '').join(' ');
          allText += `${strings}\n`;
        }

        resolve(allText.trim());
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Unable to read PDF file.'));
    reader.readAsArrayBuffer(file);
  });
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No date';
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function sortTasks(a, b, mode) {
  const aDue = a.dueAt ? new Date(a.dueAt).getTime() : Number.POSITIVE_INFINITY;
  const bDue = b.dueAt ? new Date(b.dueAt).getTime() : Number.POSITIVE_INFINITY;

  switch (mode) {
    case 'subject':
      return a.text.localeCompare(b.text);
    case 'status':
      return Number(a.completed) - Number(b.completed);
    case 'newest':
      return (b.createdAt || 0) - (a.createdAt || 0);
    case 'dueSoon':
    default:
      if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
      return aDue - bDue;
  }
}

function generateId() {
  return `task-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
