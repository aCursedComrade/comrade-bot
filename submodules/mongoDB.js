import mongoose from 'mongoose';

async function mongo() {
    try {
        const URL = process.env.DB_URL.toString();
        mongoose.set('strictQuery', false);
        mongoose.connect(URL, {
            user: process.env.DB_USER.toString(),
            pass: process.env.DB_PASS.toString(),
            retryWrites: true,
            writeConcern: { w: 'majority' },
        });
    } catch (error) {
        console.error(`MongoDB: ${error.message}`);
    }
}

export default mongo;
