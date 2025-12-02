const express = require('express');
const multer = require('multer');
const { authenticate } = require('../middleware/auth');

const upload = multer({ dest: 'tmp/' });
const local = require('../storage/localStorage');
const s3 = require('../storage/s3Storage');

const router = express.Router();

router.post('/', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    const storage = process.env.STORAGE || 'local';
    if (!req.file) return res.status(400).json({ error: 'file required' });
    let result;
    if (storage === 's3') {
      result = await s3.saveFile(req.file);
    } else {
      result = await local.saveFile(req.file);
    }
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
