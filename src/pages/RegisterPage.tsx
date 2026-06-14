import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

const ROLES = [
  { value: 'parent', label: 'Sunt părinte', desc: 'Creez profiluri pentru copiii mei' },
  { value: 'teen',   label: 'Sunt adolescent', desc: 'Îmi gestionez singur activitățile' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [firstName, setFirstName] = useState('');
  const [age,       setAge]       = useState('');
  const [role,      setRole]      = useState('parent');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError('Parola trebuie să aibă cel puțin 8 caractere.'); return; }
    if (role === 'teen' && (!age || parseInt(age) < 10 || parseInt(age) > 18)) {
      setError('Vârsta trebuie să fie între 10 și 18 ani.'); return;
    }
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        email, password, firstName, role,
        age: role === 'teen' ? parseInt(age) : undefined,
      });
      login(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Eroare la înregistrare.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #F8DCD9',
    backgroundColor: '#FDF0EE',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '14px',
    color: '#3D3D3D',
    outline: 'none',
    transition: 'border 0.2s',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#FDF0EE' }}>
      <div className="w-full max-w-md">

        <Link to="/login" className="block text-sm mb-6 hover:opacity-70 transition-opacity"
          style={{ color: '#939D7A', fontFamily: 'DM Sans, sans-serif' }}>
          ← Înapoi la login
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1"
            style={{ fontFamily: 'Playfair Display, serif', color: '#939D7A' }}>
            Cont nou
          </h1>
          <p className="text-sm" style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
            Câteva detalii și ești gata
          </p>
        </div>

        <div className="rounded-3xl p-8 shadow-sm" style={{ backgroundColor: 'white', border: '1px solid #F8DCD9' }}>
          {error && (
            <div className="rounded-xl p-3 mb-4 text-sm"
              style={{ backgroundColor: '#FDE8E8', color: '#C0392B', border: '1px solid #F5C6C6', fontFamily: 'DM Sans, sans-serif' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Selectie rol */}
            <div>
              <label className="block text-sm font-medium mb-2"
                style={{ fontFamily: 'DM Sans, sans-serif', color: '#7A8465' }}>
                Eu sunt...
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r => (
                  <button key={r.value} type="button" onClick={() => setRole(r.value)}
                    className="p-3 rounded-xl text-left transition-all"
                    style={{
                      border: role === r.value ? '2px solid #939D7A' : '1px solid #F8DCD9',
                      backgroundColor: role === r.value ? '#F0F2EC' : 'white',
                    }}>
                    <div className="text-sm font-medium" style={{ color: '#3D3D3D', fontFamily: 'DM Sans, sans-serif' }}>
                      {r.label}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>
                      {r.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prenume */}
            <div>
              <label className="block text-sm font-medium mb-1.5"
                style={{ fontFamily: 'DM Sans, sans-serif', color: '#7A8465' }}>
                Prenume
              </label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                placeholder="ex: Ana" required style={inputStyle}
                onFocus={e => (e.currentTarget.style.border = '1px solid #939D7A')}
                onBlur={e => (e.currentTarget.style.border = '1px solid #F8DCD9')}/>
            </div>

            {/* Varsta doar pentru teen */}
            {role === 'teen' && (
              <div>
                <label className="block text-sm font-medium mb-1.5"
                  style={{ fontFamily: 'DM Sans, sans-serif', color: '#7A8465' }}>
                  Vârsta ta
                </label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)}
                  placeholder="ex: 15" min="10" max="18" required style={inputStyle}
                  onFocus={e => (e.currentTarget.style.border = '1px solid #939D7A')}
                  onBlur={e => (e.currentTarget.style.border = '1px solid #F8DCD9')}/>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5"
                style={{ fontFamily: 'DM Sans, sans-serif', color: '#7A8465' }}>
                Email
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="email@exemplu.ro" required style={inputStyle}
                onFocus={e => (e.currentTarget.style.border = '1px solid #939D7A')}
                onBlur={e => (e.currentTarget.style.border = '1px solid #F8DCD9')}/>
            </div>

            {/* Parola */}
            <div>
              <label className="block text-sm font-medium mb-1.5"
                style={{ fontFamily: 'DM Sans, sans-serif', color: '#7A8465' }}>
                Parolă (minim 8 caractere)
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Alege o parolă sigură" required style={inputStyle}
                onFocus={e => (e.currentTarget.style.border = '1px solid #939D7A')}
                onBlur={e => (e.currentTarget.style.border = '1px solid #F8DCD9')}/>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-full font-semibold mt-2 transition-all disabled:opacity-50"
              style={{
                backgroundColor: '#939D7A',
                color: '#FDF0EE',
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '0.03em',
                border: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7A8465')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#939D7A')}>
              {loading ? 'Se creează...' : 'Creează cont'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{ fontFamily: 'DM Sans, sans-serif', color: '#A89E9C' }}>
          Ai deja cont?{' '}
          <Link to="/login" style={{ color: '#939D7A', fontWeight: 600 }}>
            Intră în cont
          </Link>
        </p>
      </div>
    </div>
  );
}
