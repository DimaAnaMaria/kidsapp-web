import React from 'react';
import { Activity } from '../services/api';
import { CATEGORY_COLORS, CATEGORY_ICONS, CATEGORY_LABELS } from '../constants/theme';

interface Props {
  activity: Activity;
  onClick: () => void;
}

export default function ActivityCard({ activity, onClick }: Props) {
  const colors = CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.sociabil;
  const icon = CATEGORY_ICONS[activity.category] || '📌';
  const label = CATEGORY_LABELS[activity.category] || activity.category;

  const priceLabel = activity.price === 0 && activity.price_type === 'free'
    ? 'Gratuit'
    : activity.price_type === 'variable'
      ? 'Nespecificat'
      : activity.price === 0
        ? 'Gratuit'
        : `${activity.price} RON/${activity.price_type === 'monthly' ? 'lună' : 'ședință'}`;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-5 border border-gray-200 cursor-pointer hover:border-gray-400 hover:shadow-md transition-all duration-150"
    >
      {/* Badge categorie */}
      <div
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mb-3"
        style={{ backgroundColor: colors.bg, color: colors.text }}
      >
        <span>{icon}</span>
        <span>{label}</span>
      </div>

      {/* Titlu */}
      <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
        {activity.title}
      </h3>

      {/* Descriere */}
      {activity.short_description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {activity.short_description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-end justify-between mt-2">
        <div className="flex flex-col gap-1">
          {activity.zone && (
            <span className="text-xs text-gray-400">📍 {activity.zone}</span>
          )}
          <span className="text-xs text-gray-400">
            👶 {activity.age_min}–{activity.age_max} ani
          </span>
        </div>
        <span
          className="text-xs font-medium px-2 py-1 rounded-lg"
          style={{
            backgroundColor: activity.price_type === 'free' || activity.price === 0
              ? '#F0FBF6'
              : activity.price_type === 'variable'
                ? '#F1EFE8'
                : '#F7F3EE',
            color: activity.price_type === 'free' || activity.price === 0
              ? '#0A7A51'
              : activity.price_type === 'variable'
                ? '#6B6058'
                : '#6B6058',
          }}
        >
          {priceLabel}
        </span>
      </div>
    </div>
  );
}
