const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;
const DB_FILE = path.join(__dirname, 'notes.json');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

async function readNotes() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeNotes(notes) {
  await fs.writeFile(DB_FILE, JSON.stringify(notes, null, 2), 'utf8');
}

app.get('/api/notes', async (req, res) => {
  const notes = await readNotes();
  res.json(notes);
});

app.post('/api/notes', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }
  const notes = await readNotes();
  const newNote = {
    id: Date.now().toString(),
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notes.push(newNote);
  await writeNotes(notes);
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const notes = await readNotes();
  const noteIndex = notes.findIndex((n) => n.id === id);
  if (noteIndex === -1) {
    return res.status(404).json({ error: 'Note not found' });
  }
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' });
  }
  notes[noteIndex] = {
    ...notes[noteIndex],
    title: title.trim(),
    content: content.trim(),
    updatedAt: new Date().toISOString(),
  };
  await writeNotes(notes);
  res.json(notes[noteIndex]);
});

app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  const notes = await readNotes();
  const nextNotes = notes.filter((n) => n.id !== id);
  if (nextNotes.length === notes.length) {
    return res.status(404).json({ error: 'Note not found' });
  }
  await writeNotes(nextNotes);
  res.json({ success: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Note app server running on http://localhost:${PORT}`);
});
