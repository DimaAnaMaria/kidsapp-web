import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS } from '../constants/theme';

const QUESTIONS_TEEN = [
  { text: "Când ai timp liber, îți place să alergi sau să faci mișcare?", s: { sportiv: 2 } },
  { text: "Ești persoana care încearcă să îi împace pe ceilalți când apare un conflict?", s: { sociabil: 2 } },
  { text: "Te atrag activitățile cu aventură sau risc (escaladă, parc de aventură)?", s: { sportiv: 2 } },
  { text: "Îți place să explorezi locuri noi și să descoperi lucruri necunoscute?", s: { sociabil: 2 } },
  { text: "Ești gata să îți aperi ideile cu entuziasm în fața celorlalți?", s: { pragmatic: 2 } },
  { text: "Preferi jocurile de echipă în locul celor individuale?", s: { sportiv: 2, sociabil: 1 } },
  { text: "Poți sta mult timp concentrat pe o singură sarcină (puzzle, lectură, proiect)?", s: { tehnic: 1, pragmatic: 1 } },
  { text: "Îți place să desfaci obiecte ca să înțelegi cum funcționează în interior?", s: { tehnic: 2 } },
  { text: "Ești foarte ordonat și îți place ca totul să fie la locul lui?", s: { pragmatic: 2 } },
  { text: "Ai răbdare să repeți un experiment sau joc de mai multe ori până reușești?", s: { tehnic: 1, pragmatic: 1 } },
  { text: "Te atrage ideea de a construi ceva de la zero (Lego, cod, mecanism)?", s: { tehnic: 2 } },
  { text: "Preferi să citești instrucțiunile înainte de a începe un proiect nou?", s: { pragmatic: 2 } },
  { text: "Îți place să imaginezi lumi sau scenarii fantastice și neobișnuite?", s: { artist: 2 } },
  { text: "Ești atent la detalii mici: culori, sunete sau texturi din jurul tău?", s: { artist: 2 } },
  { text: "Îți exprimi emoțiile prin desen, muzică sau scriere?", s: { artist: 2 } },
  { text: "Te simți uneori afectat de critici pentru că pui mult suflet în ce faci?", s: { artist: 1 } },
  { text: "Preferi activitățile în care creezi ceva estetic (pictură, olărit, colaje)?", s: { artist: 2 } },
  { text: "Te simți inspirat când vizitezi un muzeu sau mergi la un spectacol de teatru?", s: { artist: 2 } },
  { text: "Îți faci prieteni noi cu ușurință și îți place să vorbești cu multă lume?", s: { sociabil: 2 } },
  { text: "Te atrag jocurile de strategie care necesită planificare și logică?", s: { tehnic: 2 } },
  { text: "Îți place să participi la ateliere practice (gătit, meșteșuguri, bricolaj)?", s: { pragmatic: 2 } },
  { text: "Găsești rapid soluții când apare o problemă neprevăzută?", s: { pragmatic: 1, tehnic: 1 } },
  { text: "Preferi să lucrezi pe calculator sau cu gadget-uri pentru a crea ceva util?", s: { tehnic: 2 } },
  { text: "Îți place să organizezi activități sau evenimente pentru prietenii tăi?", s: { sociabil: 2 } },
];

const QUESTIONS_PARENT = [
  { text: "În timpul liber, copilului tău îi place să alerge sau să facă mișcare?", s: { sportiv: 2 } },
  { text: "Ai observat că el/ea încearcă să îi împace pe ceilalți când apare un conflict?", s: { sociabil: 2 } },
  { text: "Copilul tău este atras de activitățile cu aventură sau risc (escaladă, parc de aventură)?", s: { sportiv: 2 } },
  { text: "Îi place să exploreze locuri noi și să descopere lucruri necunoscute?", s: { sociabil: 2 } },
  { text: "Crezi că este genul care își apără ideile cu entuziasm în fața celorlalți?", s: { pragmatic: 2 } },
  { text: "Preferă jocurile de echipă în locul celor individuale?", s: { sportiv: 2, sociabil: 1 } },
  { text: "Poate sta mult timp concentrat pe o singură sarcină (puzzle, lectură, proiect)?", s: { tehnic: 1, pragmatic: 1 } },
  { text: "Ai observat că îi place să desfacă obiecte ca să înțeleagă cum funcționează?", s: { tehnic: 2 } },
  { text: "Este foarte ordonat/ă și îi place ca totul să fie la locul lui?", s: { pragmatic: 2 } },
  { text: "Are răbdare să repete un experiment sau joc de mai multe ori până reușește?", s: { tehnic: 1, pragmatic: 1 } },
  { text: "Îl/o atrage ideea de a construi ceva de la zero (Lego, cod, mecanism)?", s: { tehnic: 2 } },
  { text: "Preferă să citească instrucțiunile înainte de a începe un proiect nou?", s: { pragmatic: 2 } },
  { text: "Îi place să imagineze lumi sau scenarii fantastice și neobișnuite?", s: { artist: 2 } },
  { text: "Este atent/ă la detalii mici: culori, sunete sau texturi din jurul său?", s: { artist: 2 } },
  { text: "Își exprimă emoțiile prin desen, muzică sau scriere?", s: { artist: 2 } },
  { text: "Se simte uneori afectat/ă de critici pentru că pune mult suflet în ce face?", s: { artist: 1 } },
  { text: "Preferă activitățile în care creează ceva estetic (pictură, olărit, colaje)?", s: { artist: 2 } },
  { text: "Se simte inspirat/ă când vizitează un muzeu sau merge la un spectacol de teatru?", s: { artist: 2 } },
  { text: "Își face prieteni noi cu ușurință și îi place să vorbească cu multă lume?", s: { sociabil: 2 } },
  { text: "Îl/o atrag jocurile de strategie care necesită planificare și logică?", s: { tehnic: 2 } },
  { text: "Îi place să participe la ateliere practice (gătit, meșteșuguri, bricolaj)?", s: { pragmatic: 2 } },
  { text: "Găsește rapid soluții când apare o problemă neprevăzută?", s: { pragmatic: 1, tehnic: 1 } },
  { text: "Preferă să lucreze pe calculator sau cu gadget-uri pentru a crea ceva util?", s: { tehnic: 2 } },
  { text: "Îi place să organizeze activități sau evenimente pentru prietenii săi?", s: { sociabil: 2 } },
];

const OPTS = [
  { label: 'Nu', value: 0, emoji: '😐' },
  { label: 'Uneori', value: 1, emoji: '🤔' },
  { label: 'Da', value: 2, emoji: '😄' },
];

type Step = 'info' | 'quiz' | 'result';

export default function QuizPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isTeen = user?.role === 'teen';

  // Alege setul de intrebari in functie de rol
  const QUESTIONS = isTeen ? QUESTIONS_TEEN : QUESTIONS_PARENT;

  // Calculeaza MAX dupa ce QUESTIONS e definit
  const MAX: Record<string, number> = { sportiv: 0, artist: 0, pragmatic: 0, tehnic: 0, sociabil: 0 };
  QUESTIONS.forEach(q => Object.entries(q.s).forEach(([k, v]) => { MAX[k] = (MAX[k] || 0) + v * 2; }));

  const [step, setStep] = useState<Step>('info');
  const [childName, setChildName] = useState(isTeen ? (user?.firstName || 'Tu') : '');
  const [childAge, setChildAge] = useState(isTeen ? '' : '');
  const [gender, setGender] = useState('nespecificat');
  const [cur, setCur] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ sportiv: 0, artist: 0, pragmatic: 0, tehnic: 0, sociabil: 0 });
  const [saving, setSaving] = useState(false);

  function handleInfo(e: React.FormEvent) {
    e.preventDefault();
    if (!childName || !childAge || parseInt(childAge) < 4 || parseInt(childAge) > 18) {
      alert('Completează corect toate câmpurile (vârstă: 4-18 ani)');
      return;
    }
    setStep('quiz');
  }

  function handleAnswer(value: number) {
    const q = QUESTIONS[cur];
    const ns = { ...scores };
    Object.entries(q.s).forEach(([k, w]) => { ns[k] = (ns[k] || 0) + w * value; });
    setScores(ns);
    if (cur + 1 >= QUESTIONS.length) setStep('result');
    else setCur(cur + 1);
  }

  function getWinner() {
    const pcts: Record<string, number> = {};
    Object.keys(scores).forEach(k => { pcts[k] = MAX[k] > 0 ? Math.round(scores[k] / MAX[k] * 100) : 0; });
    return { winner: Object.entries(pcts).sort((a, b) => b[1] - a[1])[0][0], pcts };
  }

  async function saveProfile() {
    setSaving(true);
    const { winner, pcts } = getWinner();
    try {
      await api.post('/profiles', {
        childName, childAge: parseInt(childAge), childGender: gender,
        dominantProfile: winner, scores: pcts, quizSource: isTeen ? 'self' : 'parent',
      });
      const { data: profiles } = await api.get('/profiles');
      useProfileStore.getState().setProfiles(profiles.data);
      alert(`Profilul lui ${childName} a fost salvat! Profil dominant: ${CATEGORY_LABELS[winner]}`);
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Eroare la salvare');
    }
    setSaving(false);
  }

  const progress = Math.round((cur / QUESTIONS.length) * 100);
  const { winner, pcts } = step === 'result' ? getWinner() : { winner: '', pcts: {} };
  const resultColors = winner ? CATEGORY_COLORS[winner] : null;

  // Ecran varsta pentru teen
  if (step === 'info' && isTeen) return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 mb-6 block">← Înapoi</button>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Câți ani ai? 🎂</h1>
      <p className="text-gray-500 mb-8">Avem nevoie de vârsta ta pentru recomandări potrivite</p>
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <input type="number" value={childAge} onChange={e => setChildAge(e.target.value)}
          placeholder="ex: 15" min="10" max="18"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold focus:outline-none focus:border-gray-400 bg-[#F7F3EE] mb-6" />
        <button
          onClick={() => {
            if (!childAge || parseInt(childAge) < 10 || parseInt(childAge) > 18) {
              alert('Vârsta trebuie să fie între 10 și 18 ani');
              return;
            }
            setStep('quiz');
          }}
          className="w-full bg-gray-900 text-white py-3 rounded-full font-bold hover:opacity-90">
          Continuă →
        </button>
      </div>
    </div>
  );

  // Ecran Info
  if (step === 'info') return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 mb-6 block hover:text-gray-700">
        ← Înapoi
      </button>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Hai să ne cunoaștem! 👋</h1>
      <p className="text-gray-500 mb-8">Câteva detalii despre copilul pentru care completezi profilul</p>
      <form onSubmit={handleInfo} className="bg-white rounded-2xl p-8 border border-gray-200 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Prenumele copilului</label>
          <input type="text" value={childName} onChange={e => setChildName(e.target.value)}
            placeholder="ex: Maria" required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-400 bg-[#F7F3EE]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Vârsta (ani)</label>
          <input type="number" value={childAge} onChange={e => setChildAge(e.target.value)}
            placeholder="ex: 10" min="4" max="18" required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-400 bg-[#F7F3EE]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Gen</label>
          <div className="grid grid-cols-3 gap-2">
            {['fata', 'baiat', 'nespecificat'].map(g => (
              <button key={g} type="button" onClick={() => setGender(g)}
                className={`py-2 rounded-xl border text-sm transition-all ${gender === g ? 'border-gray-900 bg-gray-50 font-medium' : 'border-gray-200 hover:border-gray-300'}`}>
                {g === 'fata' ? 'Fată' : g === 'baiat' ? 'Băiat' : 'Nespecificat'}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="bg-gray-900 text-white py-3 rounded-full font-bold hover:opacity-90 mt-2">
          Continuă →
        </button>
      </form>
    </div>
  );

  // Ecran Quiz
  if (step === 'quiz') return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Întrebarea {cur + 1} din {QUESTIONS.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gray-900 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-4">
        <p className="text-lg font-medium text-gray-900 leading-relaxed">{QUESTIONS[cur].text}</p>
      </div>
      <div className="flex flex-col gap-3">
        {OPTS.map(opt => (
          <button key={opt.value} onClick={() => handleAnswer(opt.value)}
            className="flex items-center gap-4 bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-gray-900 transition-all text-left">
            <span className="text-2xl w-10 text-center">{opt.emoji}</span>
            <span className="text-base font-medium text-gray-900">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // Ecran Rezultat
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {resultColors && (
        <div className="rounded-2xl p-10 mb-6 text-center" style={{ backgroundColor: resultColors.bg }}>
          <div className="text-6xl mb-4">{CATEGORY_ICONS[winner]}</div>
          <p className="text-sm font-medium mb-1" style={{ color: resultColors.text }}>{childName} este...</p>
          <h2 className="text-3xl font-bold" style={{ color: resultColors.text }}>{CATEGORY_LABELS[winner]}</h2>
        </div>
      )}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
        <h3 className="font-bold text-gray-900 mb-4">Distribuție completă</h3>
        <div className="flex flex-col gap-3">
          {Object.entries(pcts).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
            <div key={k} className="flex items-center gap-3">
              <span className="text-sm w-24 flex items-center gap-1">
                <span>{CATEGORY_ICONS[k]}</span>
                <span className="text-gray-600">{CATEGORY_LABELS[k]}</span>
              </span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${v}%`, backgroundColor: CATEGORY_COLORS[k]?.dot }} />
              </div>
              <span className="text-sm text-gray-500 w-8 text-right">{v}%</span>
            </div>
          ))}
        </div>
      </div>
      <button onClick={saveProfile} disabled={saving}
        className="w-full bg-gray-900 text-white py-3 rounded-full font-bold hover:opacity-90 disabled:opacity-50 mb-3">
        {saving ? 'Se salvează...' : '💾 Salvează profilul'}
      </button>
      <button onClick={() => { setCur(0); setScores({ sportiv: 0, artist: 0, pragmatic: 0, tehnic: 0, sociabil: 0 }); setStep('quiz'); }}
        className="w-full border border-gray-200 text-gray-500 py-3 rounded-full font-medium hover:border-gray-400 transition-all">
        ↺ Reîncepe quiz-ul
      </button>
    </div>
  );
}
