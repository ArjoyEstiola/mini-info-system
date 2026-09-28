// server.js
// Mini Information System - Node.js + Express + EJS + MySQL

const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middleware ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
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
}

// ---------- ROUTES ----------

// READ (list)
app.get('/', wrap(async (req, res) => {
  const [records] = await db.query('SELECT id, name, email, phone, department FROM records ORDER BY id');
  res.render('index', { records, query: req.query });
}));

// CREATE - show form (must come before any /records/:id route)
app.get('/records/add', (req, res) => {
  res.render('add');
});

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
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`Mini Information System running at http://localhost:${PORT}`);
});