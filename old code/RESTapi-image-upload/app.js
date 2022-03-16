const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const multer = require('multer')
const axios = require('axios')
const path = require('path')
app.use(bodyParser.json())
let pathName
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        pathName = path.join(__dirname, `./uploads/${file.originalname}`)
        cb(null, Date.now() + '-' + file.originalname);
    }
});
let upload = multer({ storage: storage });

app.post('/api/image-upload', upload.single('image'), (req, res) => {
    // console.log(req)
    const image = req.image;
    console.log(req.body.key2)
    // console.log(storage.destination)
    // const pathName = path.join(__dirname, `./uploads/${filename}`)
    console.log(pathName)
    // console.log(image)
    axios
        .post(`http://localhost:4000/`, {
            query: `
            mutation Post($userId: ID!, $title: String!, $description: String!, $imageUrl: String!) {
                post(userId: $userId, title: $title, description: $description, image_url: $imageUrl) {
                  id
                  title
                  description
                  image_url
                }
              }
  `,
            variables: {
                // id: String(id),
                userId: req.body.userId,
                title: 'rest title',
                description: 'rest descriptioon',
                imageUrl: pathName,
                // type: this.form.type,
            },
        })
        .then(res => console.log(res.status))
        .catch(err => console.log(err))
    res.send(apiResponse({ message: 'File uploaded successfully.', image }));
});

function apiResponse(results) {
    return JSON.stringify({ "status": 200, "error": null, "response": results });
}

app.listen(3000, () => {
    console.log('Server started on port 3000...');
});