const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const REGION = process.env.S3_REGION || process.env.AWS_REGION || 'us-east-1';
const BUCKET = process.env.S3_BUCKET;

let client = null;
if (BUCKET) {
  client = new S3Client({ region: REGION });
}

async function saveFile(file) {
  if (!client) throw new Error('S3 client not configured (S3_BUCKET missing)');
  const key = `${Date.now()}-${file.originalname}`;
  const body = await require('fs').promises.readFile(file.path);
  const cmd = new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body });
  await client.send(cmd);
  // remove local temp file
  await require('fs').promises.unlink(file.path);
  const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encodeURIComponent(key)}`;
  return { url, key };
}

module.exports = { saveFile };
