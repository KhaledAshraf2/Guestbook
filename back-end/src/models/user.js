const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    messages: [{
        email: String,
        content: String,
        reply: [{
            owner:String,
            content:String
        }],
        kind:String,

    }],
    tokens: [{
        token: String
    }]
})
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}
userSchema.statics.userCheck = async (email) => {
    const user = await User.findOne({ email })
    if (user) {
        throw new Error("User Already Exists")
    }
}
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


const User = mongoose.model('User', userSchema)

module.exports = User