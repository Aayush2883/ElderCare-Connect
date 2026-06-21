import React, { useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Save, User, ShieldCheck } from 'lucide-react';
import { getUploadUrl } from '../utils/url';

const CaregiverProfile = () => {
  const { user, updateCaregiverProfileInContext } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // New file states
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [degreeDocumentFile, setDegreeDocumentFile] = useState(null);
  const [degreeDocument, setDegreeDocument] = useState('');

  const [formData, setFormData] = useState({
    specialization: 'General Attendant',
    qualification: '',
    experience: 0,
    serviceArea: '',
    profilePhoto: '',
    hourlyRate: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/api/auth/profile');
        if (data.caregiverProfile) {
          setFormData({
            specialization: data.caregiverProfile.specialization || 'General Attendant',
            qualification: data.caregiverProfile.qualification || '',
            experience: data.caregiverProfile.experience || 0,
            serviceArea: data.caregiverProfile.serviceArea || '',
            profilePhoto: data.caregiverProfile.profilePhoto || '',
            hourlyRate: data.caregiverProfile.hourlyRate || 0,
          });
          setDegreeDocument(data.caregiverProfile.degreeDocument || '');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile details.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const value = e.target.name === 'experience' || e.target.name === 'hourlyRate' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      const payload = new FormData();
      payload.append('specialization', formData.specialization);
      payload.append('qualification', formData.qualification);
      payload.append('experience', formData.experience);
      payload.append('serviceArea', formData.serviceArea);
      payload.append('hourlyRate', formData.hourlyRate);

      if (profilePhotoFile) {
        payload.append('profilePhoto', profilePhotoFile);
      } else {
        payload.append('profilePhoto', formData.profilePhoto);
      }

      if (degreeDocumentFile) {
        payload.append('degreeDocument', degreeDocumentFile);
      } else {
        payload.append('degreeDocument', degreeDocument);
      }

      const { data } = await API.post('/api/caregivers', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update state with returned file paths
      setFormData(prev => ({
        ...prev,
        profilePhoto: data.profilePhoto || '',
      }));
      setDegreeDocument(data.degreeDocument || '');
      setProfilePhotoFile(null);
      setDegreeDocumentFile(null);

      updateCaregiverProfileInContext(data);
      setSuccess(true);
      setSaving(false);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save profile details.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Loading profile credentials...</p>
      </div>
    );
  }

  return (
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-800">Caregiver Credentials Profile</h1>
        <p class="text-slate-500 font-medium">Update your certifications, professional specializations, and service locations.</p>
      </div>

      {success && (
        <div class="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center font-bold text-sm border border-emerald-100">
          ✓ Profile settings saved successfully.
        </div>
      )}

      {error && (
        <div class="bg-red-50 text-red-700 p-4 rounded-xl text-center font-bold text-sm border border-red-100">
          {error}
        </div>
      )}

      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} class="space-y-6">
          <div class="flex items-center gap-4 border-b border-slate-100 pb-6">
            <img
              src={getUploadUrl(formData.profilePhoto) || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
              alt={user.name}
              class="w-20 h-20 rounded-2xl object-cover border border-slate-200 bg-slate-50"
            />
            <div>
              <h3 class="text-xl font-extrabold text-slate-800">{user.name}</h3>
              <p class="text-slate-400 font-bold text-xs uppercase tracking-wider">{user.email}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specialization selection */}
            <div>
              <label class="block text-slate-700 text-sm font-bold mb-1">Your Specialization</label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
              >
                <option value="Registered Nurse">Registered Nurse</option>
                <option value="Physiotherapist">Physiotherapist</option>
                <option value="Elderly Attendant">Elderly Attendant</option>
                <option value="Post-Hospital Care">Post-Hospital Care</option>
              </select>
            </div>

            {/* Experience Selection */}
            <div>
              <label class="block text-slate-700 text-sm font-bold mb-1">Experience (Years)</label>
              <input
                type="number"
                name="experience"
                required
                min={0}
                value={formData.experience}
                onChange={handleChange}
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                placeholder="e.g. 5"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Area */}
            <div>
              <label class="block text-slate-700 text-sm font-bold mb-1">Service Coverage Area</label>
              <input
                type="text"
                name="serviceArea"
                required
                value={formData.serviceArea}
                onChange={handleChange}
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                placeholder="e.g. Downtown, West End"
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <label class="block text-slate-700 text-sm font-bold mb-1">Hourly Rate (Rs / hour)</label>
              <input
                type="number"
                name="hourlyRate"
                required
                min={0}
                value={formData.hourlyRate}
                onChange={handleChange}
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                placeholder="e.g. 25"
              />
            </div>
          </div>

          <div>
            <label class="block text-slate-700 text-sm font-bold mb-1">Profile Photo (Image format)</label>
            {formData.profilePhoto && (
              <p class="text-xs text-slate-400 mb-1 font-bold">
                Current Photo: {formData.profilePhoto.split('/').pop()}
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhotoFile(e.target.files[0])}
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
            />
          </div>

          <div>
            <label class="block text-slate-700 text-sm font-bold mb-1">Degree / Qualification Document (PDF format)</label>
            {degreeDocument && (
              <p class="text-xs text-slate-400 mb-1 font-bold">
                Current Document: <a href={getUploadUrl(degreeDocument)} target="_blank" rel="noopener noreferrer" class="text-primary-500 underline">View PDF</a>
              </p>
            )}
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setDegreeDocumentFile(e.target.files[0])}
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
            />
          </div>

          {/* Qualification Textarea */}
          <div>
            <label class="block text-slate-700 text-sm font-bold mb-1">Qualifications, Degrees & Licenses Summary</label>
            <textarea
              name="qualification"
              required
              rows={4}
              value={formData.qualification}
              onChange={handleChange}
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
              placeholder="List certifications e.g. BS in Nursing, MPT, CNA Licence #12345, CPR Certified..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={saving}
            class="w-full bg-primary-500 hover:bg-primary-600 text-white font-extrabold py-3.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2"
          >
            <Save className="h-5 w-5" />
            <span>{saving ? 'Saving Profile Credentials...' : 'Save Profile Credentials'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CaregiverProfile;
