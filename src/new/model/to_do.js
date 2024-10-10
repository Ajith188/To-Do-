const mongoose = require('mongoose')


const ToDoSchema = mongoose.Schema({
    title: String,
    completed: {
        type:String,
        default:''
    },
    userId: String, 
    date: String,
})


const ToDo = mongoose.model('ToDoSchema', ToDoSchema)


module.exports = {
    ToDo
}