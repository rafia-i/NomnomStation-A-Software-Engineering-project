import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./FullRecipe.css";

const API_URL = "http://localhost:5000/recipe";

export default function FullRecipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [user, setUser] = useState(null);

  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  useEffect(() => {
    
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u && (u.name || u.username || u.email)) setUser(u);
    } catch (_) {
      
    }
  }, []);
  useEffect(() => {
    
    const fetchOne = async () => {
      try {
        setLoading(true);
        setErr("");
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/${id}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        setRecipe(res.data);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load recipe";
        setErr(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [id]);

  if (loading) return <main className="fullrecipe"><p>Loading…</p></main>;
  if (err) return <main className="fullrecipe"><div className="alert error">{err}</div></main>;
  if (!recipe) return <main className="fullrecipe"><p>Recipe not found.</p></main>;

  const cover =
    recipe.coverimage ||
    "/images/placeholder-800x500.png";

  const handleReport = async () => {
  try {
    await axios.post("http://localhost:5000/report", {
      recipeid: recipe.recipeID   
    });
    setShowReport(true);
  } catch (err) {
    console.error("Report failed:", err);
    alert("Could not submit report");
  }
};
  const username =
    user?.name || user?.username || user?.fullName || user?.email || 'Chef';

  return (
    <main className="fullrecipe">
     
      <div className="hero-wrap">
        <img
          className="hero-img"
          src={cover}
          alt={recipe.name}
          onError={(e) => { e.currentTarget.src = "/images/placeholder-800x500.png"; }}
          loading="eager"
        />
        {recipe.time ? <span className="time-badge">{recipe.time}</span> : null}
      </div>

    
      <header className="title-block">
        <h1 className="recipe-title">{recipe.name}</h1>
      </header>
       <div className="author-row">
          <img
            className="author-avatar"
            src="/images/profile-user.png"     
            alt=""
            onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
          />
          <span className="author-name">{recipe.username || "Chef"}</span>
        </div>

    
      <div className="recipe-grid">
        
        <div className="main-col">
          <section className="section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {(recipe.ingredients || []).map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </section>

          <section className="section">
            <h2>Instructions</h2>
            <p className="instructions-text">{recipe.instructions}</p>
          </section>
        </div>

       
        <aside className="side-col">
          <div className="card diet-card">
            <h3>Diet Info</h3>
            <div className="pills">
              {recipe.isvegan ? (
                <span className="pill green">🌱 Vegan</span>
              ) : (
                <span className="pill">Not mentioned vegan</span>
              )}
              {recipe.ishalal ? (
                <span className="pill green">✅ Halal</span>
              ) : (
                <span className="pill">Not mentioned halal</span>
              )}
            </div>
          </div>

         </aside>

{recipe.username !== username && (
  <button
    onClick={handleReport}
    disabled={showReport}
    style={{
      backgroundColor: showReport ? "#4CAF50" : "#f44336",
      color: "#fff",
      border: "none",
      padding: "10px 16px",
      borderRadius: "6px",
      cursor: showReport ? "default" : "pointer",
      fontWeight: "bold",
      marginTop: "16px"
    }}
  >
    {showReport ? "Reported ✓" : "Report"}
  </button>
)}
      </div>
    </main>
  );
}
