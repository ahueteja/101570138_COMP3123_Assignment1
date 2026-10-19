const validator=require('validator');
const mongoose=require('mongoose');
function invalid(res,fields){return res.status(400).json({error:'Validation failed',details:fields});}
function userValidation(data,signup){
 const errors=[];
 if(signup && (typeof data.username!=='string'||!/^[A-Za-z0-9_]{3,40}$/.test(data.username))) errors.push('username must be 3-40 letters, numbers or underscores');
 if(signup && (typeof data.email!=='string'||!validator.isEmail(data.email))) errors.push('valid email required');
 if(signup && (typeof data.password!=='string'||data.password.length<8||data.password.length>72))errors.push('password must be 8-72 characters');
 if(!signup){if(!data.username&&!data.email)errors.push('username or email required');if(data.email&&!validator.isEmail(String(data.email)))errors.push('invalid email');if(typeof data.password!=='string'||!data.password)errors.push('password required');}
 return errors;
}
const required=['first_name','last_name','email','position','salary','date_of_joining','department'];
function employeeValidation(data,partial=false){
 const errors=[];
 if(!data||typeof data!=='object'||Array.isArray(data))return ['JSON object required'];
 if(!partial) for(const field of required)if(data[field]===undefined||data[field]===null||data[field]==='') errors.push(`${field} is required`);
 for(const key of Object.keys(data))if(!required.includes(key))errors.push(`${key} is not allowed`);
 for(const key of ['first_name','last_name','position','department'])if(data[key]!==undefined && (typeof data[key]!=='string'||!data[key].trim()||data[key].length>100))errors.push(`${key} must be a nonempty string (max 100)`);
 if(data.email!==undefined && (typeof data.email!=='string'||!validator.isEmail(data.email)))errors.push('invalid employee email');
 if(data.salary!==undefined && (typeof data.salary!=='number'||!Number.isFinite(data.salary)||data.salary<0))errors.push('salary must be a nonnegative number');
 if(data.date_of_joining!==undefined && (typeof data.date_of_joining!=='string'||!/^\d{4}-\d\d-\d\d$/.test(data.date_of_joining)||!validator.isISO8601(data.date_of_joining,{strict:true})))errors.push('date_of_joining must be valid YYYY-MM-DD');
 if(partial&&Object.keys(data).length===0)errors.push('at least one field required');
 return errors;
}
module.exports={invalid,userValidation,employeeValidation,validId:mongoose.isValidObjectId};
