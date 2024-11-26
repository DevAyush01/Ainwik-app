const express = require('express');
const { videoUpload } = require('../multerConfig');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb')
const Video = require('../config/Video');
const connectDB = require('../config/dbConn');

const app = express();


connectDB();
let gfs;

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connected sssss');
  gfs = new GridFSBucket(connection.db, {
    bucketName: 'videos'
  });
});

app.post('/upload', videoUpload.single('video'), async(req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const newVideo = new Video({
      title: req.body.title || 'Untitled',
      description: req.body.description || '',
      filename: req.file.filename,
      contentType: req.file.contentType,
      length: req.file.size,
    });

    await newVideo.save();

    res.status(201).json({ message: 'File uploaded successfully', video: newVideo });
    console.log(req.file);
  } catch (error) {
    res.status(500).json({ error: 'Error saving video metadata', details: error.message });
  }
});

app.get('/video/:filename', async (req, res) => {
  const { filename } = req.params;

  try {
    const file = await gfs.find({ filename }).next();

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const range = req.headers.range;
    if (!range) {
      const downloadStream = gfs.openDownloadStreamByName(filename);
      res.set('Content-Type', file.contentType);
      return downloadStream.pipe(res);
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1;
    const chunksize = (end - start) + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${file.length}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': file.contentType,
    });

    const downloadStream = gfs.openDownloadStreamByName(filename, { start, end: end + 1 });
    downloadStream.pipe(res); 
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving file', details: error.message });
  }
});

 
module.exports = app;
