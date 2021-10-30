const express = require('express')
const bodyParser = require('body-parser');
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongodb-session')(session)
const passport = require('passport')
const passportInit = require('./config/passport')
const Emitter = require('events')

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const PORT = process.env.PORT || 9000

//Database Connection
const url = process.env.DB

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connection...')
})
connection.on("error", console.error.bind(console, "connection Faild..."));

// //session store
let mongoStore = new MongoDbStore({
    uri: url,
    collection: 'mySessions'
})
//Event Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// //session config
app.use(session({
    secret: process.env.COOKIE_SESSION,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {maxAge: 1000 * 60 * 60 * 24} //24 hours
}))

//passport config
passportInit(passport)
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

//Assets
app.use(express.static('public'));
app.use(express.json())

//global middlewares
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

//Socket IO
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('join', (orderId) => {
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})
