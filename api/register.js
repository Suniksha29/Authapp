const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

let pool;
function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 5
    });
  }
  return pool;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const p = getPool();
    await p.execute(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) UNIQUE NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, phone VARCHAR(20) NOT NULL, password VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    
    const { username, email, phone, password } = req.body;
    if (!username || !email || !phone || !password) return res.status(400).json({ message: 'All fields are required' });

    const [existing] = await p.execute('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existing.length > 0) return res.status(409).json({ message: 'Username or email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await p.execute('INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)', [username, email, phone, hashedPassword]);
    res.status(201).json({ message: 'register success' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
