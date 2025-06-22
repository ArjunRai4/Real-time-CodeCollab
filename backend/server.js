const express=require("express");
const http=require("http");
const dotenv=require("dotenv");
const cookieParser=require("cookie-parser");

const {Server}=require("socket.io");
const cors=require("cors");
const connectDB = require("./config/db.connection");

const userRoutes=require('./routes/user.route');
const roomRoutes=require('./routes/room.route');
const aiRoutes = require("./routes/ai.route");

dotenv.config();

const app=express();
const PORT=process.env.PORT

app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // This allows cookies to be sent with requests
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user",userRoutes);
app.use("/api/room",roomRoutes);
app.use("/api/ai", aiRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on PORT:${PORT}`);
    connectDB();
})

