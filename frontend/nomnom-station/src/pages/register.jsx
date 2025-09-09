
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    height: '',
    weight: '',
    type: 'homecook',   
    workedat: '',
    yearsofexp: '',
    phone: ''
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Enter a valid email.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirm) return "Passwords don't match.";

    const h = Number(form.height);
    const w = Number(form.weight);
    if (!h || h < 50 || h > 300) return 'Enter a valid height in cm (50–300).';
    if (!w || w < 10 || w > 400) return 'Enter a valid weight in kg (10–400).';

    if (!/^\d{6,15}$/.test(String(form.phone || '').trim()))
      return 'Enter a valid phone number (digits only).';

    if (form.type === 'professional') {
      if (!form.workedat.trim()) return 'Please enter where you worked.';
      const y = Number(form.yearsofexp);
      if (!Number.isFinite(y)) return 'Enter years of experience.';
      if (y < 0 || y > 60) return 'Years of experience should be between 0 and 60.';
    }
    return '';
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setErr('');
    setLoading(true);

    const endpoint = 'signUp'; 

    
    const payload = {
      username: form.name.trim(),
      useremail: form.email.trim().toLowerCase(),
      userpassword: form.password,
      height: Number(form.height),
      weight: Number(form.weight),
      type: form.type, 
      userphonenumber: Number(form.phone),
      ...(form.type === 'professional'
        ? { workedat: form.workedat.trim(), yearsofexp: String(form.yearsofexp).trim() }
        : {})
    };

    axios
    
      .post(`http://localhost:5000/${endpoint}`, payload)
      .then((res) => {
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/queries');
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err.message ||
          'Registration failed.';
        setErr(msg);
      })
      .finally(() => setLoading(false));
  };

  return (
    <main className="auth">
      <form className="auth-card" onSubmit={onSubmit} noValidate>
        <h2>Create your account</h2>
        <p className="auth-sub">Join Nomnom Station — your everyday cookbook.</p>

        {err && <div className="auth-error">{err}</div>}

        <label className="field">
          <span>Name</span>
          <input
            className="input"
            name="name"
            type="text"
            placeholder="Jane Doe"
            value={form.name}
            onChange={onChange}
            required
          />
        </label>

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
            >
              {showPwd ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        <label className="field">
          <span>Confirm password</span>
          <input
            className="input"
            name="confirm"
            type={showPwd ? 'text' : 'password'}
            placeholder="••••••••"
            value={form.confirm}
            onChange={onChange}
            required
            minLength={8}
          />
        </label>

        <div className="grid-2">
          <label className="field">
            <span>Height (cm)</span>
            <input
              className="input"
              name="height"
              type="number"
              min="50"
              max="300"
              placeholder="e.g. 170"
              value={form.height}
              onChange={onChange}
              required
            />
          </label>
          <label className="field">
            <span>Weight (kg)</span>
            <input
              className="input"
              name="weight"
              type="number"
              min="10"
              max="400"
              placeholder="e.g. 60"
              value={form.weight}
              onChange={onChange}
              required
            />
          </label>
        </div>

        <label className="field">
          <span>Account type</span>
          <div className="radio-row">
            <label>
              <input
                type="radio"
                name="type"
                value="homecook"
                checked={form.type === 'homecook'}
                onChange={onChange}
              />{' '}
              Home cook
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="professional"
                checked={form.type === 'professional'}
                onChange={onChange}
              />{' '}
              Professional chef
            </label>
          </div>
        </label>

        {form.type === 'professional' && (
          <div className="grid-2">
            <label className="field">
              <span>Worked at</span>
              <input
                className="input"
                name="workedat"
                type="text"
                placeholder="Restaurant / Hotel"
                value={form.workedat}
                onChange={onChange}
              />
            </label>
            <label className="field">
              <span>Years of experience</span>
              <input
                className="input"
                name="yearsofexp"
                type="number"
                min="0"
                max="60"
                placeholder="e.g. 3"
                value={form.yearsofexp}
                onChange={onChange}
              />
            </label>
          </div>
        )}

        <label className="field">
          <span>Phone number</span>
          <input
            className="input"
            name="phone"
            type="tel"
            inputMode="numeric"
            pattern="\d{6,15}"
            placeholder="e.g. 017XXXXXXXX"
            value={form.phone}
            onChange={onChange}
            required
          />
          <small className="hint">Digits only, 6–15 characters.</small>
        </label>

        <button className="btn primary auth-submit" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </form>
    </main>
  );
}
