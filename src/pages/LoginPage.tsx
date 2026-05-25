import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Eroare de conexiune. Verifică că serverul rulează.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3EE] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧭</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KidsApp București</h1>
          <p className="text-gray-500">Descoperă activități pentru copii și adolescenți</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@exemplu.ro"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-400 bg-[#F7F3EE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Parolă</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Parola ta"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-gray-400 bg-[#F7F3EE]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white rounded-full py-3 font-bold hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              {loading ? 'Se conectează...' : 'Intră în cont'}
            </button>

            <Link
              to="/register"
              className="text-center text-sm text-gray-500 hover:text-gray-700 mt-1"
            >
              Nu ai cont? Înregistrează-te
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
