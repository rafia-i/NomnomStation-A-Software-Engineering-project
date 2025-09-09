import React, { useEffect, useState } from "react";
import { Link, Link as RouterLink } from "react-router-dom";
import "./adminhome.css";

const STATS_URL = "http://localhost:5000/admin/stats";
const REPORTED_URL = "http://localhost:5000/admin/report";

export default function AdminHome() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [stats, setStats] = useState({ usersCount: 0, recipesCount: 0 });


  const loadStats = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(STATS_URL);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setErr(data.error || `Request failed (${res.status})`);
      } else {
        setStats({ usersCount: data.usersCount, recipesCount: data.recipesCount });
      }
    } catch (e) {
      console.error(e);
      setErr("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(); }, []);

  return (
    <main className="ah">
      <header className="ah-topbar">
        <h1 className="ah-title">Welcome, Admin</h1>
        <div className="ah-actions">
          <button className="ah-btn ah-btn--primary" onClick={loadStats} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <Link className="ah-btn ah-btn--muted" to="/">Logout</Link>
        </div>
      </header>

      {err && <div className="ah-alert" role="alert">{err}</div>}

      <section className="ah-grid">
        <article className="ah-card">
          <div className="ah-label">Registered Users</div>
          <div className="ah-value">
            {loading ? <span className="ah-skel" /> : stats.usersCount}
          </div>
        </article>

        <article className="ah-card">
          <div className="ah-label">Uploaded Recipes</div>
          <div className="ah-value">
            {loading ? <span className="ah-skel" /> : stats.recipesCount}
          </div>
        </article>

      
        <ReportedRecipesCard />
      </section>
    </main>
  );
}


function ReportedRecipesCard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState("");

  const loadReports = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await fetch(REPORTED_URL);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
      setErr("Failed to load reported recipes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReports(); }, []);

  const keepReport = async (id) => {
    try {
      setBusyId(id);
      await fetch(`http://localhost:5000/report/${id}`, { method: "DELETE" });
      setItems(prev => prev.filter(x => x.recipeid !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to clear report.");
    } finally {
      setBusyId("");
    }
  };

  const removeRecipe = async (id) => {
    if (!window.confirm("Remove this recipe from server? This cannot be undone.")) return;
    try {
      setBusyId(id);
      const del = await fetch(`http://localhost:5000/recipe/${id}`, { method: "DELETE" });
      if (!del.ok) throw new Error("Delete failed");
      await fetch(`http://localhost:5000/report/${id}`, { method: "DELETE" });
      setItems(prev => prev.filter(x => x._id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to remove recipe.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <article className="ah-card ah-card--full">
      <div className="ah-card-head">
        <h3>Reported Recipes</h3>
        <button className="ah-btn ah-btn--muted" onClick={loadReports} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {err && <div className="ah-alert" role="alert">{err}</div>}

      {loading ? (
        <div className="rr-empty">Loading…</div>
      ) : items.length === 0 ? (
        <div className="rr-empty">No reported recipes.</div>
      ) : (
        <div className="rr-table-wrap">
  <table className="rr-table">
    <thead>
      <tr>
        <th>Recipe ID</th>
        <th>Count</th>
        <th className="rr-actions-col">Actions</th>
      </tr>
    </thead>
    <tbody>
      {items.map((row) => (
        <tr key={row.recipeid}>
          <td className="rr-mono">{row.recipeid}</td>
          <td><span className="rr-pill">{row.count ?? 0}</span></td>
          <td className="rr-actions">
            <button
              className="ah-btn ah-btn--ghost ah-btn--sm"
              onClick={() => keepReport(row.recipeid)}
              disabled={busyId === row.recipeid}
            >
              {busyId === row.recipeid ? "Keeping…" : "Keep"}
            </button>
            <button
              className="ah-btn ah-btn--danger ah-btn--sm"
              onClick={() => removeRecipe(row.recipeid)}
              disabled={busyId === row.recipeid}
            >
              {busyId === row.recipeid ? "Removing…" : "Remove"}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

           
      )}
    </article>
  );
}
