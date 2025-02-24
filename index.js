import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/Database.js";
import UserRoute from "./routes/UserRoute.js";

dotenv.config();
const app = express();

// Fungsi async untuk koneksi ke database
const connectDB = async () => {
    try {
//         console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
// console.log("DB_NAME:", process.env.DB_NAME);
// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_PORT:", process.env.DB_PORT);

        await db.authenticate();
        console.log("Database connected");
        // await db.sync();
        // console.log("Database synced");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

// Panggil fungsi koneksi database
connectDB();

app.use(cors({ credentials: true, origin: `${process.env.CLIENT_URL}` }));
app.use(cookieParser());
app.use(express.json());
app.use(UserRoute);

app.listen(5500, () => {
    console.log("Server running on port 5500");
});
