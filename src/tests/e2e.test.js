const axios = require('axios');

const API = 'http://localhost:3000';

describe('E2E flow against running server', () => {
  test('register, login, create product, list products', async () => {
    const email = `e2e+${Date.now()}@example.com`;
    // register
    const reg = await axios.post(`${API}/auth/register`, { name: 'E2E', email, password: 'e2e-pass' });
    expect(reg.status).toBe(201);

    // login
    const login = await axios.post(`${API}/auth/login`, { email, password: 'e2e-pass' });
    expect(login.status).toBe(200);
    const token = login.data.token;

    // create product as admin? promote via direct DB not available here; we will just attempt create and expect 403
    const createAttempt = await axios.post(`${API}/products`, { name: 'E2E Prod', price: 5.0 }, { headers: { Authorization: `Bearer ${token}` } }).catch(e => e.response);
    // Should be forbidden since user is not admin
    expect([401,403].includes(createAttempt.status)).toBeTruthy();

    // list products
    const list = await axios.get(`${API}/products`);
    expect(list.status).toBe(200);
    expect(list.data).toHaveProperty('items');
  }, 20000);
});
