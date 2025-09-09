
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "./Filtered.css";

const API_URL = "http://localhost:5000/recipe";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Filtered() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const rawQ = useQuery().get("q") || "";
  const q = rawQ.trim().toLowerCase();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setErr("");

        const token = localStorage.getItem("token");
        const res = await axios.get(API_URL, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        
        const payload = res?.data;
        const list =
          (Array.isArray(payload) && payload) ||
          (Array.isArray(payload?.recipes) && payload.recipes) ||
          (Array.isArray(payload?.data) && payload.data) ||
          [];

        setRecipes(list);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load recipes";
        setErr(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
    
  }, [q]);

 
  const getName = (r) =>
    (r?.name || r?.title || r?.recipeName || "").toString();

  const filtered = useMemo(() => {
    if (!q) return [];
    return recipes.filter((r) => getName(r).toLowerCase().includes(q));
  }, [q, recipes]);

  return (
  <main className="filtered-page">
    <h2 style={{ color: '#265e4fff' }}>
      {q ? <>Results for “{rawQ}”</> : <>Please enter a search term</>}
    </h2>

    {err && <div className="alert error">{err}</div>}

    {loading ? (
      <div className="skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card skeleton" />
        ))}
      </div>
    ) : err ? (
      null
    ) : !q ? (
      <p>Use the search on the homepage to find recipes by name.</p>
    ) : filtered.length === 0 ? (
      <p>No matching recipes.</p>
    ) : (
      <section className="grid">
        {filtered.map((r) => (
          <article key={r._id || getName(r)} className="card recipe">
            <Link to={`/fullrecipe/${r._id}`} className="card-link" aria-label={`Open ${getName(r)}`}>
              <div className="thumb">
                <img
                  src={r.coverimage || "/images/placeholder-400x250.png"}
                  alt={getName(r)}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/images/placeholder-400x250.png";
                  }}
                />
              </div>
              <div className="card-body">
                <h3 className="card-title">{getName(r)}</h3>
                
                <p className="card-sub">
                  {(r.cuisine || r.category || "").toString()}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </section>
    )}
  </main>
);
}
