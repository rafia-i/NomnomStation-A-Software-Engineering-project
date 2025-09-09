const mongoose=require("mongoose")

const recipeSchema=mongoose.Schema({    
    recipeID:{
        type:String,  
        default: () => crypto.randomUUID(),
    },
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        
    },

    cuisine:{
        type:String,
        required:true
    },
    isvegan:{
        type:Boolean,
    
    },
    ishalal:{
        type:Boolean,
    
    },
    diet:{
        type:String,
    
    },
    ingredients:{
        type:[String],
        required:true
    },
    region:{
        type:String,
        
    },
    instructions:{
        type:String,
        required:true
    },
    time:{
        type:String,
        
    },
    coverimage:{
        type:String,
        
    },
    username:{
        type:String,
        required:true
    },
    user_id:{
        type:String,
        required:true
    }
    

    
},{timestamps:true})

module.exports=mongoose.model("Recipe", recipeSchema)
