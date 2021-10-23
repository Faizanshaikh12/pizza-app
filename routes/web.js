const homeController = require('../http/controllers/homeController')
const authController = require('../http/controllers/authController')
const cartController = require('../http/controllers/customers/cartController')
const orderController = require('../http/controllers/customers/orderController')
const adminOrder = require('../http/controllers/admin/adminOrder')
const guest = require('../http/middlewares/guest')
const auth = require('../http/middlewares/auth')

function initRoutes(app) {
    app.get('/', homeController().home)

    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.post('/logout', authController().logout)

    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)

    app.get('/cart', cartController().cart)
    app.post('/update-cart', cartController().update)

    //customers routes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)

    //Admin routes
    app.get('/admin/orders', auth, adminOrder().index)
}

module.exports = initRoutes
