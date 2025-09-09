
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Enter a valid email.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    return '';
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setErr('');
    setLoading(true);

   
    axios
      .post('http://localhost:5000/login', {
        useremail: form.email.trim().toLowerCase(),
        userpassword: form.password
      })
      .then((res) => {
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem("userId", res.data.userId); 
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/home');
      })
      .catch((error) => {
        const msg =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          'Invalid credentials';
        setErr(msg);
      })
      .finally(() => setLoading(false));
  };

  return (
    <main className="auth">
      <form className="auth-card" onSubmit={onSubmit} noValidate>
        <h2>Log in</h2>
        <p className="auth-sub">Welcome back to Nomnom Station.</p>

        {err && <div className="auth-error">{err}</div>}

        <label className="field">
          <span>Email</span>
          <input
            className="input"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange}
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <div className="pwd-wrap">
            <input
              className="input"
              name="password"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              required
              minLength={8}
            />
            <button
              type="button"
              className="pwd-toggle"
              onClick={() => setShowPwd((s) => !s)}
              aria-label={showPwd ? 'Hide password' : 'Show password'}
            >
              {showPwd ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        <button className="btn primary auth-submit" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Log in'}
        </button>

        <div className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </div>
      </form>
    </main>
  );
}
