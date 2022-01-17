const express = require('express');
const multer  = require('multer');
const ExifImage = require('exif').ExifImage;

const app = express();

app.use(express.json());

const pg = require('knex')({
    client: 'pg',
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
    debug: true,
    ssl: true
  });

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

app.post('/api/users', (req, res) => {
    let userEmail = req.body.useremail;
    pg('users').insert({email: userEmail})
    .then(() => res.json(userEmail))
    .catch((error) => res.json(error))
});

app.get('/api/users', (req, res) => {
    pg.select().from('users')
    .then((rows) => res.json(rows))
    .catch((error) => res.json(error))
})

module.exports = app;