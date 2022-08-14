const mongoose = require('mongoose')
const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/my-socialmedia-application"

module.exports.connect = ()=>{
    mongoose.connect(dbUrl,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    },(err,done)=>{
        if(err) throw err
        console.log(`Mongodb connected successfully`)
    })
}