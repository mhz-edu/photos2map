const express = require('express');
const multer  = require('multer');
const ExifImage = require('exif').ExifImage;

const app = express();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

app.post('/api/file', upload.single('upfile'), ((req, res) => {
    new Promise(function(resolve, reject) {
        new ExifImage({image: req.file.buffer}, function (error, exifData) {
            if (error) {
                console.log('Error: '+error.message);
                reject(error);
            } else {
                console.log(exifData.gps);
                resolve(exifData.gps);
            }
        });
    }).then(result => res.json(result), error => res.json(error));
  }));

module.exports = app;