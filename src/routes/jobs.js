const express = require('express');
const Joi = require('joi');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { emailQueue } = require('../queues/queue');

const router = express.Router();

const emailSchema = Joi.object({ to: Joi.string().email().required(), subject: Joi.string().required(), body: Joi.string().required() });

router.post('/email', authenticate, validate(emailSchema), async (req, res, next) => {
  try {
    const job = await emailQueue.add('sendEmail', req.body);
    res.status(202).json({ jobId: job.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
