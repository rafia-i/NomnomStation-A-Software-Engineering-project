const express =require("express")
const { getRecipes,getRecipesbyid, addRecipes, editRecipes, deleteRecipe } = require("../controller/recipe")
const router=express.Router()

router.get("/",getRecipes)  
router.get("/:id",getRecipesbyid)  


router.post("/",addRecipes)  

router.put("/:id",editRecipes)  

router.delete("/:id",deleteRecipe)  
////

////
module.exports=router