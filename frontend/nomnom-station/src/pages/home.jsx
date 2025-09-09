
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import { useNavigate } from "react-router-dom"; // 


export default function Home() {
  const [user, setUser] = useState(null);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [q, setQ] = useState("");//////////////



  useEffect(() => {
 
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u && (u.name || u.username || u.email)) setUser(u);
    } catch (_) {
      
    }
  }, []);

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    axios
      .get('http://localhost:5000/recipes/trending', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTrending(res.data?.recipes || []))
      .catch((e) => {
        const msg =
          e?.response?.data?.error ||
          e?.response?.data?.message ||
          'Failed to load trending recipes';
        setErr(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const username =
    user?.name || user?.username || user?.fullName || user?.email || 'Chef';

  return (
    <main className="page container">
   
      <header className="topbar">
        <p className="welcome">Welcome, {username} </p>
        <Link to="/dashboard" className="logo-link">
  <img 
    src="/images/profile-user.png"   
    alt="Dashboard Logo"
    className="logo"
  />
</Link>
      </header>

      
      <section className="section">
  
  <h2 className="section-title"></h2>
  <div className="search-bar" role="search">
    <input
      type="text"
      className="input search-input"
      placeholder="Search for recipes..."
      aria-label="Search for recipes"
      value={q}
    onChange={(e) => setQ(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && q.trim()) {
        
        e.currentTarget.nextSibling.click();
      }
    }}
    
    />
    <Link to={`/filtered?q=${encodeURIComponent(q)}`} className="logo-link">
    <button type="button" className="btn primary search-btn">
  <img 
    src="/images/search-interface-symbol.png" 
    alt="Search" 
    className="btn-icon"
  />

</button></Link>
  </div>


  <button
        type="button"
        className="browse-btn"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-controls="browseModal"
      >
        Browse recipes
      </button>

      
      <div
        id="browseModal"
        className={`modal-overlay ${isOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="browseModalTitle"
      >
        <div className="modal">
          <h3 id="browseModalTitle">Browse by</h3>

          <div className="filters-grid">
      <label className="filter">
        <span>Category</span>
        <select
          className="input"
          onChange={(e) => {
            if (e.target.value) {
              window.location.href = `/criteria?category=${encodeURIComponent(
                e.target.value
              )}`;
            }
          }}
        >
          <option value="">Select category</option>
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Brunch</option>
          <option>Snacks</option>
        </select>
      </label>

            <label className="filter">
        <span>Cuisine</span>
        <select
          className="input"
          onChange={(e) => {
            if (e.target.value) {
              window.location.href = `/criteria?cuisine=${encodeURIComponent(
                e.target.value
              )}`;
            }
          }}
        >
          <option value="">Select cuisine</option>
          <option>Bangladeshi</option>
          <option>Thai</option>
          <option>Indian</option>
          <option>Mexican</option>
          <option>Italian</option>
          <option>Chinese</option>
          <option>French</option>
          <option>Japanese</option>
          <option>Baking</option>
        </select>
      </label>

            <label className="filter">
        <span>Diet</span>
        <select
          className="input"
          onChange={(e) => {
            if (e.target.value) {
              window.location.href = `/criteria?diet=${encodeURIComponent(
                e.target.value
              )}`;
            }
          }}
        >
          <option value="">Select diet</option>
          <option>Keto diet</option>
          <option>Plant based diet </option>
          <option>Low carb diet</option>
          <option>Low fat diet</option>
        </select>
      </label>


            <label className="filter">
        <span>Region</span>
        <select
          className="input"
          onChange={(e) => {
            if (e.target.value) {
              window.location.href = `/criteria?region=${encodeURIComponent(
                e.target.value
              )}`;
            }
          }}
        >
          <option value="">Select region</option>
          <option>Asia</option>
          <option>Europe</option>
          <option>NorthAmerica</option>
          <option>SouthAmerica</option>
          <option>Africa</option>
          <option>Oceania</option>
          <option>MiddleEast</option>
        </select>
      </label>
          </div>

       
          <button
            type="button"
            className="modal-close"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </section>


    
      <section className="section feature-grid">
        <article className="card feature vegan">
          <h3>Explore the vegan world</h3>
          <p>Discover plant-powered meals, snacks, and desserts.</p>
          <Link to="/criteria?isvegan=true">
    <button className="btn">Browse Vegan</button>
  </Link>
        </article>

        <article className="card feature halal">
          <h3>All things halal</h3>
          <p>Find halal-friendly recipes curated for your kitchen.</p>
          <Link to="/criteria?ishalal=true">
    <button className="btn">Browse Halal</button>
  </Link>
        </article>
      </section>

   
<section className="roam-cta-section">
  <Link to="/allrecipes" className="roam-cta" aria-label="Browse all recipes">
    <div className="roam-cta__bg" />
    <div className="roam-cta__content">
      <h2 className="roam-cta__title">Not thinking of anything specific?</h2>
      <p className="roam-cta__sub">Maybe roam around and take a look.</p>
      
    </div>
  </Link>
</section>

      
<Link to="/upload" className="fab-upload" aria-label="Upload">
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
</Link>

      
    </main>
  );
}
