const prisma = require('../db/prismaClient');

if (!prisma) {
  module.exports = null;
} else {
  async function createUser({ name, email, password, role = 'user' }) {
    return prisma.user.create({ data: { name, email, password, role } });
  }

  async function findUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async function createProduct({ name, price, description }) {
    return prisma.product.create({ data: { name, price: Number(price), description } });
  }

  async function listProducts({ page = 1, pageSize = 50 } = {}) {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const items = await prisma.product.findMany({ skip, take, orderBy: { id: 'asc' } });
    const total = await prisma.product.count();
    return { items, meta: { total, page: Number(page), pageSize: Number(pageSize) } };
  }

  module.exports = { createUser, findUserByEmail, createProduct, listProducts };
}
