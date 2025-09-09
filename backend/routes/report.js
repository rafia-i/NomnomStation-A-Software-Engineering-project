
const express = require("express");
const router = express.Router();
const { addReport ,clearReport} = require("../controller/report");


router.post("/", addReport);
router.delete("/:recipeid", clearReport);


module.exports = router;
