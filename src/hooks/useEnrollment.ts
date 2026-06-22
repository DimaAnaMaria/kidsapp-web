// src/hooks/useEnrollment.ts
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export interface EnrollmentData {
  start_date: string;
  start_time: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  notes?: string;
}

export interface Enrollment extends EnrollmentData {
  id: string;
  activity_id: string;
  enrolled_at: string;
  title?: string;
  category?: string;
  zone?: string;
  address?: string;
  organizer_name?: string;
  phone?: string;
  website?: string;
}

export function useEnrollment(profileId: string | null, activityId: string) {
  const [enrolled, setEnrolled]     = useState(false);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    if (!profileId || !activityId) { setLoading(false); return; }
    api.get(`/profiles/${profileId}/enrollments/${activityId}`)
      .then(res => {
        setEnrolled(res.data.enrolled);
        setEnrollment(res.data.enrollment);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profileId, activityId]);

  const enroll = useCallback(async (data: EnrollmentData) => {
    if (!profileId) return;
    setSaving(true);
    try {
      const res = await api.post(`/profiles/${profileId}/enrollments/${activityId}`, data);
      setEnrolled(true);
      setEnrollment(res.data.enrollment);
      return res.data;
    } finally {
      setSaving(false);
    }
  }, [profileId, activityId]);

  const unenroll = useCallback(async () => {
    if (!profileId) return;
    setSaving(true);
    try {
      await api.delete(`/profiles/${profileId}/enrollments/${activityId}`);
      setEnrolled(false);
      setEnrollment(null);
    } finally {
      setSaving(false);
    }
  }, [profileId, activityId]);

  return { enrolled, enrollment, loading, saving, enroll, unenroll };
}

export function useEnrollments(profileId: string | null) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading]         = useState(true);

  const refetch = useCallback(() => {
    if (!profileId) { setLoading(false); return; }
    setLoading(true);
    api.get(`/profiles/${profileId}/enrollments`)
      .then(res => setEnrollments(res.data.enrollments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [profileId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { enrollments, loading, refetch };
}