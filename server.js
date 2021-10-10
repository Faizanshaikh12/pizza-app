const express = require('express')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 9000

//Database Connection
const url = process.env.DB

mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connection...')
})
connection.on("error", console.error.bind(console, "connection Faild..."));

//Assets
app.use(express.static('public'));

app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
