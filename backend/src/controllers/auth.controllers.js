import bcrypt from 'bcryptjs';

import User from '../models/user.model.js'
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req,res) =>{
    const { email, fullName, password, profilePic } = req.body;
    try{
        const user = await User.findOne({email});

        if(!email || !fullName || !password){
            return res.status(400).json({
                message: "Please provide the needed fields"
            })
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                message: "Enter valid email format"
            })
        }
        
        if(user){
            return res.status(400).json({
                message: "Email already taken"
            });
        }
        
        if(password.length < 6){
            return res.status(400).json({   
                message: "Password should be greater than 6 characters"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await User.create({
            email,
            fullName,
            password: hashedPassword,
            profilePic,
        })

        if(newUser){
            generateToken(newUser._id , res)
            
            return res.status(201).json({
                message: "User successfully created",
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    fullName: newUser.fullName,
                    profilePic: newUser.profilePic
                }
            })
        }else{
            res.status(400).json("Invalid user data");
        }

    }catch(err){
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const login = async (req,res) =>{
    const { email , password }  = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const isVerified = await bcrypt.compare(password,user.password);

        if(!isVerified){
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        generateToken(user._id,res);

        res.status(200).json({
    
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
        
    }catch(e){
        console.log("Error with login");
        res.status(500).json({
            message: "internal server error"
        })
    }
}

export const logout =  (req,res)=>{  
    try {
         res.cookie("jwt" , "",{
            maxAge: 0
        });
        res.status(200).json({
            message: "Logged out successfully"
        })
    } catch (err) {
        console.log("Error logging out" , err)
    }
}


export const updateProfile = async (req,res) =>{
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({
                message: "Profile picture needed"
            });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId , {profilePic: uploadResponse.secure_url} , {new: true});

        res.status(200).json({updatedUser})
    }catch(e){
        console.log("Error in updating profile " , e)
        res.status(500).json({
            message: "Internal sever error"
        })
    }

}

export const checkAuth = async (req,res) =>{
    try{
        res.status(200).json(req.user);
    }catch(e){
        console.log("Error in checkAuth " , e);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

