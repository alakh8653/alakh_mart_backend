const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

function ensureDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

async function saveFile(file) {
  ensureDir();
  const dest = path.join(UPLOAD_DIR, file.originalname);
  await fs.promises.rename(file.path, dest);
  return { url: `/uploads/${encodeURIComponent(file.originalname)}`, path: dest };
}

module.exports = { saveFile };
