const mongoose = require('mongoose')
require('dotenv').config()
const dbUrl =
  "mongodb+srv://aswins:hiDUFsmgEnD6UDnv@cluster0.togzf88.mongodb.net/?retryWrites=true&w=majority" 
//   "mongodb://localhost:27017/my-socialmedia-application";

// const dbUrl = "mongodb://localhost:27017/my-socialmedia-application";

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