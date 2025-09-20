const AWS = require("aws-sdk");
require("dotenv").config();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// -------- FILES --------

async function uploadFile(req, res) {
  try {
    const { key } = req.body; // uploading new files, key comes from body
    const { content } = req.body;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: content,
    };

    const result = await s3.upload(params).promise();
    res.status(201).json({ message: "File uploaded", result });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function listFiles(req, res) {
  try {
    const params = { Bucket: process.env.S3_BUCKET };
    const data = await s3.listObjectsV2(params).promise();
    res.json(data.Contents.map((obj) => obj.Key));
  } catch (err) {
    console.error("List error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getFile(req, res) {
  try {
    const { key } = req.params;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
    };

    const data = await s3.getObject(params).promise();
    res.send(data.Body); // returns Buffer
  } catch (err) {
    console.error("Get file error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteFile(req, res) {
  try {
    const { key } = req.params;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
    };

    await s3.deleteObject(params).promise();
    res.json({ message: "File deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function replaceFile(req, res) {
  try {
    const { key } = req.params;
    const { newContent } = req.body;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: newContent,
    };

    await s3.putObject(params).promise();
    res.json({ message: "File replaced" });
  } catch (err) {
    console.error("Replace error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function searchFiles(req, res) {
  try {
    const { prefix } = req.query;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Prefix: prefix,
    };

    const data = await s3.listObjectsV2(params).promise();
    res.json(data.Contents.map((obj) => obj.Key));
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function getRecentFiles(req, res) {
  try {
    const params = { Bucket: process.env.S3_BUCKET };
    const data = await s3.listObjectsV2(params).promise();

    // sort by LastModified, most recent first
    const recent = data.Contents
      .sort((a, b) => b.LastModified - a.LastModified)
      .slice(0, 10);

    res.json(recent.map((obj) => ({ key: obj.Key, lastModified: obj.LastModified })));
  } catch (err) {
    console.error("Recent files error:", err);
    res.status(500).json({ error: err.message });
  }
}

// -------- COMMENTS --------

async function addComment(req, res) {
  try {
    const { key } = req.params;
    const { comment } = req.body;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${key}.comments.json`,
      Body: JSON.stringify({ comment, timestamp: new Date().toISOString() }),
      ContentType: "application/json",
    };

    await s3.putObject(params).promise();
    res.status(201).json({ message: "Comment added" });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function editComment(req, res) {
  try {
    const { key, commentId } = req.params;
    const { newComment } = req.body;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${key}.comments.json`,
    };

    const existing = await s3.getObject(params).promise();
    const comments = JSON.parse(existing.Body.toString());

    // assume comments is an array
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.text = newComment;
    comment.editedAt = new Date().toISOString();

    await s3.putObject({
      ...params,
      Body: JSON.stringify(comments),
      ContentType: "application/json",
    }).promise();

    res.json({ message: "Comment updated" });
  } catch (err) {
    console.error("Edit comment error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteComment(req, res) {
  try {
    const { key, commentId } = req.params;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${key}.comments.json`,
    };

    const existing = await s3.getObject(params).promise();
    let comments = JSON.parse(existing.Body.toString());

    comments = comments.filter((c) => c.id !== commentId);

    await s3.putObject({
      ...params,
      Body: JSON.stringify(comments),
      ContentType: "application/json",
    }).promise();

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ error: err.message });
  }
}

// -------- QUESTIONS --------

async function addQuestion(req, res) {
  try {
    const { key } = req.params;
    const { question } = req.body;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${key}.questions.json`,
      Body: JSON.stringify({ question, timestamp: new Date().toISOString() }),
      ContentType: "application/json",
    };

    await s3.putObject(params).promise();
    res.status(201).json({ message: "Question added" });
  } catch (err) {
    console.error("Add question error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function editQuestion(req, res) {
  try {
    const { key, questionId } = req.params;
    const { newContent } = req.body;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${key}.questions.json`,
    };

    const existing = await s3.getObject(params).promise();
    const questions = JSON.parse(existing.Body.toString());

    const question = questions.find((q) => q.id === questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });

    question.text = newContent;
    question.editedAt = new Date().toISOString();

    await s3.putObject({
      ...params,
      Body: JSON.stringify(questions),
      ContentType: "application/json",
    }).promise();

    res.json({ message: "Question updated" });
  } catch (err) {
    console.error("Edit question error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteQuestion(req, res) {
  try {
    const { key, questionId } = req.params;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${key}.questions.json`,
    };

    const existing = await s3.getObject(params).promise();
    let questions = JSON.parse(existing.Body.toString());

    questions = questions.filter((q) => q.id !== questionId);

    await s3.putObject({
      ...params,
      Body: JSON.stringify(questions),
      ContentType: "application/json",
    }).promise();

    res.json({ message: "Question deleted" });
  } catch (err) {
    console.error("Delete question error:", err);
    res.status(500).json({ error: err.message });
  }
}

async function answerQuestion(req, res) {
  try {
    const { key, questionId } = req.params;
    const { answer } = req.body;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `${key}.questions.json`,
    };

    const existing = await s3.getObject(params).promise();
    const questions = JSON.parse(existing.Body.toString());

    const question = questions.find((q) => q.id === questionId);
    if (!question) return res.status(404).json({ error: "Question not found" });

    question.answer = answer;
    question.answeredAt = new Date().toISOString();

    await s3.putObject({
      ...params,
      Body: JSON.stringify(questions),
      ContentType: "application/json",
    }).promise();

    res.json({ message: "Answer saved" });
  } catch (err) {
    console.error("Answer question error:", err);
    res.status(500).json({ error: err.message });
  }
}


module.exports = {
  uploadFile,
  listFiles,
  getFile,
  deleteFile,
  replaceFile,
  searchFiles,
  getRecentFiles,
  addComment,
  editComment,
  deleteComment,
  addQuestion,
  editQuestion,
  deleteQuestion,
  answerQuestion,
};
