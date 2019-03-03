const express = require('express')
const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')

const controllers = require('./app/controllers')

// usuario
routes.post('/user', controllers.UserController.store)
routes.post('/session', controllers.SessionController.store)

// requer autorização
routes.use(authMiddleware)

// Ads
routes.get('/ads', controllers.AdController.index)
routes.get('/ads/:id', controllers.AdController.show)
routes.post('/ads', controllers.AdController.store)
routes.put('/ads/:id', controllers.AdController.update)
routes.delete('/ads/:id', controllers.AdController.destroy)

// purchases
routes.post('/purchase', controllers.PurchaseController.store)

module.exports = routes
