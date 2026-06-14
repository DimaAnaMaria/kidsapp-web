import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      setError(err.response?.data?.error || 'Email sau parolă incorecte.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#FDF0EE' }}
    >
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: 'Playfair Display, serif', color: '#939D7A' }}
          >
            KidsApp
          </h1>
          <p
            className="text-sm"
            style={{ fontFamily: 'DM Sans, sans-serif', color: '#A89E9C', letterSpacing: '0.08em' }}
          >
            București
          </p>
          <p
            className="mt-4 text-base"
            style={{ fontFamily: 'DM Sans, sans-serif', color: '#7A8465' }}
          >
            Descoperă activități pentru copii și adolescenți
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8 shadow-sm"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #F8DCD9' }}
        >
          {error && (
            <div
              className="rounded-xl p-3 mb-4 text-sm"
              style={{ backgroundColor: '#FDE8E8', color: '#C0392B', border: '1px solid #F5C6C6' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ fontFamily: 'DM Sans, sans-serif', color: '#7A8465' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@exemplu.ro"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: '#FDF0EE',
                  border: '1px solid #F8DCD9',
                  fontFamily: 'DM Sans, sans-serif',
                  color: '#3D3D3D',
                }}
                onFocus={e => (e.currentTarget.style.border = '1px solid #939D7A')}
                onBlur={e => (e.currentTarget.style.border = '1px solid #F8DCD9')}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ fontFamily: 'DM Sans, sans-serif', color: '#7A8465' }}
              >
                Parolă
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Parola ta"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: '#FDF0EE',
                  border: '1px solid #F8DCD9',
                  fontFamily: 'DM Sans, sans-serif',
                  color: '#3D3D3D',
                }}
                onFocus={e => (e.currentTarget.style.border = '1px solid #939D7A')}
                onBlur={e => (e.currentTarget.style.border = '1px solid #F8DCD9')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full text-sm font-semibold mt-2 transition-all disabled:opacity-50"
              style={{
                backgroundColor: '#939D7A',
                color: '#FDF0EE',
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '0.03em',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7A8465')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#939D7A')}
            >
              {loading ? 'Se verifică...' : 'Intră în cont'}
            </button>
          </form>
        </div>

        {/* Link register */}
        <p
          className="text-center mt-6 text-sm"
          style={{ fontFamily: 'DM Sans, sans-serif', color: '#A89E9C' }}
        >
          Nu ai cont?{' '}
          <Link
            to="/register"
            style={{ color: '#939D7A', fontWeight: 600 }}
          >
            Înregistrează-te
          </Link>
        </p>
      </div>
    </div>
  );
}