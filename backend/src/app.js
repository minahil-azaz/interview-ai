require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const app = require('./app');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();



app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // replace with your frontend URL
    credentials: true, // allow cookies to be sent with requests
}));

// require all the routes here
const authRoutes = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');
// const { authMiddleware } = require('./middlewares/auth.middleware');

// use the routes here 
// we give the route of api here 
app.use('/api/auth',authRoutes);
app.use('/api/interview',interviewRouter)



module.exports = app;