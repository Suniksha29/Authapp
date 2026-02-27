module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.setHeader('Set-Cookie', 'authToken=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure');
  res.status(200).json({ message: 'logout success' });
};
