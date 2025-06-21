const express=require("express");
const { auth } = require("../middleware/auth");
const { createRoom,joinRoom, leaveRoom,getRoomDetails, getUserRooms, saveCode } = require("../controllers/room.controller");
const router=express.Router();  

router.post("/create",auth,createRoom);
router.post("/join",auth,joinRoom);
router.post("/leave",auth,leaveRoom);

router.get("/my-rooms", auth,(req,res)=>{
    getUserRooms(req,res);
})
router.put("/save-code", auth, saveCode);
router.get("/:roomId",auth,getRoomDetails);

module.exports=router;