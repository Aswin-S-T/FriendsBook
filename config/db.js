const mongoose = require('mongoose')
require('dotenv').config()
const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017/my-socialmedia-application"

module.exports.connect = ()=>{
    console.log("DBURL------------", dbUrl);
    mongoose.connect(dbUrl,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    },(err,done)=>{
        if(err) throw err
        console.log(`Mongodb connected successfully`)
    })
}