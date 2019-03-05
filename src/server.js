const express = require('express')

const mongoose = require('mongoose')
const databaseConfig = require('./config/database')

const validate = require('express-validation')
const Youch = require('youch')

const Sentry = require('@sentry/node')
const sentryConfig = require('./config/sentry')

class App {
  constructor() {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.sentry()
    this.database()
    this.middlewares()
    this.routes()
    this.exception()
  }

  database() {
    mongoose.connect(databaseConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }

  middlewares() {
    this.express.use(express.json())
    this.express.use(Sentry.Handlers.requestHandler())
  }

  routes() {
    this.express.use(require('./routes'))
  }

  sentry() {
    Sentry.init(sentryConfig)
  }

  exception() {
    if (!this.isDev) {
      this.express.use(Sentry.Handlers.errorHandler())
    }

    this.express.use(async (err, req, res, next) => {
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }

      if (this.isDev) {
        const youch = new Youch(err)
        return res.json(await youch.toJSON())
      }

      return res.status(err.status || 500).json({ error: 'Erro interno do servidor' })
    })
  }
}

module.exports = new App().express
