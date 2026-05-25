import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { Activity } from '../services/api';
import ActivityCard from '../components/ActivityCard';
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_LABELS, ZONES } from '../constants/theme';

export default function SearchPage() {
  const navigate  = useNavigate();
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [zone,     setZone]     = useState('');
  const [age,      setAge]      = useState('');
  const [freeOnly, setFreeOnly] = useState(false);
  const [results,  setResults]  = useState<Activity[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setSearched(true);
    try {
      const params: any = {};
      if (search.trim()) params.search   = search.trim();
      if (category)      params.category = category;
      if (zone)          params.zone     = zone;
      if (age)           params.age      = parseInt(age);
      if (freeOnly)      params.free     = 'true';
      const { data } = await api.get('/activities', { params });
      setResults(data.data || []);
    } catch {}
    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Caută activități 🔍</h1>

      {/* Formular filtre */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">

          {/* Cauta text */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Caută după nume
            </label>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ex: robotică, fotbal, pictură..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#F7F3EE]"
            />
          </div>

          {/* Varsta */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Vârsta copilului
            </label>
            <input
              type="number" value={age} onChange={e => setAge(e.target.value)}
              placeholder="ex: 10" min="4" max="18"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#F7F3EE]"
            />
          </div>

          {/* Sector */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Sector
            </label>
            <select value={zone} onChange={e => setZone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 bg-[#F7F3EE]">
              <option value="">Oriunde</option>
              {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
        </div>

        {/* Categorii */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Categorie
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setCategory('')}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${!category ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
              Toate
            </button>
            {CATEGORIES.map(cat => (
              <button key={cat} type="button" onClick={() => setCategory(category === cat ? '' : cat)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border transition-all ${category === cat ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
                <span>{CATEGORY_ICONS[cat]}</span>
                <span>{CATEGORY_LABELS[cat]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gratuit + buton */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={freeOnly} onChange={e => setFreeOnly(e.target.checked)}
              className="w-4 h-4 rounded" />
            <span className="text-sm text-gray-600">Doar activități gratuite</span>
          </label>
          <button type="submit"
            className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
            Caută
          </button>
        </div>
      </form>

      {/* Rezultate */}
      {loading && <div className="text-center py-12 text-gray-400">Se caută...</div>}

      {searched && !loading && (
        results.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <div className="font-medium">Nicio activitate cu aceste filtre</div>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{results.length} rezultate găsite</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map(a => (
                <ActivityCard key={a.id} activity={a}
                  onClick={() => navigate(`/activity/${a.id}`, { state: { activity: a } })} />
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
}
