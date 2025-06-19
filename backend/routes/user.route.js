const express=require("express");
const { signup, login, logout } = require("../controllers/user.controller");
const { auth } = require("../middleware/auth");
const router=express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.get("/me",auth,(req,res)=>{
    res.status(200).json({user:req.user});
});

module.exports=router;