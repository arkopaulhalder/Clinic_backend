import mongoose from "mongoose";

export const connectDB = async () => {
    mongoose.connect
        (process.env.MONGO_URI, {
            dbName: process.env.DB_NAME,
        })
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.error(`Some error occured while connecting to database: ${err}`);
        });
}