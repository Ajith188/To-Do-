const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    user_name: String,
    email: String,
    password: String,   
    date: String,
    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User",
        required: true
    }
})


const user = mongoose.model('userSchema', userSchema)


module.exports = {
    user
}