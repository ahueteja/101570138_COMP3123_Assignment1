const jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
 const header=req.headers.authorization||'';
 const match=/^Bearer (.+)$/i.exec(header);
 if(!match)return res.status(401).json({error:'Missing bearer token'});
 try { const payload=jwt.verify(match[1],process.env.JWT_SECRET,{algorithms:['HS256']});req.userId=payload.sub;return next(); }
 catch(e){return res.status(401).json({error:e.name==='TokenExpiredError'?'Token expired':'Invalid token'});}
};
