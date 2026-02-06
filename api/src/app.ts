import express from'express'
import AuthRoute from './route/auth.route'
import ChatRoute from './route/chat.route'
import UserRoute from './route/user.route'
import MessageRoute from './route/message.route'

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())//middleware to parse json body
app.get('/health',(req,res)=>{
    res.send('API is healthy')
})

app.use("/api/auth", AuthRoute)
app.use("/api/message", MessageRoute)
app.use("/api/user", UserRoute)
app.use("/api/chat", ChatRoute)

export {app,PORT}