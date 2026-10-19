const express=require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/User');
const {invalid,userValidation}=require('../middleware/validate');
const router=express.Router();
router.post('/signup',async(req,res,next)=>{
 try{
  const errors=userValidation(req.body,true);if(errors.length)return invalid(res,errors);
  const username=req.body.username.trim(),email=req.body.email.toLowerCase().trim();
  if(await User.exists({$or:[{username},{email}]}))return res.status(409).json({error:'Username or email already exists'});
  const password=await bcrypt.hash(req.body.password,12);
  const user=await User.create({username,email,password});
  console.info('Signup success',user.id);
  res.status(201).json({message:'User created',user:{id:user.id,username:user.username,email:user.email}});
 }catch(e){if(e.code===11000)return res.status(409).json({error:'Username or email already exists'});next(e);}
});
router.post('/login',async(req,res,next)=>{
 try{
  const errors=userValidation(req.body,false);if(errors.length)return invalid(res,errors);
  const selector=req.body.email?{email:String(req.body.email).toLowerCase().trim()}:{username:req.body.username};
  const user=await User.findOne(selector).select('+password');
  if(!user||!(await bcrypt.compare(req.body.password,user.password))){console.warn('Login failed');return res.status(401).json({error:'Invalid credentials'});}
  const token=jwt.sign({},process.env.JWT_SECRET,{subject:user.id,expiresIn:'1h',algorithm:'HS256'});
  console.info('Login success',user.id);
  res.status(200).json({message:'Login successful',token,token_type:'Bearer',expires_in:3600});
 }catch(e){next(e);}
});
module.exports=router;
