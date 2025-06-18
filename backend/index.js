import dotenv from "dotenv"
dotenv.config({});
import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'
import { app, server } from './socket/socket.js';
// import { fileURLToPath } from 'url';
// import path from "path"


const port = process.env.PORT || 8000;

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// console.log(__dirname);


//Middleware
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))
const corsOptions={
    origin: ['http://localhost:5173','https://insta785.netlify.app'],
    credentials:true
}
app.use(cors(corsOptions))

//yha pr api aayengi
app.use("/api/v1/user",userRoute)
app.use("/api/v1/post",postRoute)
app.use("/api/v1/message",messageRoute)

// app.use((req, res, next) => {
//   console.log("Origin:", req.headers.origin);
//   next();
// });

// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req,res)=>{
//     res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// })


// app.get("/",(req,res)=>{
//     return res.status(200).json({
//         message:"I am Coming from Backend",
//         success:true
//     })
// })


server.listen(port,()=>{
    connectDB();
    console.log("Server is Listing on "+port+ ' port');
})