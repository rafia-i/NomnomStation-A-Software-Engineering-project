const mongoose=require("mongoose")


const userSchema= mongoose.Schema({
    userID:{
        type:String,
        default: () => crypto.randomUUID()
    },
    username:{
        type:String,
        required:true
    },
    useremail:{
        type:String,
        required:true,
        unique:true
    },
    userpassword:{
        type:String,
        required:true
    },
    userphonenumber:{
        type:Number,
        required:true
    },
    allergens:{
        type:[String],
        default: [] 
    },
    diseases:{
        type:[String],
        default: [] 
    },
    height:{           
        type:Number,
        required:true
    },
    weight:{           
        type:Number,
        required:true
    },
    warningcount:{  
        type:Number,
        default:0
    },
    type:{      
        type:String,
        required:true
    },
    workedat:{      
        type:String,
        default:""
        
    },
    yearsofexp:{      
        type:String,
        default:""
      
    },

},{timestamps:true})

module.exports=mongoose.model("Users", userSchema)  