const db = require('../models/db');
const orm = require('../models/orm');

exports.list = async (req, res, next) => {
  try {
    const { page, pageSize } = req.query;
    if (orm) {
      const result = await orm.listProducts({ page, pageSize });
      return res.json(result);
    }
    const result = db.listProducts({ page, pageSize });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, price, description } = req.body;
    if (!name || typeof price === 'undefined') {
      return res.status(400).json({ error: 'name and price required' });
    }
    if (orm) {
      const product = await orm.createProduct({ name, price, description });
      return res.status(201).json(product);
    }
    const product = db.createProduct({ name, price, description });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.get = (req, res) => {
  const product = db.getProduct(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};

exports.update = (req, res) => {
  const product = db.updateProduct(req.params.id, req.body);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};

exports.remove = (req, res) => {
  const ok = db.deleteProduct(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Product not found' });
  res.status(204).end();
};
