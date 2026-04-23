require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const {resume, 
    job_description,
    self_description} = require('./src/services/temp');
const {generateInterviewReport} = require('./src/services/ai.service'); 


connectDB();




app.listen(3000, async ()=>{
    console.log(`Server is running on port at 3000`);
})