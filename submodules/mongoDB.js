import mongoose from 'mongoose';
import 'dotenv/config';

export async function init_mongoDB() {
  try {
    const URL = process.env.DB_URL.toString();
    mongoose.connect(URL, { user: process.env.DB_USER.toString(), pass: process.env.DB_PASS.toString(), retryWrites: true });
    const db = mongoose.connection;
    // db.on('connection', console.log.bind(console, 'MongoDB log:'));
    db.on('error', console.error.bind(console, 'MongoDB error:'));
  }
  catch (error) {
    console.error('MongoDB: ' + error.message);
  }
}
