const API_BASE = '/api/notes';
const notesListEl = document.getElementById('notes-list');
const noteForm = document.getElementById('note-form');
const formTitle = document.getElementById('form-title');
const cancelEditButton = document.getElementById('cancel-edit');
const noteIdInput = document.getElementById('note-id');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');

async function fetchNotes() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Error fetching notes');
  return res.json();
}

function formatDate(ts) {
  return new Date(ts).toLocaleString();
}

async function renderNotes() {
  try {
    const notes = await fetchNotes();
    if (!notes.length) {
      notesListEl.innerHTML = '<p>No notes yet. Add one to get started.</p>';
      return;
    }
    notesListEl.innerHTML = notes.map((note) => `
      <article class="note-card">
        <h3>${escapeHtml(note.title)}</h3>
        <div class="note-meta">${formatDate(note.updatedAt || note.createdAt)}</div>
        <p>${escapeHtml(note.content)}</p>
        <div class="actions">
          <button class="edit" data-id="${note.id}">Edit</button>
          <button class="delete" data-id="${note.id}">Delete</button>
        </div>
      </article>
    `).join('');
    attachCardHandlers();
  } catch (err) {
    notesListEl.innerHTML = `<p class="error">Unable to load notes: ${err.message}</p>`;
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function attachCardHandlers() {
  document.querySelectorAll('.edit').forEach((button) => {
    button.addEventListener('click', () => startEdit(button.dataset.id));
  });
  document.querySelectorAll('.delete').forEach((button) => {
    button.addEventListener('click', () => deleteNote(button.dataset.id));
  });
}

async function startEdit(id) {
  const notes = await fetchNotes();
  const note = notes.find((n) => n.id === id);
  if (!note) return;
  noteIdInput.value = note.id;
  noteTitleInput.value = note.title;
  noteContentInput.value = note.content;
  formTitle.textContent = 'Edit Note';
  cancelEditButton.classList.remove('hidden');
  noteTitleInput.focus();
}

function resetForm() {
  noteIdInput.value = '';
  noteForm.reset();
  formTitle.textContent = 'Create Note';
  cancelEditButton.classList.add('hidden');
}

noteForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = noteIdInput.value;
  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();

  if (!title || !content) {
    alert('Fill title and content');
    return;
  }

  try {
    if (id) {
      await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
    } else {
      await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
    }
    resetForm();
    await renderNotes();
  } catch (err) {
    alert('Failed to save note: ' + err.message);
  }
});

cancelEditButton.addEventListener('click', resetForm);

async function deleteNote(id) {
  if (!confirm('Delete this note?')) return;
  await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  renderNotes();
}

renderNotes();
