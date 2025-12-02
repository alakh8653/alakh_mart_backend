const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validate = require('../middleware/validate');
const authService = require('../services/authService');

const registerSchema = Joi.object({ name: Joi.string().required(), email: Joi.string().email().required(), password: Joi.string().min(6).required() });
const loginSchema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    next(err);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.authenticate(req.body);
    if (!result) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token: result.token, user: { id: result.user.id, email: result.user.email, role: result.user.role } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
