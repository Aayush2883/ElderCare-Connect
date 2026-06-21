import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../services/api';
import { Star, ShieldCheck, Stethoscope, Briefcase, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';
import { getUploadUrl } from '../utils/url';

const CaregiverListing = () => {
  const location = useLocation();
  const [caregivers, setCaregivers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [specialization, setSpecialization] = useState(location.state?.serviceName || '');
  const [serviceArea, setServiceArea] = useState('');

  // Booking Modal state
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    patientId: '',
    serviceId: location.state?.serviceId || '',
    bookingDate: '',
    bookingTime: '',
    duration: '4 hours',
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (specialization) queryParams.append('specialization', specialization);
      if (serviceArea) queryParams.append('serviceArea', serviceArea);

      const [caregiversRes, patientsRes, servicesRes] = await Promise.all([
        API.get(`/api/caregivers?${queryParams.toString()}`),
        API.get('/api/patients'),
        API.get('/api/services'),
      ]);

      setCaregivers(caregiversRes.data);
      setPatients(patientsRes.data);
      setServices(servicesRes.data);
      
      // Auto select first patient if available
      if (patientsRes.data.length > 0) {
        setBookingForm(prev => ({ ...prev, patientId: patientsRes.data[0]._id }));
      }
      // Auto select first service if available and not set by state
      if (servicesRes.data.length > 0 && !location.state?.serviceId) {
        setBookingForm(prev => ({ ...prev, serviceId: servicesRes.data[0]._id }));
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Could not fetch listings. Make sure you are logged in.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [specialization, serviceArea]);

  const handleBookClick = (caregiver) => {
    setSelectedCaregiver(caregiver);
    setBookingSuccess(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.patientId || !bookingForm.serviceId || !bookingForm.bookingDate || !bookingForm.bookingTime) {
      alert('Please fill out all booking details');
      return;
    }

    try {
      await API.post('/api/bookings', {
        ...bookingForm,
        caregiverId: selectedCaregiver._id,
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setSelectedCaregiver(null);
        setBookingSuccess(false);
      }, 2500);
    } catch (err) {
      alert(err);
    }
  };

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Loading caregivers...</p>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 class="text-3xl font-extrabold text-slate-800">Our Verified Caregivers</h1>
        <p class="text-slate-500 font-medium">Browse verified healthcare professionals, filter by role or location, and schedule direct visits.</p>
      </div>

      {error && (
        <div class="bg-red-50 text-red-700 p-4 rounded-xl text-center font-bold text-sm border border-red-100 max-w-md">
          {error}
        </div>
      )}

      {/* Filters Toolbar */}
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Specialization</label>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
          >
            <option value="">All Specializations</option>
            <option value="Nurse">Registered Nurse</option>
            <option value="Physiotherapist">Physiotherapist</option>
            <option value="Elderly Attendant">Elderly Attendant</option>
            <option value="Post-Hospital Care">Post-Hospital Care</option>
          </select>
        </div>

        <div class="flex-1">
          <label class="block text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">Location / Area</label>
          <input
            type="text"
            value={serviceArea}
            onChange={(e) => setServiceArea(e.target.value)}
            placeholder="e.g. Connaught Place, Andheri"
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
          />
        </div>
      </div>

      {/* Listings Grid */}
      {caregivers.length === 0 ? (
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          <p class="text-slate-500 font-medium">No verified caregivers match your filter criteria.</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caregivers.map((caregiver) => (
            <div key={caregiver._id} class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-6 hover:shadow-md transition">
              <div class="space-y-4">
                {/* Profile Header */}
                <div class="flex gap-4 items-center">
                  <img
                    src={getUploadUrl(caregiver.profilePhoto) || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                    alt={caregiver.userId?.name}
                    class="w-16 h-16 rounded-2xl object-cover bg-slate-100"
                  />
                  <div>
                    <h3 class="text-lg font-extrabold text-slate-800 flex items-center gap-1.5">
                      <span>{caregiver.userId?.name}</span>
                      <ShieldCheck className="h-5 w-5 text-primary-500" title="Verified Professional" />
                    </h3>
                    <p class="text-primary-600 text-sm font-extrabold flex items-center gap-1 mt-0.5">
                      <Stethoscope className="h-4 w-4" />
                      <span>{caregiver.specialization}</span>
                    </p>
                  </div>
                </div>

                {/* Rating badge */}
                <div class="flex items-center gap-1.5 text-amber-500 font-bold text-sm bg-amber-50 px-3 py-1 rounded-xl w-fit">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <span>{caregiver.rating || 'New'}</span>
                  {caregiver.totalReviews > 0 && (
                    <span class="text-slate-400 font-medium">({caregiver.totalReviews} reviews)</span>
                  )}
                </div>

                {/* Details list */}
                <div class="space-y-2 text-sm text-slate-600 font-semibold pt-2 border-t border-slate-100">
                  <div class="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    <span>Experience: {caregiver.experience} Years</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>Service Area: {caregiver.serviceArea}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs">💲</span>
                    <span>Hourly Rate: <strong class="text-primary-600 font-extrabold text-sm">₹{caregiver.hourlyRate || 0}/hr</strong></span>
                  </div>
                  <div class="pt-2 border-t border-dashed border-slate-200">
                    <div class="flex items-center gap-1.5 text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>Availability:</span>
                    </div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      {caregiver.availability && caregiver.availability.length > 0 ? (
                        caregiver.availability.map((day) => (
                          <span key={day} class="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                            {day.substring(0, 3)}
                          </span>
                        ))
                      ) : (
                        <span class="text-xs text-red-500 italic">No days set</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Qualification card snippet */}
                <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600 font-semibold">
                  <p class="text-slate-400 uppercase font-bold tracking-wider mb-0.5">Qualification:</p>
                  <p class="text-slate-800 font-bold">{caregiver.qualification}</p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleBookClick(caregiver)}
                class="w-full bg-primary-500 hover:bg-primary-600 text-white font-extrabold py-3 rounded-xl transition shadow-sm"
              >
                Book caregiver
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Form Dialog Modal */}
      {selectedCaregiver && (
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full p-8 border border-slate-200 shadow-2xl relative space-y-6">
            <h3 class="text-2xl font-extrabold text-slate-800">
              Schedule with {selectedCaregiver.userId?.name}
            </h3>

            {bookingSuccess ? (
              <div class="text-center py-8 space-y-3">
                <span class="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full animate-bounce">
                  <Sparkles className="h-8 w-8" />
                </span>
                <h4 class="text-xl font-extrabold text-slate-800">Booking Requested!</h4>
                <p class="text-slate-500 font-medium text-sm">The caregiver has been notified to accept the request.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} class="space-y-4">
                {/* Patient Selection */}
                <div>
                  <label class="block text-slate-700 text-sm font-bold mb-1">Select Patient Profile</label>
                  {patients.length === 0 ? (
                    <div class="text-sm bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 font-medium">
                      You must register a patient profile first.{' '}
                      <a href="/patients" class="font-extrabold underline">Create one now</a>
                    </div>
                  ) : (
                    <select
                      value={bookingForm.patientId}
                      onChange={(e) => setBookingForm({ ...bookingForm, patientId: e.target.value })}
                      class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                    >
                      {patients.map(p => (
                        <option key={p._id} value={p._id}>{p.patientName}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Service Selection */}
                <div>
                  <label class="block text-slate-700 text-sm font-bold mb-1">Select Required Service</label>
                  <select
                    value={bookingForm.serviceId}
                    onChange={(e) => setBookingForm({ ...bookingForm, serviceId: e.target.value })}
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                  >
                    {services.map(s => (
                      <option key={s._id} value={s._id}>{s.serviceName} (₹{s.price} {s.duration})</option>
                    ))}
                  </select>
                </div>

                {/* Schedule Inputs */}
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-slate-700 text-sm font-bold mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.bookingDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                      class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                    />
                  </div>
                  <div>
                    <label class="block text-slate-700 text-sm font-bold mb-1">Start Time</label>
                    <input
                      type="time"
                      required
                      value={bookingForm.bookingTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, bookingTime: e.target.value })}
                      class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label class="block text-slate-700 text-sm font-bold mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.duration}
                    onChange={(e) => setBookingForm({ ...bookingForm, duration: e.target.value })}
                    placeholder="e.g. 4 hours, 2 days, 1 session"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                  />
                </div>

                {/* Action CTA */}
                <div class="pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={patients.length === 0}
                    class="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-extrabold py-3.5 rounded-xl shadow-sm transition disabled:opacity-50"
                  >
                    Confirm Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCaregiver(null)}
                    class="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-5 py-3 rounded-xl transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CaregiverListing;
