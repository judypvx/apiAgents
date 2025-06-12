// api/[category].js
import { Client } from 'pg';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { category } = req.query;

  // Список допустимых таблиц
  const allowedTables = [
    'agents', 'base_weapons', 'collectibles', 'collections', 'crates',
    'graffiti', 'keychains', 'keys', 'music_kits', 'patches', 'skins', 'stickers'
  ];

  if (!allowedTables.includes(category)) {
    res.status(400).json({ error: 'Invalid category' });
    return;
  }

  const client = new Client({
    connectionString: process.env.NEON_CONNECTION_STRING,
  });

  try {
    await client.connect();
    const result = await client.query(`SELECT * FROM ${category} ORDER BY id`);
    await client.end();

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('DB ERROR:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
}
