const request = require('supertest');
const app = require('../app');

describe('Basic endpoints', () => {
  test('GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  test('register -> login -> access protected route', async () => {
    const email = `test+${Date.now()}@example.com`;
    const registerRes = await request(app).post('/auth/register').send({ name: 'Test', email, password: 'secret1' });
    expect(registerRes.statusCode).toBe(201);

    const loginRes = await request(app).post('/auth/login').send({ email, password: 'secret1' });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');

    const token = loginRes.body.token;
    const productsRes = await request(app).get('/products').set('Authorization', `Bearer ${token}`);
    expect(productsRes.statusCode).toBe(200);
  });
});
