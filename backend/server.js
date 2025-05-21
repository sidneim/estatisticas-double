require('dotenv').config();
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/results/:site', async (req, res) => {
  const site = req.params.site;
  let tableName;
  if (site === 'blaze') {
    tableName = 'resultdoubleblaze';
  } else if (site === 'jonbet') {
    tableName = 'resultdoublejon';
  } else {
    return res.status(400).json({ error: 'Invalid site' });
  }

  try {
    const result = await db.query(`SELECT * FROM ${tableName} ORDER BY created_at ASC LIMIT 100`);
    res.json(result.rows);
  } catch (error) {
    console.error('DB error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
