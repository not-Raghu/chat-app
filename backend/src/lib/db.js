import mongoose, { mongo } from 'mongoose';

export const connectDB = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`mongodb connected ${conn.connection.host}`);
        
    }catch(e){
        console.log("error connecting to db: " , e);
    }
}

