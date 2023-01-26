const express = require('express');
const chats = require("./data/data");
const dotnet = require("dotenv");
const cors = require("cors");
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotnet.config();

const app = express();

connectDB();

app.use(cors({
    origin: '*'
}));

app.use(express.json()); //to accept json data

// app.get("/", (req, res) => {
//     res.send('api working');
//     console.log('demo');
// })

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

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server started ${PORT}...`);
})