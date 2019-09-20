require('./db/db')
const express = require('express')
const userRoute=require('./routers/user')
const messagesRoute=require('./routers/messages')
const cors=require('cors')
const app=express()

app.use(cors())
app.use(express.json())

app.post("/",(req,res)=>{
    let tmp={name:"ok"}
    console.log(req.body)
    res.status(200).send(tmp)
})
app.use('/user',userRoute)
app.use('/messages',messagesRoute)


const port=process.env.PORT || 3000

app.listen(port,()=>{
    
    console.log(`Server is running on port ${port}` )
})