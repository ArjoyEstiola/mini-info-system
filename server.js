// server.js
// Mini Information System - Node.js + Express + EJS + MySQL
// Provides Create, Read, Update, Delete (CRUD) using MySQL database.

const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // parse form submissions
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- ROUTES ----------

// READ (list) - Page 1: Home / list of all records
app.get('/', async (req, res) => {
  try {
    const [records] = await db.query('SELECT * FROM records ORDER BY id DESC');
    res.render('index', { records, query: req.query });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error while retrieving records');
  }
});

// READ (single) - Page 2: View details of one record
app.get('/records/:id/view', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM records WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).send('Record not found');
    res.render('view', { record: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error while viewing record');
  }
});

// CREATE - Page 3: Show "Add" form
app.get('/records/add', (req, res) => {
  res.render('add');
});

// CREATE - handle form submission
app.post('/records/add', async (req, res) => {
  try {
    const { name, email, phone, department } = req.body;
    await db.query(
      'INSERT INTO records (name, email, phone, department) VALUES (?, ?, ?, ?)',
      [
        (name || '').trim(),
        (email || '').trim(),
        (phone || '').trim(),
        (department || '').trim()
      ]
    );
    res.redirect('/?msg=added');
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error while adding record');
  }
});

// UPDATE - Page 4: Show "Edit" form pre-filled
app.get('/records/:id/edit', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM records WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).send('Record not found');
    res.render('edit', { record: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error while loading edit form');
  }
});

// UPDATE - handle form submission
app.post('/records/:id/edit', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phone, department } = req.body;

    const [result] = await db.query(
      'UPDATE records SET name = ?, email = ?, phone = ?, department = ? WHERE id = ?',
      [
        (name || '').trim(),
        (email || '').trim(),
        (phone || '').trim(),
        (department || '').trim(),
        id
      ]
    );

    if (result.affectedRows === 0) return res.status(404).send('Record not found');
    res.redirect('/?msg=updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error while updating record');
  }
});

// DELETE - handle deletion (triggered by a button on the list page)
app.post('/records/:id/delete', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query('DELETE FROM records WHERE id = ?', [id]);

    if (result.affectedRows === 0) return res.status(404).send('Record not found');
    res.redirect('/?msg=deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error while deleting record');
  }
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`Mini Information System running at http://localhost:${PORT}`);
});