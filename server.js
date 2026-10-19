require('dotenv').config();
const app=require('./app');
const connectDB=require('./src/config/db');
const port=Number(process.env.PORT)||3000;
if(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32){console.error('Configure JWT_SECRET (32+ characters)');process.exit(1);}
connectDB().then(()=>{app.listen(port,()=>console.log(`API running at http://localhost:${port}`));}).catch(e=>{console.error('MongoDB connection failed',e.message);process.exit(1);});
