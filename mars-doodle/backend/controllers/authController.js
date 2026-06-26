const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async(req,res)=>{

    try{

        const {username,email,password}=req.body;

        const existing = await User.findOne({email});

        if(existing)
            return res.status(400).json({
                message:"User already exists"
            });

        const hashed = await bcrypt.hash(password,10);

        const user = await User.create({
            username,
            email,
            password:hashed
        });

        res.status(201).json(user);

    }catch(err){
        res.status(500).json(err);
    }
}