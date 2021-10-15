const homeController = require('../http/controllers/homeController')
const authController = require('../http/controllers/authController')
const cartController = require('../http/controllers/customers/cartController')

function initRoutes(app) {
    app.get('/', homeController().home)

    app.get('/login', authController().login)

    app.get('/register', authController().register)

    app.get('/cart', cartController().cart)
    app.post('/update-cart', cartController().update)

}

module.exports = initRoutes
