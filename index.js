const express = require('express')
const app = express()
require('dotenv').config()
require('express-async-errors')
const connectDB = require('./db/connect')

app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))
app.use(express.json())


app.use('/api/v1',require('./src/routes'))

app.use(require('./middleware/error-handler'))
app.use(require('./middleware/not-found'))

const port = process.env.PORT ||3000
const start  = async ()=> {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`connected to the database and listening on the port ${port}....`))

    }catch(error){
        console.log(error)
    }
}
start()