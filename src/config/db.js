const mongoose = require('mongoose');
let pending;
async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured');
  if (!pending) pending = mongoose.connect(process.env.MONGODB_URI, {serverSelectionTimeoutMS:10000}).catch(e=>{pending=null;throw e;});
  await pending;
}
module.exports = connectDB;
