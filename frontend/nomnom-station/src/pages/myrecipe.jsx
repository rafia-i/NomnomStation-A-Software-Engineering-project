import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./MyRecipe.css";

const BASE = "http://localhost:5000";

export default function MyRecipe() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);


  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setErr("");

      
      const u = JSON.parse(localStorage.getItem("user") || "null");
      if (!u?.userID) {
        setErr("You must be logged in to view your recipes.");
        setRecipes([]);
        return;
      }
      const userUUID = u.userID;

    
      const url = `${BASE}/recipe/mine?userUUID=${encodeURIComponent(userUUID)}`;

      const token = localStorage.getItem("token");
      let data;

      try {
        const res = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        data = res.data;
      } catch {
        
        const resAll = await axios.get(`${BASE}/recipe`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        data = resAll.data;
      }

      
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.recipes)
        ? data.recipes
        : [];

      
      const mine = list.filter(
        (r) =>
          r?.user_id === userUUID ||
          r?.createdByUserID === userUUID //
      );

      
      const normalized = mine.map((r) => ({
        ...r,
        coverimage:
          typeof r.coverimage === "string"
            ? r.coverimage.replace(/\\/g, "/")
            : r.coverimage,
      }));

      setRecipes(normalized);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to load recipes";
      setErr(msg);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return recipes;
    return recipes.filter((r) => {
      const name = r?.name?.toLowerCase() || "";
      const category = r?.category?.toLowerCase() || "";
      const cuisine = r?.cuisine?.toLowerCase() || "";
      return name.includes(t) || category.includes(t) || cuisine.includes(t);
    });
  }, [q, recipes]);
  
  const askDelete = (id) => {
    setToDeleteId(id);
    setConfirmOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!toDeleteId) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE}/recipe/${toDeleteId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
     
      setRecipes((prev) => prev.filter((r) => r._id !== toDeleteId));
      setConfirmOpen(false);
      setToDeleteId(null);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Failed to delete recipe";
      setErr(msg);
    } finally {
      setDeleting(false);
    }
  };
  

  return (
    <main className="myrecipes">
      <header className="myrecipes-header">
        <h2>My Recipes</h2>

        <div className="header-actions">
          
          <Link to="/upload" className="btn primary">
            upload a new recipe
          </Link>
        </div>
      </header>

      {err && <div className="alert error">{err}</div>}

      {loading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <p>No recipes yet.</p>
          <Link to="/upload" className="btn">
            Create your first recipe
          </Link>
        </div>
      ) : (
        <section className="grid">
  {filtered.map((r) => (
    <article key={r._id} className="card">
   
  <button
    type="button"
    className="card-del"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();          
      askDelete(r._id);
    }}
    aria-label={`Delete ${r.name}`}
    title="Delete recipe"
  >
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M3 6h18M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0l1 14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-14"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  </button>
      <Link to={`/fullrecipe/${r._id}`} className="card-link" aria-label={`Open ${r.name}`}>
        <div className="media">
          <img
            src={
              r.coverimage?.startsWith("/images/")
                ? r.coverimage
                : r.coverimage || "https://placehold.co/800x500?text=No+Image"
            }
            alt={r.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/800x500?text=Image+Unavailable";
            }}
          />
          <div className="badges">
            {r.isvegan ? <span className="badge">Vegan</span> : null}
            {r.ishalal ? <span className="badge alt">Halal</span> : null}
          </div>
        </div>

        <div className="content">
          <h3 className="title">{r.name}</h3>

          <div className="meta">
            {r.category ? <span className="pill">{r.category}</span> : null}
            {r.cuisine ? (
              <>
                <span className="dot">•</span>
                <span className="pill neutral">{r.cuisine}</span>
              </>
            ) : null}
            {r.time ? (
              <>
                <span className="dot">•</span>
                <span>{r.time}</span>
              </>
            ) : null}
          </div>

          <div className="ingredients">
            {(r.ingredients || []).slice(0, 6).map((ing, i) => (
              <span key={i} className="chip">{ing}</span>
            ))}
            {(r.ingredients?.length || 0) > 6 ? (
              <span className="chip more">
                +{r.ingredients.length - 6} more
              </span>
            ) : null}
          </div>

          <p className="instructions">
            {r.instructions?.slice(0, 140)}
            {r.instructions && r.instructions.length > 140 ? "…" : ""}
          </p>
        </div>
      </Link>
    </article>
  ))}
</section>
    )}

     
      {confirmOpen && (
        <div
          className="mr-modal-backdrop"
          onClick={() => (!deleting ? setConfirmOpen(false) : null)}
        >
          <div
            className="mr-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delTitle"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="delTitle">Delete recipe</h3>
            <p>Are you sure you want to delete this recipe?</p>
            <div className="mr-actions">
              <button
                type="button"
                className="btn"
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
              >
                No
              </button>
              <button
                type="button"
                className="btn danger"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
