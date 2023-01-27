const express = require('express');
const chats = require("./data/data");
const dotnet = require("dotenv");
const cors = require("cors");
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotnet.config();

const app = express();

connectDB();

app.use(cors({
    origin: '*'
}));

app.use(express.json()); //to accept json data

app.get("/", (req, res) => {
    res.send('api working');
    console.log('demo');
})

// app.get('/api', (req,res) => {
//     console.log('get demo');
//     res.send('demo get')
// })

// app.post('/api', (req,res) => {
//     console.log(req.body);
//     console.log('demo');
// })

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`server started ${PORT}...`);
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat", (room) => {
        socket.join(room);
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));

    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        })
    })

    socket.off("setup", () => {
        console.log("User Disconnected");
        socket.leave(userData._id);
    })
})