import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Queries() {
  const navigate = useNavigate();

  const allergyOptions = useMemo(() => ([
    'cheese','crab','duck','hilsha','milk','peanut','pumpkin',
    'red lentil','shrimp','soybean','squid','wheat'
  ].sort((a,b)=>a.localeCompare(b))), []);

  const diseasesOptions = useMemo(() => (
    ['brain','diabetes','digestive disorders','heart','kidney','lung']
      .sort((a,b)=>a.localeCompare(b))
  ), []);

  const [allergies, setAllergies] = useState([]);
  const [diseases, setDiseases]   = useState([]);
  const [skipA, setSkipA]         = useState(false);
  const [skipD, setSkipD]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  const toggleAllergy  = (opt) => setAllergies(p => p.includes(opt) ? p.filter(x=>x!==opt) : [...p, opt]);
  const toggleDisease  = (opt) => setDiseases(p => p.includes(opt) ? p.filter(x=>x!==opt) : [...p, opt]);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  const skipAllergies = () => { setAllergies([]); setSkipA(true); };
  const skipDiseases  = () => { setDiseases([]);  setSkipD(true); };

  const submit = (e) => {
    e.preventDefault();
    setError(''); setSaving(true);

    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = stored?._id || stored?.id || stored?.userid;
    if (!userId) { setError('No user in session.'); setSaving(false); return; }

    
    const payload = {};
    if (!skipA && allergies.length) payload.allergens = allergies;
    if (!skipD && diseases.length)  payload.diseases  = diseases;

    
    if (Object.keys(payload).length === 0) {
      setSaving(false);
      navigate('/home');
      return;
    }

    axios
      .put(`http://localhost:5000/user/${userId}`, payload)
      .then(res => {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/home');
      })
      .catch(err => {
        const msg = err?.response?.data?.error || err?.response?.data?.message || err.message;
        setError(msg || 'Failed to save');
      })
      .finally(() => setSaving(false));
  };

  return (
    <main className="auth">
      <form className="auth-card" onSubmit={submit}>
        <h2>Almost there…</h2>

       
        <h3 className="section-title">Any known food allergies?</h3>
        <div className="check-grid">
          {allergyOptions.map(opt => (
            <label key={opt} className={`chip ${allergies.includes(opt) ? 'active' : ''}`}>
              <input type="checkbox"
                     checked={allergies.includes(opt)}
                     onChange={() => { setSkipA(false); toggleAllergy(opt); }} />
              <span>{cap(opt)}</span>
            </label>
          ))}
        </div>
        <div className="section-actions">
          <button type="button" className="btn text" onClick={skipAllergies}>Skip</button>
        </div>

     
        <h3 className="section-title" style={{ marginTop: '1rem' }}>Any diseases?</h3>
        <div className="check-grid">
          {diseasesOptions.map(opt => (
            <label key={opt} className={`chip ${diseases.includes(opt) ? 'active' : ''}`}>
              <input type="checkbox"
                     checked={diseases.includes(opt)}
                     onChange={() => { setSkipD(false); toggleDisease(opt); }} />
              <span>{cap(opt)}</span>
            </label>
          ))}
        </div>
        <div className="section-actions">
          <button type="button" className="btn text" onClick={skipDiseases}>Skip</button>
        </div>

        {error && <div className="auth-error" style={{marginTop:10}}>{error}</div>}

        <div className="query-actions">
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? 'Saving…' : 'Continue'}
          </button>
        </div>
      </form>
    </main>
  );
}
