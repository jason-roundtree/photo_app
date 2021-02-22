require('dotenv').config()
const cloudinary = require('cloudinary').v2
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/photos', (req, res) => {
    cloudinary
        .search
        .expression('resource_type:image')
        .max_results(3)
        .execute()
        .then(result => {
            console.log('photos: ', result)
            res.json(result) 
        })
})

const server = app.listen(process.env.PORT || 9000, () => {
    console.log('Listening on port %d', server.address().port)
})