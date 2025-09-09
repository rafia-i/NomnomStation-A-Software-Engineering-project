const Recipe=require("../models/recipe")
const mongoose = require("mongoose");   ///
//const getRecipes=async(req,res)=>{
    //res.json({message:"hello"})
   // const recipe=await Recipe.find()
   // return res.json(recipe)

//}
//const getRecipesbyid=async(req,res)=>{
   // //res.json({message:"hello"})
   // const recipe=await Recipe.findbyid(req.params.id)
  //  res.json(recipe)
//}
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    return res.json(recipes);
  } catch (err) {
    console.error("getRecipes error:", err);
    return res.status(500).json({ message: "Server error fetching recipes" });
  }
};

const getRecipesbyid = async (req, res) => {
  try {
    const { id } = req.params;

    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid recipe id" });
    }

    
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res.json(recipe);
  } catch (err) {
    console.error("getRecipesbyid error:", err);
    return res.status(500).json({ message: "Server error fetching recipe" });
  }
};

const addRecipes=async(req,res)=>{
    //res.json({message:"hello"})
    const {recipeID, name,category,cuisine,isvegan, ishalal,diet,ingredients,  
        region,instructions,time,coverimage,username,user_id}=req.body
    
    if (!name||!category||!cuisine||!ingredients||!instructions){
        return res.status(400).json({
            message: "Oops, seems like you missed a required field :("
        });

    }
    try {
        const newRecipe = await Recipe.create({
            recipeID,
            name,category, cuisine, isvegan, ishalal, diet,
            ingredients, region, instructions, time, coverimage,username,user_id
        });

        return res.status(201).json(newRecipe);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
   
///
const editRecipes=(req,res)=>{
    res.json({message:"hello"})
}///
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    let doc = null;

    if (mongoose.isValidObjectId(id)) {
      
      doc = await Recipe.findByIdAndDelete(id);
    } else {
      
      doc = await Recipe.findOneAndDelete({ recipeID: id });
    }

    if (!doc) return res.status(404).json({ error: "Recipe not found" });
    return res.json({ ok: true });
  } catch (e) {
    console.error("deleteRecipe error:", e);
    return res.status(500).json({ error: "Failed to delete recipe" });
  }
};
module.exports={getRecipes,getRecipesbyid,addRecipes,editRecipes,deleteRecipe }