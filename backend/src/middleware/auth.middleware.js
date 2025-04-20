import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req,res,next) =>{
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({
                message: "Unauthorized , token not provided"
            });
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(400).json({
                message: "Unauthorized , false token provided"
            });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(400).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();

    }catch(e){
        console.log("error in protected route, " ,e);
        res.status(500).json({
            message : "Internal server error"
        })
    }
}