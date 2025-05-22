'''
// ==== app.js ====
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Blockchain = require('./blockchain');
const app = express();
const PORT = 3000;
const myChain = new Blockchain();
app.use(express.static('public'));
app.use(fileUpload());
app.post('/upload', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No file uploaded.');
  }
  const file = req.files.file;
  const hash = crypto.createHash('sha256').update(file.data).digest('hex');
  const blockData = {
    fileName: file.name,
    hash: hash,
    uploadedAt: new Date().toISOString()
  };
  myChain.addBlock({
    ...new Blockchain().getLatestBlock(),
    index: myChain.chain.length,
    timestamp: Date.now().toString(),
    data: blockData
  });
  res.send(`File uploaded and hash stored on blockchain. File Hash: ${hash}`);
});
app.post('/verify', (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).send('No file uploaded.');
  }
  const file = req.files.file;
  const hash = crypto.createHash('sha256').update(file.data).digest('hex');
  const found = myChain.verifyFileHash(hash);
  if (found) {
    res.send(`File is verified! Stored on blockchain. Block Index: ${found.index}`);
  } else {
    res.send('File has been tampered or not found on blockchain.');
  }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
'''
