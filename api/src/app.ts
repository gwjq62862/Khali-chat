import express from'express'
import AuthRoute from './route/auth.route'
import ChatRoute from './route/chat.route'
import UserRoute from './route/user.route'
import MessageRoute from './route/messsage.route'

const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json())//middleware to parse json body
app.get('/health',(req,res)=>{
    res.send('API is healthy')
})

app.get("/api/auth",AuthRoute)
app.get("/api/message",MessageRoute)
app.get("/api/user",UserRoute)
app.get("/api/chat",ChatRoute)

export {app,PORT}