import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import {connectDB} from "./config/db.js";
import dotenv from "dotenv";
import path from "path";
import ratelimiter from "./middleware/ratelimiter.js";

import cors from "cors";

dotenv.config();

const app = express ();
const PORT = process.env.PORT || 10000;

const __dirname = path.resolve();

connectDB();

//middleware
if(process.env.NODE_ENV !== "production"){
  app.use(cors({
      origin:"http://localhost:5173",
  }));
}

app.use(express.json());// this middleware will parse JSON bodies : req.body

app.use(ratelimiter);


//app.use((req,res,next) => {
  //  console.log("We just got a new req");
    //next();
//});

app.use("/api/notes",notesRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")))

  app.get("*",(req,res)=> {
  res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
});


}
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});

// mongodb+srv://ckeerthana1602_db_user:7KG01BdHYzVbbXFB@cluster0.i6fj6ma.mongodb.net/?appName=Cluster0
