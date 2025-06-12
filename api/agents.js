// api/agents.js
import { Client } from 'pg';

export default async function handler(req, res) {
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