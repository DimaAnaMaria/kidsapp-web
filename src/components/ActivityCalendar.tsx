
import React, { useState, useMemo, useRef } from 'react';
import { Enrollment } from '../hooks/useEnrollment';

interface Props {
  profileId: string;
    enrollments: Enrollment[];
  loading: boolean;
}

const DAYS_RO    = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sa', 'Du'];
const MONTHS_RO  = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];

const CATEGORY_COLORS: Record<string, string> = {
  sportiv: '#BA7517', artist: '#7F77DD', pragmatic: '#1D9E75', tehnic: '#378ADD', sociabil: '#D4A000',
};

const RECURRENCE_LABEL: Record<string, string> = {
  none: 'O singură dată', daily: 'Zilnic', weekly: 'Săptămânal', monthly: 'Lunar',
};

///calculeaza unde se plaseaza bulinele in functie de periodicitate
function getActiveDatesInMonth(enrollment: Enrollment, year: number, month: number): number[] {
  const start = new Date(enrollment.start_date);
  const monthStart = new Date(year, month, 1);
  const monthEnd   = new Date(year, month + 1, 0);
  if (start > monthEnd) return [];
  const dates: number[] = [];

  if (enrollment.recurrence === 'none') {
    if (start >= monthStart && start <= monthEnd) dates.push(start.getDate());
    return dates;
  }
  if (enrollment.recurrence === 'monthly') {
    const candidate = new Date(year, month, start.getDate());
    if (candidate >= start && candidate >= monthStart && candidate <= monthEnd) dates.push(start.getDate());
    return dates;
  }
  if (enrollment.recurrence === 'weekly') {
    const current = new Date(Math.max(start.getTime(), monthStart.getTime()));
    if (start < monthStart) {
      const diff = Math.ceil((monthStart.getTime() - start.getTime()) / (7 * 86400000));
      current.setTime(start.getTime() + diff * 7 * 86400000);
    }
    while (current <= monthEnd) {
      if (current >= monthStart) dates.push(current.getDate());
      current.setDate(current.getDate() + 7);
    }
    return dates;
  }
  if (enrollment.recurrence === 'daily') {
    const from = new Date(Math.max(start.getTime(), monthStart.getTime()));
    for (let d = from.getDate(); d <= monthEnd.getDate(); d++) dates.push(d);
    return dates;
  }
  return dates;
}

export function ActivityCalendar({ profileId, enrollments, loading }: Props) {
 
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [tooltip,   setTooltip]   = useState<{ day: number; items: Enrollment[] } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const dayMap = useMemo(() => {
    const map: Record<number, Enrollment[]> = {};
    for (const enr of enrollments) {
      for (const d of getActiveDatesInMonth(enr, viewYear, viewMonth)) {
        if (!map[d]) map[d] = [];
        map[d].push(enr);
      }
    }
    return map;
  }, [enrollments, viewYear, viewMonth]);

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); } else setViewMonth(m => m-1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); } else setViewMonth(m => m+1); };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#A89E9C', fontFamily: 'DM Sans, sans-serif' }}>Se încarcă calendarul...</div>;
  }

  return (
    <div onClick={() => setTooltip(null)}>
      {/* Header navigare */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={prevMonth} style={{ background: 'none', border: '1px solid #F8DCD9', borderRadius: 10, width: 34, height: 34, fontSize: 18, cursor: 'pointer', color: '#939D7A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
        <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 700, color: '#3D3D3D' }}>
          {MONTHS_RO[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={{ background: 'none', border: '1px solid #F8DCD9', borderRadius: 10, width: 34, height: 34, fontSize: 18, cursor: 'pointer', color: '#939D7A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
      </div>

      {/* Zilele saptamanii */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {DAYS_RO.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#A89E9C', fontFamily: 'DM Sans, sans-serif', padding: '4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>
        ))}
      </div>

      {/* Grid zile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, position: 'relative' }}>
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day   = i + 1;
          const items = dayMap[day] || [];
          const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
          const hasEvents = items.length > 0;

          return (
            <div
              key={day}
              onClick={e => { if (!hasEvents) return; e.stopPropagation(); setTooltip(t => t?.day === day ? null : { day, items }); }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: 40, borderRadius: 10, cursor: hasEvents ? 'pointer' : 'default',
                backgroundColor: hasEvents ? '#F0F2EC' : 'transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (hasEvents) (e.currentTarget as HTMLElement).style.backgroundColor = '#E8EBE0'; }}
              onMouseLeave={e => { if (hasEvents) (e.currentTarget as HTMLElement).style.backgroundColor = '#F0F2EC'; }}
            >
              <span style={{
                fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                backgroundColor: isToday ? '#939D7A' : 'transparent',
                color: isToday ? 'white' : '#3D3D3D', fontWeight: isToday ? 700 : 400,
              }}>
                {day}
              </span>
              {hasEvents && (
                <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>
                  {items.slice(0, 3).map((enr, idx) => (
                    <span key={idx} style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: CATEGORY_COLORS[enr.category || ''] || '#939D7A' }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* popup ul cu detalii intr o zi cu evenimente*/}
      {tooltip && (
        <div
          ref={tooltipRef}
          onClick={e => e.stopPropagation()}
          style={{
            marginTop: 12, backgroundColor: 'white', border: '1px solid #F8DCD9',
            borderRadius: 16, padding: '14px 16px',
          }}
        >
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, color: '#A89E9C', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>
            {tooltip.day} {MONTHS_RO[viewMonth]} {viewYear}
          </p>
          {tooltip.items.map((enr, idx) => (
            <div key={idx} style={{ paddingTop: idx > 0 ? 10 : 0, marginTop: idx > 0 ? 10 : 0, borderTop: idx > 0 ? '1px solid #F8DCD9' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: CATEGORY_COLORS[enr.category || ''] || '#939D7A', flexShrink: 0 }} />
                <strong style={{ fontFamily: 'Playfair Display, serif', fontSize: 14, color: '#3D3D3D' }}>{enr.title}</strong>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 15 }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#7A8465' }}>
                  🕐 {enr.start_time?.slice(0, 5)} · {RECURRENCE_LABEL[enr.recurrence]}
                </span>
                {enr.zone        && <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#A89E9C' }}>📍 {enr.zone}</span>}
                {enr.organizer_name && <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#A89E9C' }}>🏫 {enr.organizer_name}</span>}
                {enr.phone       && <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#A89E9C' }}>📞 {enr.phone}</span>}
                {enr.notes       && (
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#A89E9C', fontStyle: 'italic', marginTop: 2 }}>
                    "{enr.notes}"
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legenda */}
      {enrollments.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16, paddingTop: 12, borderTop: '1px solid #F8DCD9' }}>
          {Object.entries(CATEGORY_COLORS)
            .filter(([cat]) => enrollments.some(e => e.category === cat))
            .map(([cat, color]) => (
              <span key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#7A8465' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: color }} />
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </span>
            ))}
        </div>
      )}

      {/* Empty state */}
      {enrollments.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 0 8px', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#A89E9C', lineHeight: 1.7 }}>
          Nu ești înscris la nicio activitate încă.<br />
          Descoperă activități și apasă <strong style={{ color: '#939D7A' }}>"M-am înscris"</strong>!
        </div>
      )}
    </div>
  );
}

export default ActivityCalendar;
