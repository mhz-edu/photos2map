photos2map
===
Simple API to get coordinates from the image files. Idea is to allow user to manage albums of images and to get an array of coordinates for all images in the particular album.

Service is built using nodejs, typescript, express, postgresql

How to run
---

1. Clone the repository
2. Install dependencies

`npm install`

3. Add connection to the DB
4. Build the application

`npm run build`

5. Apply DB configuration

`npm run migrate`

6. Run the application

`npm start`

Features
---
1. Creating users, albums, image coordinates records

### TODO

1. Full users, albums, image records CRUD
2. Users authentication/authorization
3. Multiple file upload
4. Generate map view with image coordinates