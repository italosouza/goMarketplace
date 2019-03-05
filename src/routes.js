const express = require('express')
const routes = express.Router()

/**
 * VALIDATORS
 */
const validate = require('express-validation')
const validators = require('./app/validators')
const handler = require('express-async-handler')

/**
 * MIDDLEWARES
 */
const authMiddleware = require('./app/middlewares/auth')

/**
 * CONTROLLERS
 */
const controllers = require('./app/controllers')

/**
 * ROTAS
 */

// usuario
routes.post('/user', validate(validators.User), handler(controllers.UserController.store))
routes.post('/session', validate(validators.Session), handler(controllers.SessionController.store))

// ativando validação de autenticação
routes.use(authMiddleware)

// Ads
routes.get('/ads', handler(controllers.AdController.index))
routes.get('/ads/:id', handler(controllers.AdController.show))
routes.post('/ads', validate(validators.Ad), handler(controllers.AdController.store))
routes.put('/ads/:id', validate(validators.Ad), handler(controllers.AdController.update))
routes.delete('/ads/:id', handler(controllers.AdController.destroy))

// purchases
routes.post(
  '/purchase',
  validate(validators.Purchase),
  handler(controllers.PurchaseController.store)
)

module.exports = routes
