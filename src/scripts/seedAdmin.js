const authService = require('../services/authService');
const db = require('../models/db');
const orm = require('../models/orm');

async function seed() {
  try {
    const email = 'admin@example.com';
    const password = 'adminpass';
    // If ORM (Prisma) is available, use it for persistent seeding
    if (orm) {
      const existing = await orm.findUserByEmail(email);
      const prisma = require('../db/prismaClient');
      if (existing) {
        // ensure password is hashed and role is admin
        const bcrypt = require('bcryptjs');
        const hashed = await bcrypt.hash(password, 10);
        if (prisma) {
          await prisma.user.update({ where: { email }, data: { password: hashed, role: 'admin' } });
        }
        console.log('Admin user updated (DB):', existing.email);
        return process.exit(0);
      }

      // Use authService.register so the password is hashed correctly,
      // then elevate the role to admin via Prisma client if available.
      const created = await authService.register({ name: 'Admin', email, password });
      try {
        if (prisma) {
          await prisma.user.update({ where: { email }, data: { role: 'admin' } });
        }
      } catch (e) {
        // ignore if update fails
      }
      console.log('Seeded admin user (DB):', created.email || email);
      return process.exit(0);
    }

    // Fallback to in-memory seeding
    const existing = db.db.users.find(u => u.role === 'admin');
    if (existing) {
      console.log('Admin user already exists:', existing.email);
      return process.exit(0);
    }

    const admin = await authService.register({ name: 'Admin', email, password });
    // upgrade role to admin
    const found = db.db.users.find(u => u.id === admin.id);
    if (found) found.role = 'admin';

    console.log('Seeded admin user (in-memory): admin@example.com (password: adminpass)');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
