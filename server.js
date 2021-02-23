require('dotenv').config()
const cloudinary = require('cloudinary').v2
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get('/folders', (req, res) => {
    cloudinary
        .api
        .sub_folders('outdoors', (err, _res) => {
            if (!err) {
                res.json(_res)
            } else {
                console.log('error fetching subfolders: ', err)
            }
        })
})

app.get('/folder/:folderPath', (req, res) => {
    cloudinary
        .search
        .expression(`folder/${req.params.folderPath}`)
        .execute()
        .then(result => {
            console.log('folder: ', result)
            res.json(result) 
        })
})

app.get('/photos', (req, res) => {
    cloudinary
        .search
        .with_field('context')
        .max_results(25)
        .execute()
        .then(result => {
            console.log('photos: ', result)
            res.json(result) 
        })
        .catch(err => console.log('error: ', err))
})

const server = app.listen(process.env.PORT || 9000, () => {
    console.log('Listening on port %d', server.address().port)
})