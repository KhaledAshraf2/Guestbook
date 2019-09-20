const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const { ObjectID } = require('mongodb')

const replyRoute = require('./reply')

router.use('/reply', replyRoute)

router.get('/view', auth, (req, res) => {
    try {
        res.status(200).send(req.user)
    }
    catch (e) {
        res.status(400).send({ Error: "Unauthorizaed" })
    }
})
router.post('/send', auth, async (req, res) => {
    try {
        let { user } = req
        let { email, content } = req.body
        let receivingUser = await User.findOne({ email })
        if (!receivingUser) {
            res.status(404).send("Receiver user not found")
        }
        let message = {
            _id: new ObjectID(),
            email,
            content,
            reply: [],
            kind: ""
        }
        message.kind = "sender"
        user.messages.push(message)
        message.kind = "receiver"
        message.email = user.email
        receivingUser.messages.push(message)
        await user.save()
        await receivingUser.save()
        res.status(201).send(receivingUser)
    }
    catch (e) {
        res.status(400).send({ Error: "Sending Failed..." + e.message })

    }
})
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        //const user = await User.findOne({ _id: req.user._id, 'messages._id': req.params.id })
        let receivingMail = ""
        req.user.messages = await req.user.messages.filter((message) => {
            if (message._id.toString() === req.params.id.toString()) {
                receivingMail = message.email
                return false
            }
            return true
        })
        let receivingUser = await User.findOne({ email: receivingMail })
        receivingUser.messages = receivingUser.messages.filter((message) => {
            if (message._id.toString() === req.params.id.toString()) {
                return false
            }
            return true
        })
        await req.user.save()
        await receivingUser.save()
        res.status(200).send()
    }
    catch (e) {
        res.status(500).send(e.message)
    }
})

router.patch('/edit/:id', auth, async (req, res) => {
    try {
        let receivingMail = ""
        req.user.messages = await req.user.messages.map((message) => {
            if (message._id.toString() === req.params.id) {
                message.content = req.body.content
                receivingMail = message.email
            }
            return message
        })
        let receivingUser = await User.findOne({ email: receivingMail })
        receivingUser.messages = receivingUser.messages.map((message) => {
            if (message._id.toString() === req.params.id) {
                message.content = req.body.content
            }
            return message
        })
        await req.user.save()
        await receivingUser.save()
        res.status(200).send("Done")
    }
    catch (e) {
        res.status(400).send(e.messages)
    }
})
module.exports = router