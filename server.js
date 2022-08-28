const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

// Database condfiguration
const db = require('./config/db')
const userRouter = require('./routes/userRouter')
db.connect()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// var corsOptions = {
//   origin: "*",
//   methods: ["GET", "POST","DELETE"],
// };

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
// app.use(cors({ credentials: true }));


// Router configuration
app.use('/api/v1/user',userRouter)

app.get('/',(req,res)=>{
    res.send('NOdejs is working')
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})