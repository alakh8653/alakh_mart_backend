const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productsController');
const { authenticate, permit } = require('../middleware/auth');

// public list
router.get('/', ctrl.list);
// creating products requires auth + admin role
router.post('/', authenticate, permit('admin'), ctrl.create);
router.get('/:id', ctrl.get);
router.put('/:id', authenticate, permit('admin'), ctrl.update);
router.delete('/:id', authenticate, permit('admin'), ctrl.remove);

module.exports = router;
