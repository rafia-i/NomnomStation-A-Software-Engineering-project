
const Report = require("../models/report"); 
const mongoose = require("mongoose");


const addReport = async (req, res) => {
  try {
    
    const raw = req.body?.recipeid ?? req.params?.recipeid;
    const recipeid = (raw ?? "").toString().trim();

    if (!recipeid) {
      return res.status(400).json({ message: "Invalid recipeid (must be a non-empty string)" });
    }

    
    const doc = await Report.findOneAndUpdate(
      { recipeid },
      { $inc: { count: 1 } },
      {
        new: true,                 
        upsert: true,              
        setDefaultsOnInsert: true, 
      }
    );

    return res.status(201).json(doc);
  } catch (err) {
    console.error("addReport error:", err);
    return res.status(500).json({ message: "Failed to add report" });
  }
};
const clearReport = async (req, res) => {
  try {
    const recipeid = (req.params.recipeid || "").toString().trim();
    if (!recipeid) return res.status(400).json({ message: "recipeid required" });

    await Report.findOneAndDelete({ recipeid });
    return res.json({ ok: true });
  } catch (err) {
    console.error("clearReport error:", err);
    return res.status(500).json({ message: "Failed to clear report" });
  }
};
module.exports = { addReport,clearReport  };
