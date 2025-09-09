const express =require("express")
const { userSignUp,userLogin, getUser,updateHealth} = require("../controller/user")
const router=express.Router()

router.post("/signUp",userSignUp)
router.post("/login",userLogin)
router.get("/user/:id",getUser)
router.put('/user/:id', updateHealth)


module.exports=router