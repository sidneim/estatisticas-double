const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// Configuração do banco
const pool = new Pool({
  user: 'sidnei',
  host: 'localhost',
  database: 'postgres',
  password: 'xrDK2@#2MGXvE9',
  port: 5432,
});

// APIs existentes (exemplo Blaze)
app.get('/api/stats/blaze', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM resultdoubleblaze ORDER BY created_at DESC LIMIT 240');
    res.json(rows);
  } catch (err) {
    console.error('Erro na consulta Blaze:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// APIs existentes (exemplo Blaze)
app.get('/api/porhora/blaze', async (req, res) => {
  try {
    const { rows } = await pool.query(`
        SELECT
            TO_CHAR(created_at, 'HH24:00') AS hora,
            SUM(CASE WHEN color = 0 THEN 1 ELSE 0 END) AS branco,
            SUM(CASE WHEN color = 2 THEN 1 ELSE 0 END) AS preto,
            SUM(CASE WHEN color = 1 THEN 1 ELSE 0 END) AS vermelho
        FROM
            resultdoubleblaze
        WHERE
            created_at::date = CURRENT_DATE
        GROUP BY
            hora
        ORDER BY
            hora desc
    `);
    res.json(rows);
  } catch (err) {
    console.error('Erro na consulta Blaze:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// API Jonbet
app.get('/api/stats/jonbet', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM resultdoublejon ORDER BY created_at DESC LIMIT 240');
    res.json(rows);
  } catch (err) {
    console.error('Erro na consulta Jonbet:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// APIs existentes (exemplo Blaze)
app.get('/api/porhora/jonbet', async (req, res) => {
  try {
    const { rows } = await pool.query(`
        SELECT
            TO_CHAR(created_at, 'HH24:00') AS hora,
            SUM(CASE WHEN color = 0 THEN 1 ELSE 0 END) AS branco,
            SUM(CASE WHEN color = 2 THEN 1 ELSE 0 END) AS preto,
            SUM(CASE WHEN color = 1 THEN 1 ELSE 0 END) AS vermelho
        FROM
            resultdoublejon
        WHERE
            created_at::date = CURRENT_DATE
        GROUP BY
            hora
        ORDER BY
            hora desc
    `);
    res.json(rows);
  } catch (err) {
    console.error('Erro na consulta Blaze:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});


// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rota raiz que envia o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});