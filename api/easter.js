module.exports = function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { cmd } = req.body;

  if (typeof cmd === 'string' && cmd.toLowerCase().trim() === 'hire me') {
    return res.status(200).json({ success: true, code: 'HVAI50' });
  }

  return res.status(200).json({ success: false });
};
