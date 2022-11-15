const express = require('express');
const chats = require("./data/data");
const dotnet = require("dotenv");
const cors = require("cors");
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
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

app.use('/api/user', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server started ${PORT}...`);
})