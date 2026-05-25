import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

const ROLES = [
  { value: 'parent', label: '👨‍👩‍👧 Sunt părinte', desc: 'Creez profiluri pentru copiii mei' },
  { value: 'teen',   label: '🧑 Sunt adolescent', desc: 'Îmi gestionez singur activitățile' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [firstName, setFirstName] = useState('');
  const [role,      setRole]      = useState('parent');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError('Parola trebuie să aibă cel puțin 8 caractere.'); return; }
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { email, password, firstName, role });
      login(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Eroare la înregistrare.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <Link to="/login" className="block text-sm text-gray-500 mb-6 hover:text-gray-700">
          ← Înapoi la login
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Cont nou</h1>
        <p className="text-gray-500 mb-6">Câteva detalii și ești gata</p>

        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            {/* Tip cont */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Eu sunt...</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      role === r.value
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">{r.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Prenume</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                placeholder="Ana" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-400 bg-[#F7F3EE]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="email@exemplu.ro" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-400 bg-[#F7F3EE]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Parolă (minim 8 caractere)</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Alege o parolă sigură" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-400 bg-[#F7F3EE]" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gray-900 text-white rounded-full py-3 font-bold hover:opacity-90 transition-opacity disabled:opacity-50 mt-2">
              {loading ? 'Se creează...' : 'Creează cont'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
