const mongoose=require("mongoose")

const ReportSchema = mongoose.Schema({
    recipeid: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },

}, { collection: "Report" } 
);

module.exports=mongoose.model("Report", ReportSchema)  