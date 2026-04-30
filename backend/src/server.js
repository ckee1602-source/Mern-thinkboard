import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import path from "path";
import ratelimiter from "./middleware/ratelimiter.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// 1. GLOBAL MIDDLEWARE
// Move CORS here so it always works during development
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(ratelimiter);

// 2. ROUTES
app.use("/api/notes", notesRoutes);

// 3. PRODUCTION CONFIG
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

// 4. DATABASE & SERVER START
// Only call connectDB once here
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on PORT: ${PORT}`);
    });
}).catch(err => {
    console.error("Database connection failed:", err);
});
