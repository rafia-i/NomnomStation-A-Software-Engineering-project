const Admin = require("../models/admin");
const User   = require("../models/user");    
const Recipe = require("../models/recipe");  
const Report = require("../models/report");
const loginAdmin = async (req, res) => {
  try {
    const { adminid, password } = req.body;

    
    const adminIdNum = Number(adminid);
    const query = Number.isNaN(adminIdNum) ? { adminid } : { adminid: adminIdNum };

    const admin = await Admin.findOne(query);

    if (!admin) {
      return res.status(401).json({ ok: false, error: "Incorrect credentials" });
    }

    if (admin.password !== String(password)) {
      return res.status(401).json({ ok: false, error: "Incorrect credentials" });
    }

    res.json({
      ok: true,
      admin: { adminid: admin.adminid, name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
};


const getStats = async (_req, res) => {
  try {
    const [usersCount, recipesCount] = await Promise.all([
      User.countDocuments({}),
      Recipe.countDocuments({})
    ]);
    return res.json({ ok: true, usersCount, recipesCount });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Failed to compute stats" });
  }
};
const getReportedRecipes = async (_req, res) => {
  try {
   
    const reports = await Report.find({}, { recipeid: 1, count: 1, _id: 0 })
      .sort({ count: -1 })
      .lean();

  
    const items = reports.map(r => ({
      _id: r.recipeid,        
      recipeid: r.recipeid,   
      count: r.count ?? 0,
    }));

    return res.json({ ok: true, items });
  } catch (err) {
    console.error("getReportedRecipes error:", err);
    return res.status(500).json({ ok: false, error: "Failed to fetch reported recipes" });
  }
};

module.exports = {
  loginAdmin,
  getStats,
  getReportedRecipes,
};