import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser';

import authRoutes from '../src/routes/auth.route.js' //module type will need to have the extension in the end for importings
import messageRoutes from '../src/routes/message.route.js'
import { connectDB } from '../src/lib/db.js'
 
dotenv.config()
const app = express();

app.use(express.json());
app.use(cookieParser()); 

//auth routes
app.use('/api/auth' , authRoutes)
app.use('/api/message' , messageRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`app is running on port ${process.env.PORT}`)
    connectDB();
})