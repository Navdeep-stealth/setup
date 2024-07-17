import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log("Mongo DB connected");
    } catch (error) {
        console.log("Mongo Db connection error", error);
        process.exit(1);
    }
}

export default connectDb