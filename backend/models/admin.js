const mongoose=require("mongoose")

const AdminSchema = mongoose.Schema({
    adminid: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, 
    phone: { type: String, required: true },

}, { collection: "Admin" } 
);

module.exports=mongoose.model("Admin", AdminSchema)  