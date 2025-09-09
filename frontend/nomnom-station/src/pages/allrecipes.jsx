import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AllRecipes.css";

const API = "http://localhost:5000/recipe";

export default function AllRecipes() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(API, { headers: { "Content-Type": "application/json" }});
        const data = await res.json();
        const items = Array.isArray(data) ? data : [];
       
        setList(
          items.map(r => ({
            ...r,
            coverimage: typeof r.coverimage === "string" ? r.coverimage.replace(/\\/g, "/") : r.coverimage
          }))
        );
      } catch (e) {
        setErr(e?.message || "Failed to load recipes");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="ar">
      <header className="ar-top">
        <h1 className="ar-title">All recipes</h1>
        <Link to="/upload" className="ar-btn ar-btn--primary">Upload a recipe</Link>
      </header>

      {err && <div className="ar-alert">{err}</div>}
      {loading ? (
        <div className="ar-skel-grid">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="ar-card ar-skel" />)}
        </div>
      ) : list.length === 0 ? (
        <p>No recipes yet.</p>
      ) : (
        <section className="ar-grid">
          {list.map(r => (
            <article key={r._id} className="ar-card">
              <Link to={`/fullrecipe/${r._id}`} className="ar-link" aria-label={`Open ${r.name}`}>
                <div className="ar-media">
                  <img
                    src={
                      r.coverimage?.startsWith("/images/")
                        ? r.coverimage
                        : r.coverimage || "https://placehold.co/800x500?text=No+Image"
                    }
                    alt={r.name}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/800x500?text=Image+Unavailable"; }}
                  />
                  <div className="ar-badges">
                    {r.isvegan ? <span className="ar-badge">Vegan</span> : null}
                    {r.ishalal ? <span className="ar-badge ar-badge--alt">Halal</span> : null}
                  </div>
                </div>

                <div className="ar-body">
                  <h3 className="ar-name">{r.name}</h3>
                  <div className="ar-meta">
                    {r.category ? <span className="ar-pill">{r.category}</span> : null}
                    {r.cuisine ? (<><span className="ar-dot">•</span><span className="ar-pill ar-pill--muted">{r.cuisine}</span></>) : null}
                    {r.time ? (<><span className="ar-dot">•</span><span>{r.time}</span></>) : null}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
