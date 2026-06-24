// src/components/ActivityReviews.tsx
// Afiseaza media stelelor + toate reviewurile unei activitati
// Adauga in ActivityDetailPage.tsx

import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Review {
  id: string;
  rating: number;
  message: string | null;
  child_name: string;
  created_at: string;
}

interface ReviewsData {
  avg_rating: number | null;
  total_reviews: number;
  reviews: Review[];
}

interface Props {
  activityId: string;
}

function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} style={{ fontSize: size, color: star <= Math.round(rating) ? '#939D7A' : '#E8E0DB' }}>★</span>
      ))}
    </div>
  );
}

export function ActivityReviews({ activityId }: Props) {
  const [data,    setData]    = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/activities/${activityId}/reviews`)
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activityId]);

  if (loading) return null;
  if (!data || data.total_reviews === 0) return null;

  return (
    <div style={{ backgroundColor: 'white', border: '1px solid #F8DCD9', borderRadius: 20, padding: '20px 24px', marginBottom: 24 }}>
      {/* Header cu media */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #F8DCD9' }}>
        <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 700, color: '#3D3D3D', lineHeight: 1 }}>
          {data.avg_rating?.toFixed(1)}
        </span>
        <div>
          <StarDisplay rating={data.avg_rating || 0} size={20} />
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: '#A89E9C', margin: '4px 0 0' }}>
            {data.total_reviews} {data.total_reviews === 1 ? 'recenzie' : 'recenzii'}
          </p>
        </div>
      </div>

      {/* Lista reviewuri */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {data.reviews.map((review, idx) => (
          <div key={review.id} style={{ paddingTop: idx > 0 ? 14 : 0, marginTop: idx > 0 ? 0 : 0, borderTop: idx > 0 ? '1px solid #F8DCD9' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <StarDisplay rating={review.rating} size={14} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: '#A89E9C' }}>
                {new Date(review.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            {review.message && (
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#5D5D5D', margin: '4px 0 0', lineHeight: 1.6 }}>
                "{review.message}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityReviews;
