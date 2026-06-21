import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Clock, Check } from 'lucide-react';

const Availability = () => {
  const [profileId, setProfileId] = useState(null);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/api/auth/profile');
        if (data.caregiverProfile) {
          setProfileId(data.caregiverProfile._id);
          setDays(data.caregiverProfile.availability || []);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const toggleDay = (day) => {
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await API.put(`/api/caregivers/${profileId}`, { availability: days });
      setSuccess(true);
      setSaving(false);
    } catch (err) {
      alert(err);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Loading availability logs...</p>
      </div>
    );
  }

  return (
    <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <Clock className="h-8 w-8 text-primary-500" />
          <span>Availability Calendar</span>
        </h1>
        <p class="text-slate-500 font-medium">Choose the days you are available to accept eldercare bookings.</p>
      </div>

      {success && (
        <div class="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center font-bold text-sm border border-emerald-100">
          ✓ Availability settings saved.
        </div>
      )}

      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div class="flex flex-col gap-3">
          {weekdays.map((day) => {
            const isSelected = days.includes(day);
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                class={`w-full py-4 px-6 rounded-2xl border text-left font-extrabold text-base flex justify-between items-center transition ${
                  isSelected
                    ? 'bg-primary-50 border-primary-500 text-primary-600 ring-2 ring-primary-500'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{day}</span>
                {isSelected && (
                  <span class="p-1.5 bg-primary-100 text-primary-600 rounded-full">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          class="w-full bg-primary-500 hover:bg-primary-600 text-white font-extrabold py-3.5 rounded-xl shadow-sm transition"
        >
          {saving ? 'Saving Availability Schedules...' : 'Save Availability Days'}
        </button>
      </div>
    </div>
  );
};

export default Availability;
