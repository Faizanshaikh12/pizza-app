const express = require('express')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 9000

app.get('/', (req, res) => {
    res.render('home')
})

app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
