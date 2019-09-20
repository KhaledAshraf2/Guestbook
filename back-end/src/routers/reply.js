const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const {ObjectID}=require('mongodb')

router.get('/view/:msgID', auth, (req, res) => {
    let msgs=req.user.messages.find((message)=>{
        return message._id.toString()===req.params.msgID.toString()
    })
    res.send(msgs.reply)
})
router.post('/create/:msgID',auth,async(req,res)=>{
    try{
        let reply={
            _id:new ObjectID(),
            owner:req.user.email,
            content:req.body.content
        }
        let receivingMail=""
        req.user.messages=req.user.messages.map((message)=>{
            if(message._id.toString()===req.params.msgID.toString()){
                message.reply.push(reply)
                receivingMail=message.email
            }
            return message
        })
        let receivingUser = await User.findOne({ email:receivingMail })
        receivingUser.messages=receivingUser.messages.map((message)=>{
            if(message._id.toString()===req.params.msgID.toString()){
                message.reply.push(reply)
            }
            return message
        })
        
        await req.user.save()
        await receivingUser.save()
        res.status(201).send("Replied")
    }
    catch(e){
        res.status(400).send(e.messages)
    }
})

router.delete('/delete/:msgID/:replyID', auth, async (req, res) => {
    try {
        let receivingMail=""
        req.user.messages= await req.user.messages.filter((message)=>{
            if(message._id.toString()===req.params.msgID.toString()){
                receivingMail=message.email
                message.reply=message.reply.filter((reply)=>{
                    if(reply._id.toString()===req.params.replyID){
                        return false;
                    }
                    return true
                })
            }
            return true
        })
        let receivingUser = await User.findOne({ email:receivingMail })
        receivingUser.messages= await receivingUser.messages.filter((message)=>{
            if(message._id.toString()===req.params.msgID.toString()){
                message.reply=message.reply.filter((reply)=>{
                    if(reply._id.toString()===req.params.replyID){
                        return false;
                    }
                    return true
                })
            }
            return true
        })
        await req.user.save()
        await receivingUser.save()
        res.status(200).send(receivingUser.messages)
    }
    catch (e) {
        res.status(500).send(e.message)
    }
})
router.patch('/edit/:msgID/:replyID', auth, async (req, res) => {
    try {
        console.log("here")
        let receivingMail=""
        req.user.messages= await req.user.messages.map((message)=>{
            if(message._id.toString()===req.params.msgID.toString()){
                receivingMail=message.email
                message.reply=message.reply.map((reply)=>{
                    if(reply._id.toString()===req.params.replyID){
                        reply.content=req.body.content
                    }
                    return reply
                })
            }
            return message
        })
        let receivingUser = await User.findOne({ email:receivingMail })
        receivingUser.messages= await receivingUser.messages.filter((message)=>{
            if(message._id.toString()===req.params.msgID.toString()){
                message.reply=message.reply.filter((reply)=>{
                    if(reply._id.toString()===req.params.replyID){
                        reply.content=req.body.content
                    }
                    return message
                })
            }
            return message
        })
        await req.user.save()
        await receivingUser.save()
        res.status(200).send("reply edited")
    }
    catch (e) {
        res.status(400).send(e.message)
    }
})
module.exports = router