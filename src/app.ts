import express from 'express';
import multer from 'multer';
const ExifImage = require('exif').ExifImage;
import knex from 'knex';
import knexfile from './knexfile';

const app = express();

app.use(express.json());

const pg = knex(knexfile.development);

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

app.post('/api/file', upload.single('upfile'), ((req, res) => {
    new Promise(function(resolve, reject) {
        new ExifImage({image: req.file!.buffer}, function (error: Error, exifData: any) {
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

export default app;