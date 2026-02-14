const express= require('express');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const pool=require('../db');

const router=express.Router();
const SALT_ROUNDS=10;
const isSimiliar=(username,password)=>{
    const user=username.toLowerCase();
    const pass=password.toLowerCase();
    if(pass.includes(user)&&user.length>0){
        return true
    };

    const userChars=user.split(``);
    const commonChars=userChars.filter(c=>pass.includes(c));
    return(commonChars.length/userChars.length)>0.7;
}
router.post('/register',async(req,res)=>{
    const {username,email,password}=req.body;
    if(!username||!email||!password){
        return res.status(400).json({error:`All fields are required to register`});
    }
    if(password.length<6){
        return res.status(400).json({error:`Password too Short`});
    }

    if(isSimiliar(username,password)){
        return res.status(400).json({error:`Password too similiar to username`})
    }
    try{
        const existing=await pool.query(
            `SELECT id FROM users WHERE email=$1`,[email]
        );
        if(existing.rows.length>0){
            return res.status(409).json({error:`Email already registered`});
        }
        const password_hash=await bcrypt.hash(password,SALT_ROUNDS);
        const result =await pool.query(
            `INSERT INTO users(username,email,password) VALUES ($1,$2,$3) RETURNING id,username,email`,
            [username,email,password_hash]
        );
        const user=result.rows[0];
        const token=jwt.sign(
            {userId:user.id,email:email},
            process.env.JWT_SECRET,
            {expiresIn:process.env.JWT_EXPIRES_IN}
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(201).json({message:`Account successfully created!`,
    user:{id:user.id,email:user.email}});
}
catch(err){
        console.error(`Register error:`,err);
        res.status(500).json({error:`Internal server error`});
    }
});

router.post('/login',async(req,res)=>{
    const{email,password}=req.body;
    if(!email||!password){
        return res.status(400).json({error:`Please enter valid username and password`});
    }
    try{
        const result=await pool.query(
            `SELECT * FROM users WHERE email=$1`,
            [email]
        );
        if(result.rows.length===0){
            return res.status(400).json({error: `Invalid email or password`});
        }
        const user=result.rows[0];
        const passMatch=await bcrypt.compare(password,user.password);

        if (!passMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token=jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            )
            res.cookie('token',token,{
                httpOnly:true,
                secure:process.env.NODE_ENV=='production',
                sameSite:'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({message:`Succesfully logged in!`,user:{id:user.id,email:user.email}
});
}
catch(err){
        res.status(500).json({error:`Internal server error`});
    }
})
module.exports=router;