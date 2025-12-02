// Simple in-memory datastore
const db = {
  products: [],
  users: []
};

let nextProductId = 1;
let nextUserId = 1;

function createProduct(data) {
  const product = Object.assign({ id: nextProductId++ }, data);
  db.products.push(product);
  return product;
}

function getProduct(id) {
  return db.products.find((p) => p.id === Number(id));
}

function updateProduct(id, data) {
  const prod = getProduct(id);
  if (!prod) return null;
  Object.assign(prod, data);
  return prod;
}

function deleteProduct(id) {
  const idx = db.products.findIndex((p) => p.id === Number(id));
  if (idx === -1) return false;
  db.products.splice(idx, 1);
  return true;
}

function listProducts({ page = 1, pageSize = 50 } = {}) {
  const p = Number(page) || 1;
  const ps = Number(pageSize) || 50;
  const items = db.products.slice((p - 1) * ps, p * ps);
  return { items, meta: { total: db.products.length, page: p, pageSize: ps } };
}

function createUser(data) {
  const user = Object.assign({ id: nextUserId++ }, data);
  db.users.push(user);
  return user;
}

module.exports = {
  db,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  listProducts,
  createUser
};
