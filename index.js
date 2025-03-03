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

        await db.authenticate();
        console.log("Database connected");
       // await db.sync({ force: false, alter: true });
        // console.log("Database synced");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

// Panggil fungsi koneksi database
connectDB();
const allowedOrigins = [process.env.CLIENT_URL];

app.use(cors({
    origin: function (origin, callback) {
        //console.log("Request Origin:", origin);  // Debugging
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(UserRoute);

app.listen(8080, () => {
    console.log("Server running on port 5500");
});
