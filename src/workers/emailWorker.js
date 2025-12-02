const { Worker } = require('bullmq');
const logger = require('../middleware/logger');
const { connection } = require('../queues/queue');

// Simple email worker that logs job payloads (replace with real email provider)
const worker = new Worker(
  'email',
  async (job) => {
    logger.info('Processing email job', { id: job.id, data: job.data });
    // Simulate sending
    await new Promise((r) => setTimeout(r, 200));
    logger.info('Email sent', { to: job.data.to });
    return { ok: true };
  },
  { connection }
);

worker.on('completed', (job) => logger.info('Job completed', { id: job.id }));
worker.on('failed', (job, err) => logger.error('Job failed', { id: job.id, err: err.message }));

module.exports = worker;
