const express=require("express")
const app=express()
require('dotenv').config();
const connectDb=require("./config/connectionDB")
const cors=require("cors")

const adminRoutes = require("./routes/admin");
const reportRoutes = require("./routes/report");
const PORT=process.env.PORT || 3000
connectDb()

app.use(express.json())
app.use(cors())
app.use(express.static("public"))

app.use("/",require("./routes/user"))
app.use("/recipe",require("./routes/recipe"))

app.use("/admin", adminRoutes); 
app.use("/report", reportRoutes);

app.listen(PORT,(err)=>{
    console.log(`app is listening on port ${PORT}`)
})