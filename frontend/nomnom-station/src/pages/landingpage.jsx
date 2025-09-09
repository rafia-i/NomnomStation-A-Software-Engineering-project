import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './adminlandingpage.css' 

export default function landingpage() {
  const navigate = useNavigate();
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleAdminSubmit = async (e) => {
  e.preventDefault();
  setAdminError("");
  console.log('[admin] submit fired'); 
  try {
    const res = await fetch("http://localhost:5000/admin/login", {   
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminid: adminId, password: adminPass }),
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      setAdminError("Incorrect credentials!");
      return;
    }

    setAdminOpen(false);
    navigate("/adminhome"); 
  } catch (err) {
    console.error(err);
    setAdminError("Server error. Please try again.");
  }
};

  return (
    <main className="hero">
      
      <div className="hero-box">
        <div className="brand">
         
          <div className="brand-badge">
          <img src="public/images/4287725.png"
             alt="Nomnom Station logo" className="brand-logo" />
           </div>
          <h1 className="brand-title">Nomnom Station</h1>
          <p className="brand-tagline">your everyday cookbook</p>
        </div>

        <div className="hero-actions">
          <button className="btn primary" onClick={() => navigate('/login')}>Login</button>
          <button className="btn secondary" onClick={() => navigate('/register')}>Sign up</button>
        </div>
      </div>


    
<button
  className="admin-fab"
  aria-label="Login as admin"
  onClick={() => setAdminOpen(true)}
>
  Login as admin
</button>


{adminOpen && (
  <div className="admin-modal-backdrop" onClick={() => setAdminOpen(false)}>
    <div
      className="admin-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="adminModalTitle"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 id="adminModalTitle" className="admin-modal-title">
        Admin Login
      </h3>
      {adminError && (
  <p
    className="admin-error"
    role="alert"
    aria-live="assertive"
    style={{ color: 'crimson', fontWeight: 700, marginTop: 0, marginBottom: 8 }}
  >
    {adminError}
  </p>
)}

      <form onSubmit={handleAdminSubmit} className="admin-modal-form">
        <label className="admin-field">
          <span>Admin ID</span>
          <input
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            placeholder="e.g., 1001"
            autoFocus
            required
          />
        </label>

        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <div className="admin-actions">
          <button
            type="button"
            className="btn tertiary"
            onClick={() => setAdminOpen(false)}
          >
            Cancel
          </button>
          <button type="submit" className="btn primary">
            Enter
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </main>
  );
}

