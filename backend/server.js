const express=require("express");
const http=require("http");
const dotenv=require("dotenv");
const cookieParser=require("cookie-parser");

const {Server}=require("socket.io");
const cors=require("cors");
const connectDB = require("./config/db.connection");

const userRoutes=require('./routes/user.route');
const roomRoutes=require('./routes/room.route');

dotenv.config();

const app=express();
const PORT=process.env.PORT

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/user",userRoutes);
app.use("/api/room",roomRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on PORT:${PORT}`);
    connectDB();
})

