import mongoose from "mongoose";

const DATABASE_URL = process.env.MONGODB_URL;

export async function connectToDb(){
    await mongoose.connect(DATABASE_URL)
    .then(() => console.log("Connection activated"))
    .catch((error) => console.log(error))
    .finally(() => console.log("Database connection attempted"))
}