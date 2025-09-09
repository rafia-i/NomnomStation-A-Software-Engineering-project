const express = require("express");
const router = express.Router();
const { loginAdmin,getStats ,getReportedRecipes  } = require("../controller/admin");

router.post("/login", loginAdmin);
router.get("/stats", getStats);   // 
router.get("/report", getReportedRecipes);

module.exports = router;
