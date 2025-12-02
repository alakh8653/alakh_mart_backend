const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const orm = require('../models/orm');

async function register({ name, email, password }) {
  const hashed = await bcrypt.hash(password, 10);
  if (orm) {
    const user = await orm.createUser({ name, email, password: hashed, role: 'user' });
    return user;
  }
  const user = db.createUser({ name, email, password: hashed, role: 'user' });
  return user;
}

async function authenticate({ email, password }) {
  if (orm) {
    const user = await orm.findUserByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
    return { user, token };
  }

  const user = db.db.users.find(u => u.email === email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
  return { user, token };
}

module.exports = { register, authenticate };
