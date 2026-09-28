// server.js
<<<<<<< HEAD
// Mini Information System - Node.js + Express + EJS + MySQL

const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
=======
// Mini Information System - Node.js + Express + EJS
// Provides Create, Read, Update, Delete (CRUD) for a simple "records" resource.

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'records.json');
>>>>>>> 7d06ea87b6518f447d31a24465ea0ff1c8ebae05

// ---------- Middleware ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
<<<<<<< HEAD
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Pull and trim form fields
function clean(body) {
  const f = v => (v || '').toString().trim();
  return {
    name: f(body.name),
    email: f(body.email),
    phone: f(body.phone),
    department: f(body.department)
  };
=======
app.use(express.urlencoded({ extended: true })); // parse form submissions
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Helper: simple JSON "database" ----------
function readRecords() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw || '[]');
}

function writeRecords(records) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

function getNextId(records) {
  return records.length ? Math.max(...records.map(r => r.id)) + 1 : 1;
>>>>>>> 7d06ea87b6518f447d31a24465ea0ff1c8ebae05
}

// ---------- ROUTES ----------

<<<<<<< HEAD
// READ (list)
app.get('/', wrap(async (req, res) => {
  const [records] = await db.query('SELECT id, name, email, phone, department FROM records ORDER BY id');
  res.render('index', { records, query: req.query });
}));

// CREATE - show form (must come before any /records/:id route)
=======
// READ (list) - Page 1: Home / list of all records
app.get('/', (req, res) => {
  const records = readRecords();
  res.render('index', { records, query: req.query });
});

// READ (single) - Page 2: View details of one record
app.get('/records/:id/view', (req, res) => {
  const records = readRecords();
  const record = records.find(r => r.id === parseInt(req.params.id));
  if (!record) return res.status(404).send('Record not found');
  res.render('view', { record });
});

// CREATE - Page 3: Show "Add" form
>>>>>>> 7d06ea87b6518f447d31a24465ea0ff1c8ebae05
app.get('/records/add', (req, res) => {
  res.render('add');
});

<<<<<<< HEAD
// CREATE - handle submission
app.post('/records/add', wrap(async (req, res) => {
  const { name, email, phone, department } = clean(req.body);
  await db.execute(
    'INSERT INTO records (name, email, phone, department) VALUES (?, ?, ?, ?)',
    [name, email, phone, department]
  );
  res.redirect('/?msg=added');
}));

// READ (single)
app.get('/records/:id/view', wrap(async (req, res) => {
  const [rows] = await db.execute(
    'SELECT id, name, email, phone, department FROM records WHERE id = ?',
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).send('Record not found');
  res.render('view', { record: rows[0] });
}));

// UPDATE - show pre-filled form
app.get('/records/:id/edit', wrap(async (req, res) => {
  const [rows] = await db.execute(
    'SELECT id, name, email, phone, department FROM records WHERE id = ?',
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).send('Record not found');
  res.render('edit', { record: rows[0] });
}));

// UPDATE - handle submission
app.post('/records/:id/edit', wrap(async (req, res) => {
  const { name, email, phone, department } = clean(req.body);
  const [result] = await db.execute(
    'UPDATE records SET name = ?, email = ?, phone = ?, department = ? WHERE id = ?',
    [name, email, phone, department, req.params.id]
  );
  if (result.affectedRows === 0) return res.status(404).send('Record not found');
  res.redirect('/?msg=updated');
}));

// DELETE
app.post('/records/:id/delete', wrap(async (req, res) => {
  const [result] = await db.execute('DELETE FROM records WHERE id = ?', [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).send('Record not found');
  res.redirect('/?msg=deleted');
}));

// ---------- Error handler ----------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong with the database. Check the server console.');
=======
// CREATE - handle form submission
app.post('/records/add', (req, res) => {
  const { name, email, phone, department } = req.body;
  const records = readRecords();

  const newRecord = {
    id: getNextId(records),
    name: (name || '').trim(),
    email: (email || '').trim(),
    phone: (phone || '').trim(),
    department: (department || '').trim()
  };

  records.push(newRecord);
  writeRecords(records);
  res.redirect('/?msg=added');
});

// UPDATE - Page 4: Show "Edit" form pre-filled
app.get('/records/:id/edit', (req, res) => {
  const records = readRecords();
  const record = records.find(r => r.id === parseInt(req.params.id));
  if (!record) return res.status(404).send('Record not found');
  res.render('edit', { record });
});

// UPDATE - handle form submission
app.post('/records/:id/edit', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, phone, department } = req.body;
  const records = readRecords();
  const index = records.findIndex(r => r.id === id);

  if (index === -1) return res.status(404).send('Record not found');

  records[index] = {
    id,
    name: (name || '').trim(),
    email: (email || '').trim(),
    phone: (phone || '').trim(),
    department: (department || '').trim()
  };

  writeRecords(records);
  res.redirect('/?msg=updated');
});

// DELETE - handle deletion (triggered by a button on the list page)
app.post('/records/:id/delete', (req, res) => {
  const id = parseInt(req.params.id);
  let records = readRecords();
  const exists = records.some(r => r.id === id);

  if (!exists) return res.status(404).send('Record not found');

  records = records.filter(r => r.id !== id);
  writeRecords(records);
  res.redirect('/?msg=deleted');
>>>>>>> 7d06ea87b6518f447d31a24465ea0ff1c8ebae05
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`Mini Information System running at http://localhost:${PORT}`);
<<<<<<< HEAD
});
=======
});
>>>>>>> 7d06ea87b6518f447d31a24465ea0ff1c8ebae05
