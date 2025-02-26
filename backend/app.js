import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isDevelopment = process.env.NODE_ENV === 'development';

app.use(cors());
app.use(express.json());

const dbPromise = open({
  filename: process.env.DB_PATH || './database.sqlite',
  driver: sqlite3.Database,
});

// Create table with updated schema
dbPromise.then(async (db) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS moods (
      id TEXT PRIMARY KEY,
      mood TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      note TEXT
    )`
  );
});

// Get all moods
app.get('/moods', async (req, res) => {
  try {
    const db = await dbPromise;
    const moods = await db.all('SELECT * FROM moods ORDER BY timestamp DESC');
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mood by ID
app.get('/moods/:id', async (req, res) => {
  try {
    const db = await dbPromise;
    const mood = await db.get('SELECT * FROM moods WHERE id = ?', req.params.id);
    if (!mood) {
      return res.status(404).json({ error: 'Mood not found' });
    }
    res.json(mood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create mood
app.post('/moods', async (req, res) => {
  try {
    const { mood, note } = req.body;
    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    const id = uuidv4();
    const timestamp = new Date().toISOString();

    const db = await dbPromise;
    await db.run(
      'INSERT INTO moods (id, mood, note, timestamp) VALUES (?, ?, ?, ?)',
      [id, mood, note || null, timestamp]
    );
    
    const newMood = await db.get('SELECT * FROM moods WHERE id = ?', id);
    res.status(201).json(newMood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update mood
app.put('/moods/:id', async (req, res) => {
  try {
    const { mood, note } = req.body;
    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    const db = await dbPromise;
    const result = await db.run(
      'UPDATE moods SET mood = ?, note = ? WHERE id = ?',
      [mood, note || null, req.params.id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Mood not found' });
    }

    const updatedMood = await db.get('SELECT * FROM moods WHERE id = ?', req.params.id);
    res.json(updatedMood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete mood
app.delete('/moods/:id', async (req, res) => {
  try {
    const db = await dbPromise;
    const result = await db.run('DELETE FROM moods WHERE id = ?', req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Mood not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Wipe database endpoint - only available in development
if (isDevelopment) {
  app.post('/wipe-db', async (req, res) => {
    try {
      const db = await dbPromise;
      await db.exec('DROP TABLE IF EXISTS moods');
      await db.exec(`
        CREATE TABLE moods (
          id TEXT PRIMARY KEY,
          mood TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          note TEXT
        )
      `);
      res.json({ message: 'Database wiped successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));