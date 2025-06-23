const express=require("express");
const { auth } = require("../middleware/auth");
const { createRoom,joinRoom, leaveRoom,getRoomDetails, getUserRooms, saveCode, saveRoomCode } = require("../controllers/room.controller");
const router=express.Router();  

router.post("/create",auth,createRoom);
router.post("/join",auth,joinRoom);
router.post("/leave",auth,leaveRoom);

router.get("/my-rooms", auth,getUserRooms)
router.put("/save-code", auth, saveCode);
router.get("/:roomId",auth,getRoomDetails);
router.patch('/:roomId/save',auth,saveRoomCode);

module.exports=router;