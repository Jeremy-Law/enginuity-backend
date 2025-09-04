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
    Key: key,
    Body: content,
  };
  return s3.upload(params).promise();
}

async function listFiles() {
  const params = {
    Bucket: process.env.S3_BUCKET,
  };
  const data = await s3.listObjectsV2(params).promise();
  return data.Contents.map((obj) => obj.Key);
}

async function deleteFile(key) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
  };
  return s3.deleteObject(params).promise();
}

async function getFile(key) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
  };
  const data = await s3.getObject(params).promise();
  return data.Body; // returns Buffer
}

async function searchFiles(prefix) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Prefix: prefix,
  };
  const data = await s3.listObjectsV2(params).promise();
  return data.Contents.map((obj) => obj.Key);
}

async function addComment(key, comment) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${key}.comments.json`,
    Body: JSON.stringify({ comment, timestamp: new Date().toISOString() }),
    ContentType: "application/json",
  };
  return s3.putObject(params).promise();
}

async function deleteComment(key, comment) {
  
}

async function editComment(key, newComment) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${key}.comments.json`,
  };
  const existing = await s3.getObject(params).promise();
  const comments = JSON.parse(existing.Body.toString());
  comments.comment = newComment;
  comments.editedAt = new Date().toISOString();
  return s3.putObject({
    ...params,
    Body: JSON.stringify(comments),
    ContentType: "application/json",
  }).promise();
}

async function replaceFile(key, newContent) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: newContent,
  };
  return s3.putObject(params).promise();
}

async function addQuestion(key, question) {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${key}.questions.json`,
    Body: JSON.stringify({ question, timestamp: new Date().toISOString() }),
    ContentType: "application/json",
  };
  return s3.putObject(params).promise();
}

async function answerQuestin(key, question) {

}

async function editQuestion(key, question) {

}

async function deleteQuestion(key, question) {

}

module.exports = {
  uploadFile,
  listFiles,
  deleteFile,
  getFile,
  searchFiles,
  replaceFile,
  addComment,
  editComment,
  deleteComment,
  addQuestion,
};
