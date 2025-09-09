import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import "./Filtered.css";

const API_URL = "http://localhost:5000/recipe";

export default function CriteriaBased() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [sp] = useSearchParams();
  const category = sp.get("category") || "";
  const cuisine  = sp.get("cuisine")  || "";
  const diet     = sp.get("diet")     || "";
  const region   = sp.get("region")   || "";


  const isvegan  = sp.get("isvegan");
  const ishalal  = sp.get("ishalal");
  const wantVegan = typeof isvegan === "string" && isvegan.toLowerCase() === "true";
  const wantHalal = typeof ishalal === "string" && ishalal.toLowerCase() === "true";

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setErr("");

        const token = localStorage.getItem("token");

        
        const params = {};
        if (category) params.category = category;
        if (cuisine)  params.cuisine  = cuisine;
        if (diet)     params.diet     = diet;
        if (region)   params.region   = region;
        if (wantVegan) params.isvegan = true;
        if (wantHalal) params.ishalal = true;

        let data = [];
        try {
          const res = await axios.get(API_URL, {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            params, 
          });
          const payload = res?.data;
          data =
            (Array.isArray(payload) && payload) ||
            (Array.isArray(payload?.recipes) && payload.recipes) ||
            (Array.isArray(payload?.data) && payload.data) ||
            [];
        } catch {
         
          const resAll = await axios.get(API_URL, {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          data = Array.isArray(resAll.data) ? resAll.data : [];
        }

        setRecipes(data);
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
  }, [category, cuisine, diet, region, wantVegan, wantHalal]);

  const filtered = useMemo(() => {
    const norm = (s) => (s || "").toString().toLowerCase().trim();
    const ac = {
      category: norm(category),
      cuisine:  norm(cuisine),
      diet:     norm(diet),
      region:   norm(region),
      isvegan:  wantVegan,
      ishalal:  wantHalal,
    };

    
    if (!ac.category && !ac.cuisine && !ac.diet && !ac.region && !ac.isvegan && !ac.ishalal) {
      return [];
    }

    return recipes.filter((r) => {
      const rc = {
        category: norm(r.category),
        cuisine:  norm(r.cuisine),
        diet:     norm(r.diet),
        region:   norm(r.region),
        isvegan:  !!r.isvegan,
        ishalal:  !!r.ishalal,
      };
      return (
        (!ac.category || rc.category === ac.category) &&
        (!ac.cuisine  || rc.cuisine  === ac.cuisine)  &&
        (!ac.diet     || rc.diet     === ac.diet)     &&
        (!ac.region   || rc.region   === ac.region)   &&
        (!ac.isvegan  || rc.isvegan === true)         &&
        (!ac.ishalal  || rc.ishalal === true)
      );
    });
  }, [recipes, category, cuisine, diet, region, wantVegan, wantHalal]);

  const titleParts = [];
  if (category) titleParts.push(`category: ${category}`);
  if (cuisine)  titleParts.push(`cuisine: ${cuisine}`);
  if (diet)     titleParts.push(`diet: ${diet}`);
  if (region)   titleParts.push(`region: ${region}`);
  if (wantVegan) titleParts.push("vegan");
  if (wantHalal) titleParts.push("halal");
  const title = titleParts.join(" · ");

  return (
    <main className="filtered-page">
      <h2 style={{ color: '#204940ff' }}>{title ? `Results — ${title}` : "Choose a filter from Home"}</h2>

      {err && <div className="alert error">{err}</div>}

      {loading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p>No recipes match your criteria.</p>
      ) : (
        <section className="grid">
          {filtered.map((r) => (
            <article key={r._id || r.id} className="card recipe">
              <Link
                to={`/fullrecipe/${r._id || r.id}`}
                className="card-link"
                aria-label={`Open ${r.name}`}
                state={{ recipe: r }}
              >
                <div className="thumb">
                  <img
                    src={r.coverimage || "/images/placeholder-400x250.png"}
                    alt={r.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/images/placeholder-400x250.png";
                    }}
                  />
                </div>
                <div className="card-body">
                  <h3 className="card-title">{r.name}</h3>
                  <p className="card-sub">
                    {[r.cuisine, r.category].filter(Boolean).join(" · ")}
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
