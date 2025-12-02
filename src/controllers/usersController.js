const db = require('../models/db');

exports.create = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });
  const user = db.createUser({ name, email });
  res.status(201).json(user);
};
