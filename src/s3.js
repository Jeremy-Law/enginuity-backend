const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function uploadFile(key, content) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,             // filename in S3
    Body: content,        // file data
  };

  return s3.upload(params).promise();
}

async function listFiles() {
  const params = {
    Bucket: process.env.S3_BUCKET,
  };
  const data = await s3.listObjectsV2(params).promise();
  return data.Contents.map(obj => obj.Key);
}

module.exports = { uploadFile, listFiles };
