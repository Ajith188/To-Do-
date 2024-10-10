const mongoose=require('mongoose')
const express=require('express')
const cors=require('cors')
const fs = require('fs')    
const config=require('./config.json')

const app=express()

app.use(cors())
app.use(express.json())

app.use(express.urlencoded({extended:false}))

app.get('/info',(req,res) => { return res.send({status  :1 , msg : 'Welcome to TO_DO service'})})

let versions = ['new'];
for(let v of versions) {
    let p = __dirname+'/src/'+v+'/router/';
    fs.readdirSync(p).forEach(file => {
        if(file.includes('js')) {
            let fn = file.replace('.js','');
            app.use('/'+v+'/'+fn, require(p+fn));
        }
    });
}




async function connectDB(){
    try {
        mongoose.connect(config.url,{
            // keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, 
        autoIndex: false, 
        maxPoolSize: 10,
        socketTimeoutMS: 45000, 
        family: 4 
        })
        console.log("db is connected")
    } catch (error) {
        console.log("db is not connected")
    }
}
connectDB()



app.listen(config.port ,function(){
    console.log("port running",config.port)
})
