const path = require('path');
const multer = require('multer');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..//uploads');


// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const storage =  multer.diskStorage({
    destination : function(req , file ,cb){
        return cb(null, '..//uploads')
    },
    filename: function(req , file ,cb){
        return cb(null , `${Date.now()}-${file.originalname}`)
    }
 })

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

  module.exports = upload