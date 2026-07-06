import React from 'react';
import { Activity } from '../services/api';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS } from '../constants/theme';
import { getActivityImage } from '../constants/images';

interface Props {
  activity: Activity;
  onClick?: () => void;
}

export default function ActivityCard({ activity, onClick }: Props) {
  const colors = CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.sociabil;

  const priceLabel =
    activity.price_type === 'free' || activity.price === 0
      ? 'Gratuit'
      : activity.price_type === 'variable'
        ? 'Nespecificat'
        : `${activity.price} RON/${activity.price_type === 'monthly' ? 'lună' : 'ședință'}`;

  const priceColor =
    activity.price_type === 'free' || activity.price === 0
      ? { bg: '#F0FBF6', text: '#0A7A51' }
      : { bg: '#F1EFE8', text: '#6B6058' };

  const imageSrc =  (activity as any).image_url || getActivityImage(
    activity.id,
    activity.subcategory,
    activity.category
  );

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* ── Imagine activitate ── */}
      <div className="relative w-full h-36 overflow-hidden flex-shrink-0">
        <img
          src={imageSrc}
          alt={activity.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Daca imaginea nu se incarca, afisam fundalul colorat al categoriei
            const target = e.currentTarget;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.style.backgroundColor = colors.bg;
              parent.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2.5rem">${CATEGORY_ICONS[activity.category]}</div>`;
            }
          }}
        />
        {/* Overlay subtil pentru a proteja textul de deasupra */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </div>

      {/* ── Continut card ── */}
      <div className="p-4 flex flex-col gap-2 flex-1">

        {/* Badge categorie */}
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {CATEGORY_ICONS[activity.category]} {CATEGORY_LABELS[activity.category]}
          </span>
        </div>

        {/* Titlu */}
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
          {activity.title}
        </h3>

        {/* Descriere scurta (daca exista) */}
        {activity.short_description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {activity.short_description}
          </p>
        )}

        {/* Footer: locatie, varsta, pret */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex flex-col gap-0.5">
            {activity.zone && (
              <span className="flex items-center gap-1.5">
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
                  <path d="M6 0C3 0 0 2.5 0 6C0 10 6 16 6 16C6 16 12 10 12 6C12 2.5 9 0 6 0Z"
                    stroke="#939D7A" strokeWidth="1.3" strokeLinejoin="round" />
                  <circle cx="6" cy="6" r="2.5" fill="#939D7A" />
                </svg>
                <span className="text-xs" style={{ color: '#7A8465', fontFamily: 'DM Sans, sans-serif' }}>
                  {activity.zone}
                </span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <svg width="13" height="18" viewBox="0 0 13 18" fill="none">
                <ellipse cx="6.5" cy="6" rx="6" ry="7" stroke="#939D7A" strokeWidth="1.3" />
                <path d="M4 13Q6.5 15 9 13" stroke="#939D7A" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M6.5 15Q8 18 6.5 20" stroke="#939D7A" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className="text-xs" style={{ color: '#7A8465', fontFamily: 'DM Sans, sans-serif' }}>
                {activity.age_min}–{activity.age_max} ani
              </span>
            </span>
          </div>

          {/* Pret */}
          <span
            className="text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap"
            style={{ backgroundColor: priceColor.bg, color: priceColor.text }}
          >
            {priceLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
