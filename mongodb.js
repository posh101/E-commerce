const mongoose = require('mongoose')
require('dotenv/config')

const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open', () => {
    //console.log('Ready to connect')
})
mongoose.connection.on('error', (err) => [
    console.error(err)
])

async function mongoConnect() {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connected to mongodb')
    }
    catch(error) {
        console.log(error)
    }
}

async function mongoDisconnect() {
    await mongoose.disconnect()
}

module.exports = {
    mongoConnect,
    mongoDisconnect,
}