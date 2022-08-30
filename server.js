const express = require('express')
const cors = require('cors')
const app = express()
const http = require("http");
const port = process.env.PORT || 5000

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

// Database condfiguration
const db = require('./config/db')
const userRouter = require('./routes/userRouter');
const harperSaveMessage = require('./services/harper-save-message');
const Chat = require('./models/ChatModel');
db.connect()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});


// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
// app.use(cors({ credentials: true }));


// Router configuration
app.use('/api/v1/user',userRouter)


// Chat implementations

const CHAT_BOT = 'ChatBot'; // Add this

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
  // We can write our socket event listeners in here...
});

app.get('/',(req,res)=>{
    res.send('NOdejs is working')
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})