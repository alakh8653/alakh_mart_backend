const request = require('supertest');
const app = require('../app');

// This test file runs only when DATABASE_URL is set and Prisma client is available.
const prisma = require('../db/prismaClient');

describe('DB-backed flow (if configured)', () => {
  if (!process.env.DATABASE_URL || !prisma) {
    test('skipped - DATABASE_URL not configured or Prisma not available', () => {
      expect(true).toBe(true);
    });
    return;
  }

  beforeAll(async () => {
    // Clean db tables used in tests
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('register, login, create product, list products', async () => {
    const email = `ci+${Date.now()}@example.com`;
    // register
    const reg = await request(app).post('/auth/register').send({ name: 'CI', email, password: 'ci-pass' });
    expect(reg.statusCode).toBe(201);

    // promote to admin directly via prisma
    await prisma.user.update({ where: { email }, data: { role: 'admin' } });

    // login
    const loginRes = await request(app).post('/auth/login').send({ email, password: 'ci-pass' });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
    const token = loginRes.body.token;

    // create product as admin
    const createRes = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'CI Product', price: 1.23 });
    expect(createRes.statusCode).toBe(201);

    // list products
    const listRes = await request(app).get('/products');
    expect(listRes.statusCode).toBe(200);
    expect(listRes.body.meta.total).toBeGreaterThanOrEqual(1);
  }, 20000);
});
