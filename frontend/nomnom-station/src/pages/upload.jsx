
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Upload.css';

export default function Upload() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    //recipeID: '',
    name: '',
    category: '',        
    cuisine: '',
    isvegan: false,
    ishalal: false,
    diet: '',
    ingredients: '',     
    region: '',
    instructions: '',
    time: '',
    coverimage: ''  ,     
    username:'',
    user_id:''
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [user, setUser] = useState(null);

 

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const toArray = (s) =>
    (s || '')
      .split(/[\n,]/)
      .map((t) => t.trim())
      .filter(Boolean);

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.cuisine.trim()) return 'Cuisine is required.';
    if (!form.instructions.trim()) return 'Instructions are required.';
    if (toArray(form.category).length === 0) return 'At least one category is required.';
    if (toArray(form.ingredients).length === 0) return 'At least one ingredient is required.';
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setErr('');
    setLoading(true);
    
    ///
    try {
   
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    if (!u?._id) {
      throw new Error('You must be logged in to publish a recipe.');
    }

  
      const displayname =
        u.username || u.name || (u.useremail ? u.useremail.split('@')[0] : '');
      const uploadid= u.userID;

  
    const payload = {
     // recipeID: form.recipeID ? Number(form.recipeID) : undefined,
      name: form.name.trim(),
      category: form.category.trim(),
      cuisine: form.cuisine.trim(),
      isvegan: !!form.isvegan,
      ishalal: !!form.ishalal,
      diet: form.diet.trim() || undefined,
      ingredients: toArray(form.ingredients),
      region: form.region.trim() || undefined,
      instructions: form.instructions.trim(),
      time: form.time.trim() || undefined,
      coverimage: form.coverimage.trim() || undefined,
      username:displayname,
      user_id:uploadid,

    };

    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/recipe', payload, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
      
      navigate('/myrecipe');
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to create recipe';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="upload">
      <form className="upload-card" onSubmit={onSubmit} noValidate>
        <h2>Upload a recipe!</h2>
        <p className="upload-sub">Let the world know about your masterpieces.</p>

        {err && <div className="upload-error">{err}</div>}

        <div className="grid-2">
           {/*
          <label className="field">
            <span>Recipe ID (optional)</span>
            <input
              className="input"
              name="recipeID"
              type="number"
              placeholder="e.g., 1001"
              value={form.recipeID}
              onChange={onChange}
            />
          </label>*/}

          <label className="field">
            <span>Name *</span>
            <input
              className="input"
              name="name"
              type="text"
              placeholder="e.g., Spicy Thai Noodles"
              value={form.name}
              onChange={onChange}
              required
            />
          </label>
        </div>

        <div className="grid-2">
          <label className="field">
  <span>Category *</span>
  <select
    className="input"
    name="category"
    value={form.category}
    onChange={onChange}
    required
  >
    <option value="">Select category</option>
    <option value="Breakfast">Breakfast</option>
    <option value="Brunch">Brunch</option>
    <option value="Lunch/Dinner">Lunch/Dinner</option>
    <option value="Snacks">Snacks</option>
  </select>
</label>


          <label className="field">
  <span>Cuisine *</span>
  <select
    className="input"
    name="cuisine"
    value={form.cuisine}
    onChange={onChange}
    required
  >
    <option value="">Select cuisine</option>
    <option value="Bangladeshi">Bangladeshi</option>
    <option value="Italian">Italian</option>
    <option value="Chinese">Chinese</option>
    <option value="Thai">Thai</option>
    <option value="Indian">Indian</option>
    <option value="French">French</option>
    <option value="Japanese">Japanese</option>
    <option value="Mexican">Mexican</option>
    <option value="Mexican">Baking</option>
  </select>
</label>

        </div>

        <div className="grid-2">
          <label className="field">
  <span>Diet</span>
  <select
    className="input"
    name="diet"
    value={form.diet}
    onChange={onChange}
  >
    <option value="">Select diet</option>
    <option value="Keto diet">Keto diet</option>
    <option value="Plant based diet">Plant based diet</option>
    <option value="Low carb diet">Low carb diet</option>
    <option value="Low fat diet">Low fat diet</option>
  </select>
</label>

          <label className="field">
  <span>Region</span>
  <select
    className="input"
    name="region"
    value={form.region}
    onChange={onChange}
  >
    <option value="">Select region</option>
    <option value="Asia">Asia</option>
    <option value="Europe">Europe</option>
    <option value="North America">North America</option>
    <option value="South America">South America</option>
    <option value="Africa">Africa</option>
    <option value="Oceania">Oceania</option>
    <option value="Middle East">Middle East</option>
  </select>
</label>

        </div>

        <label className="field">
          <span>Ingredients * <em>(comma or new line)</em></span>
          <textarea
            className="input"
            name="ingredients"
            rows={4}
            placeholder={`Rice noodles, Soy sauce, Chili flakes`}
            value={form.ingredients}
            onChange={onChange}
            required
          />
        </label>

        <label className="field">
          <span>Instructions *</span>
          <textarea
            className="input"
            name="instructions"
            rows={6}
            placeholder="Write clear, step-by-step instructions…"
            value={form.instructions}
            onChange={onChange}
            required
          />
        </label>

        <div className="grid-3">
          <label className="checkbox-row">
            <input
              type="checkbox"
              name="isvegan"
              checked={form.isvegan}
              onChange={onChange}
            />
            <span>Vegan</span>
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="ishalal"
              checked={form.ishalal}
              onChange={onChange}
            />
            <span>Halal</span>
          </label>

          <label className="field">
            <span>Time</span>
            <input
              className="input"
              name="time"
              type="text"
              placeholder="e.g., 30 min"
              value={form.time}
              onChange={onChange}
            />
          </label>
        </div>

        <div className="grid-2">
          <label className="field">
            <span>Cover image URL</span>
            <input
              className="input"
              name="coverimage"
              type="url"
              placeholder="https://…"
              value={form.coverimage}
              onChange={onChange}
            />
          </label>

          {form.coverimage && (
            <div className="preview">
              <img src={form.coverimage} alt="Cover preview" />
            </div>
          )}
        </div>

        <div className="upload-actions">
          <Link to="/home" className="btn secondary">Cancel</Link>
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Publishing…' : 'Publish recipe'}
          </button>
        </div>
      </form>
    </main>
  );
}
