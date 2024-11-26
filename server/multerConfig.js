const path = require('path');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const uploadDir = path.join(__dirname, '../uploads');

const mongoURI = process.env.MONGO_URL
if (!mongoURI) {
  throw new Error('MONGO_URI is not defined in the environment variables');
}

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

//for image storage
const storage =  multer.diskStorage({
    destination : function(req , file ,cb){
        return cb(null, uploadDir)
    },
    filename: function(req , file ,cb){
        return cb(null , `${Date.now()}-${file.originalname}`)
    }
 })

 //for video storage
 const videoStorage = new GridFsStorage({
  url: mongoURI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'videos',
          metadata: { originalname: file.originalname }
        };
        resolve(fileInfo);
      });
    });
  }
});



  const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
    },
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
  });

  const videoUpload = multer({ 
    storage: videoStorage,
    fileFilter: (req, file, cb) => {
        const filetypes = /mp4|avi|mov|wmv|mkv|m4v/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
    },
    limits: { fileSize: 100 * 1024 * 1024  } // 100MB file size limit for videos
});

  module.exports = {
    upload,
    videoUpload
  
  }