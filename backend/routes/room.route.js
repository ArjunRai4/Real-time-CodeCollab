const express=require("express");
const { auth } = require("../middleware/auth");
const { createRoom,joinRoom, leaveRoom,getRoomDetails, getUserRooms, saveCode } = require("../controllers/room.controller");
const router=express.Router();  

router.post("/create",auth,createRoom);
router.post("/join",auth,joinRoom);
router.post("/leave",auth,leaveRoom);

router.get("/:roomId",auth,getRoomDetails);
router.get("/my-rooms", auth, getUserRooms);
router.put("/save-code", auth, saveCode);

module.exports=router;