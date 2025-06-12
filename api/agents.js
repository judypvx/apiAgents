import { Client } from 'pg';

export default async function handler(req, res) {
  // 🔐 CORS заголовки — разрешаем любые домены (или укажи конкретный)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 🔄 Если это preflight-запрос — просто возвращаем 200
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const client = new Client({
    connectionString: process.env.NEON_CONNECTION_STRING,
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM agents ORDER BY name');
    await client.end();
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('DB ERROR:', err);
    res.status(500).json({ error: 'Database error' });
  }
}
