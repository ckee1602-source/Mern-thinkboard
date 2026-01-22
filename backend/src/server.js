import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import {connectDB} from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";

import cors from "cors";

dotenv.config();

const app = express ();
const PORT = process.env.PORT || 5001

connectDB();

//middleware
app.use(cors({
    origin:"http://localhost:5173",
}));

app.use(express.json());// this middleware will parse JSON bodies : req.body

app.use(rateLimiter);


//app.use((req,res,next) => {
  //  console.log("We just got a new req");
    //next();
//});

app.use("/api/notes",notesRoutes);
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});

// mongodb+srv://ckeerthana1602_db_user:7KG01BdHYzVbbXFB@cluster0.i6fj6ma.mongodb.net/?appName=Cluster0
