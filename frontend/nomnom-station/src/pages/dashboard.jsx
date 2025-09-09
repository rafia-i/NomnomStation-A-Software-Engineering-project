import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    username: "",
    useremail: "",
    userphonenumber: "",
    height: "",
    weight: "",
    type: "",
    workedat: "",
    yearsofexp: "",
    allergens: "",
    diseases: "",
    userpassword: "" 
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      if (u && (u.username || u.useremail)) {
        setUser(u);
       
        setForm({
          username: u.username || "",
          useremail: u.useremail || "",
          userphonenumber: u.userphonenumber || "",
          height: u.height ?? "",
          weight: u.weight ?? "",
          type: u.type || "",
          workedat: u.workedat || "",
          yearsofexp: u.yearsofexp || "",
          allergens: Array.isArray(u.allergens) ? u.allergens.join(", ") : "",
          diseases: Array.isArray(u.diseases) ? u.diseases.join(", ") : "",
          userpassword: ""
        });
      }
    } catch {}
  }, []);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSave = async () => {
    if (!user?._id) {
      setErr("Missing user id.");
      return;
    }
    setErr("");
    setMsg("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        
        height: form.height === "" ? "" : Number(form.height),
        weight: form.weight === "" ? "" : Number(form.weight),
      };

      const res = await fetch(`http://localhost:5000/user/${user._id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setErr(data.error || `Update failed (${res.status})`);
        return;
      }

      
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMsg("Profile updated.");
      setEdit(false);
    } catch (e) {
      console.error(e);
      setErr("Network error. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const username =
    user?.username || user?.name || user?.useremail || "Chef";

  return (
    <main className="ud"> 
      <header className="ud-top">
        <div>
          <h2 className="ud-title">Welcome, {username}</h2>
          <p className="ud-sub">Quick access to your profile.</p>
        </div>
        <Link to="/home" className="ud-btn ud-btn--muted">Back to home</Link>
      </header>

      {err && <div className="ud-alert" role="alert">{err}</div>}
      {msg && <div className="ud-ok" role="status">{msg}</div>}

     
      <section className="ud-grid">
        
        <article className="ud-card">
          <h3 className="ud-card-title">Personal info:</h3>

          {!edit ? (
            <dl className="ud-dl">
              <div><dt>Username</dt><dd>{user?.username || "-"}</dd></div>
              <div><dt>Email</dt><dd>{user?.useremail || "-"}</dd></div>
              <div><dt>Phone</dt><dd>{user?.userphonenumber || "-"}</dd></div>
              <div><dt>Type</dt><dd>{user?.type || "-"}</dd></div>
              {user?.type === "professional" && (
                <>
                  <div><dt>Worked at</dt><dd>{user?.workedat || "-"}</dd></div>
                  <div><dt>Years of exp</dt><dd>{user?.yearsofexp || "-"}</dd></div>
                </>
              )}
            </dl>
          ) : (
            <div className="ud-form">
              <label>
                <span>Username</span>
                <input name="username" value={form.username} onChange={onChange}/>
              </label>
              <label>
                <span>Email</span>
                <input name="useremail" value={form.useremail} onChange={onChange}/>
              </label>
              <label>
                <span>Phone</span>
                <input name="userphonenumber" value={form.userphonenumber} onChange={onChange}/>
              </label>
              <label>
                <span>Type</span>
                <select name="type" value={form.type} onChange={onChange}>
                  <option value="">Select…</option>
                  <option value="homecook">homecook</option>
                  <option value="professional">professional</option>
                </select>
              </label>
              {form.type === "professional" && (
                <>
                  <label>
                    <span>Worked at</span>
                    <input name="workedat" value={form.workedat} onChange={onChange}/>
                  </label>
                  <label>
                    <span>Years of exp</span>
                    <input name="yearsofexp" value={form.yearsofexp} onChange={onChange}/>
                  </label>
                </>
              )}
              <label>
                <span>Change password (optional)</span>
                <input type="password" name="userpassword" value={form.userpassword} onChange={onChange} placeholder="Leave blank to keep current"/>
              </label>
            </div>
          )}
        </article>

        
        <article className="ud-card">
          <h3 className="ud-card-title">Health</h3>

          {!edit ? (
            <dl className="ud-dl">
              <div><dt>Height (cm)</dt><dd>{user?.height ?? "-"}</dd></div>
              <div><dt>Weight (kg)</dt><dd>{user?.weight ?? "-"}</dd></div>
              <div><dt>Allergens</dt><dd>{Array.isArray(user?.allergens) && user.allergens.length ? user.allergens.join(", ") : "-"}</dd></div>
              <div><dt>Diseases</dt><dd>{Array.isArray(user?.diseases) && user.diseases.length ? user.diseases.join(", ") : "-"}</dd></div>
              
            </dl>
          ) : (
            <div className="ud-form">
              <label>
                <span>Height (cm)</span>
                <input name="height" value={form.height} onChange={onChange}/>
              </label>
              <label>
                <span>Weight (kg)</span>
                <input name="weight" value={form.weight} onChange={onChange}/>
              </label>
              <label>
                <span>Allergens (comma separated)</span>
                <input name="allergens" value={form.allergens} onChange={onChange}/>
              </label>
              <label>
                <span>Diseases (comma separated)</span>
                <input name="diseases" value={form.diseases} onChange={onChange}/>
              </label>
            </div>
          )}
        </article>
      </section>

      {/* Actions 
      <div className="ud-actions">
        {!edit ? (
          <button className="ud-btn ud-btn--primary" onClick={() => setEdit(true)}>
            Edit your info
          </button>
        ) : (
          <div className="ud-action-row">
            <button className="ud-btn ud-btn--muted" onClick={() => { setEdit(false); setMsg(""); setErr(""); }}>
              Cancel
            </button>
            <button className="ud-btn ud-btn--primary" onClick={onSave} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}
      </div> */}
    
      {/* FAB bottom-right: View my recipes */}
      <Link
  to={`/myrecipe?author=${encodeURIComponent(username)}`}
  className="ud-fab"
  aria-label="View my recipes"
>
  View my recipes
</Link>
    </main>
  );
}
