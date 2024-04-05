const mongoose = require("mongoose")

const Userschema = new mongoose.Schema({
    name: String,
    username: String,
    email: {
        type: String,
        unique: true,
        required: false
    },
    password: String,
    repeatpassword:String,
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    expiry:Date,
})

const UserModel = mongoose.model("user", Userschema)
module.exports = UserModel

