require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');


connectDB();



app.listen(3000, async ()=>{
    console.log(`Server is running on port at 3000`);
})