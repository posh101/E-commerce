const http = require('http')
//const path = require('path')
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const { mongoConnect } = require('./mongodb')
require('dotenv/config')
const {authJwt} = require('./helpers/jwt')
const  errHandler  = require('./helpers/errorHandler')

const productRouter = require('./router/product.router')
const userRouter = require('./router/user.router')
const orderRouter = require('./router/order.router')
const categoryRouter = require('./router/category.router')



const app = express()

const PORT = process.env.PORT
const server = http.createServer(app)

app.use(cors())
app.options('*', cors())

app.use(morgan('tiny'))
app.use(express.json())

app.use(authJwt())
app.use('/public/uploads', express.static(__dirname + '/public/uploads'))

app.use(errHandler)

app.use('/v1/products', productRouter)
app.use('/v1/orders', orderRouter)
app.use('/v1/user', userRouter)
app.use('/v1/categories', categoryRouter)

async function startServer() {
    await mongoConnect()
    server.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`)
    })
}

startServer()

module.exports = app;