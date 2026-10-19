require('dotenv').config();
const express=require('express');
const helmet=require('helmet');
const rateLimit=require('express-rate-limit');
const morgan=require('morgan');
const fs=require('fs'),path=require('path');
const connectDB=require('./src/config/db');
const app=express();
app.set('trust proxy',1);app.use(helmet());app.use(express.json({limit:'50kb'}));
if(!process.env.VERCEL){
 const logDir=path.join(__dirname,'logs');fs.mkdirSync(logDir,{recursive:true});
 app.use(morgan('combined',{stream:fs.createWriteStream(path.join(logDir,'requests.log'),{flags:'a'})}));
}
app.use(morgan('tiny'));
app.get('/health',(_req,res)=>res.status(200).json({status:'ok',service:'COMP3123 Assignment1 API',timestamp:new Date().toISOString()}));
const authLimit=rateLimit({windowMs:15*60*1000,limit:15,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Too many authentication attempts, try again later'}});
app.use('/api/v1/user',authLimit);
app.use('/api/v1',async(req,res,next)=>{try{await connectDB();next();}catch(e){next(e);}});
app.use('/api/v1/user',require('./src/routes/users'));
app.use('/api/v1/emp',require('./src/routes/employees'));
app.use((_req,res)=>res.status(404).json({error:'Route not found'}));
app.use((err,req,res,next)=>{console.error('API error',err.name,err.message);if(err instanceof SyntaxError&&'body'in err)return res.status(400).json({error:'Malformed JSON'});if(err.name==='ValidationError'||err.name==='CastError')return res.status(400).json({error:'Invalid request data'});res.status(500).json({error:'Internal server error'});});
module.exports=app;
