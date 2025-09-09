const User = require("../models/user")
const bcrypt = require("bcrypt")  
const jwt = require("jsonwebtoken")  //baaddisi

const userSignUp=async(req,res)=>{
    const { userID, username, useremail, userpassword,userphonenumber,height,weight,allergens,diseases,warningcount,type,workedat,yearsofexp} = req.body
    if (!useremail || !userpassword || !username || !userphonenumber || !height || !weight|| !type ) {
        return res.status(400).json({ message: "Please fill the required information" })

    }
    let user = await User.findOne({ useremail })
    if (user) {
        return res.status(400).json({ error: "Email is already exist" })
    }
    const hashPwd = await bcrypt.hash(userpassword, 10)
    const newUser = await User.create({
        userID,
        username,
        useremail,
        userpassword: hashPwd,
        userphonenumber: Number(userphonenumber),
        allergens,
        diseases,
        height: Number(height),
        weight: Number(weight),
        warningcount,
        type,
        workedat,
        yearsofexp


    })
    let token = jwt.sign({useremail, userID: newUser._id }, process.env.SECRET_KEY)
    return res.status(200).json({ token, user:newUser })

}


const userLogin=async(req,res)=>{
    const { useremail, userpassword } = req.body
    if (!useremail || !userpassword) {
        return res.status(400).json({ message: "Please fill the required information" })
    }
    let user = await User.findOne({ useremail })
    if (user && await bcrypt.compare(userpassword, user.userpassword)) {
        let token = jwt.sign({ useremail, userid: user._id }, process.env.SECRET_KEY)
        return res.status(200).json({ token, user })
    }
    else {
        return res.status(400).json({ error: "Invaild credientials" })
    } 
}

const getUser=async(req,res)=>{
    const user = await User.findById(req.params.id)
    res.json({email:user.useremail})
    
}


const updateHealth = async (req, res) => {
  const { allergens = [], diseases = [] } = req.body;

  if (!Array.isArray(allergens) || !Array.isArray(diseases)) {
    return res.status(400).json({ message: "allergens and diseases must be arrays" });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  user.allergens = allergens;
  user.diseases  = diseases;

  await user.save();

  return res.status(200).json({ user });
};



module.exports={userSignUp,userLogin,getUser,updateHealth }