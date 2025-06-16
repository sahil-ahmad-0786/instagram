import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from "dotenv"
import connectDB from './utils/db.js';
dotenv.config({});
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'
import { app, server } from './socket/socket.js';
// import path from "path"

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"I am Coming from Backend",
        success:true
    })
})

const port = process.env.PORT || 8000;

// const __dirname = path.resolve()
// console.log(__dirname);


//Middleware
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))
const corsOptions={
    origin: ['http://localhost:5173','https://instaclone006.netlify.app'],
    credentials:true
}
app.use(cors(corsOptions))

//yha pr api aayengi
app.use("/api/v1/user",userRoute)
app.use("/api/v1/post",postRoute)
app.use("/api/v1/message",messageRoute)

// app.use(express.static(path.join(__dirname,"/frontend/dist")))
// app.get("*",(_,res)=>{
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
// })

server.listen(port,()=>{
    connectDB();
    console.log("Server is Listing on "+port+ ' port');
})