const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const router = new express.Router()
//@path    /users/
router.post('/create', async (req, res) => {
    let { email, password } = req.body
    try {
        await User.userCheck(email)
        password = await bcrypt.hash(password, 8)
        const user = new User({ email, password })
        await user.save()
        let token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    }
    catch (err) {
        res.status(400).send({ Error: "Error Creating account, Please try again." })
    }

})


router.post('/login', async (req, res) => {
    let { email, password } = req.body
    try {
        const user = await User.findByCredentials(email, password)
        let token = await user.generateAuthToken()

        res.status(200).send({ user, token })
    }
    catch (err) {
        res.status(400).send({ Error: "Error signing In, Please try again." })
    }

})
// router.get('/',auth, (req, res) => {
//     let {user}=req
//     res.send({'HERE    ':user})
// })
module.exports = router