import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar, Phone, MapPin, ClipboardList, Check, X, Play, Award, FileText } from 'lucide-react';

const BookingRequests = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tab selection: requests (pending), active (accepted, ongoing), history (completed, cancelled)
  const [activeTab, setActiveTab] = useState('requests');

  // Care Note modal state
  const [noteBooking, setNoteBooking] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/api/bookings');
      setBookings(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Could not fetch bookings log.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/api/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      alert(err);
    }
  };

  const handleOpenNoteModal = (booking) => {
    setNoteBooking(booking);
    setNoteContent('');
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteContent) return;
    setSavingNote(true);
    try {
      await API.post('/api/care-notes', {
        bookingId: noteBooking._id,
        notes: noteContent,
      });
      alert('Care note added successfully.');
      setNoteBooking(null);
      setSavingNote(false);
    } catch (err) {
      alert(err);
      setSavingNote(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'requests') return b.status === 'pending';
    if (activeTab === 'active') return ['accepted', 'ongoing'].includes(b.status);
    return ['completed', 'cancelled'].includes(b.status);
  });

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Loading requests manager...</p>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-800">Job Bookings Manager</h1>
        <p class="text-slate-500 font-medium">Review pending patient requests, trigger active state shifts, and record session notes.</p>
      </div>

      {error && (
        <div class="bg-red-50 text-red-700 p-4 rounded-xl text-center font-bold text-sm border border-red-100 max-w-md">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div class="border-b border-slate-200 flex gap-6">
        {['requests', 'active', 'history'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            class={`pb-4 text-lg font-bold capitalize transition-colors ${
              activeTab === tab
                ? 'border-b-4 border-primary-500 text-primary-500'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'requests' ? 'New Requests' : tab === 'active' ? 'Active Jobs' : 'Job History'}
          </button>
        ))}
      </div>

      {/* Booking Cards List */}
      {filteredBookings.length === 0 ? (
        <div class="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center">
          <p class="text-slate-500 font-semibold text-lg">No appointments found in this category.</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => (
            <div key={booking._id} class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-6 hover:shadow-md transition">
              <div class="space-y-4">
                <div class="flex justify-between items-start">
                  <div>
                    <span class="text-xs uppercase tracking-wider font-extrabold text-slate-400">Patient Details</span>
                    <h3 class="text-xl font-extrabold text-slate-800 mt-1">{booking.patientId?.patientName}</h3>
                  </div>
                  <span class="text-xs font-bold bg-primary-50 text-primary-600 px-3 py-1 rounded-full uppercase">
                    {booking.status}
                  </span>
                </div>

                {/* Patient medical summary card */}
                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 text-sm font-semibold">
                  <div>
                    <p class="text-slate-400 uppercase font-bold text-xs">Medical Needs Summary:</p>
                    <p class="text-slate-700 font-bold">{booking.patientId?.medicalNeeds || 'General companion care'}</p>
                  </div>
                  <div class="pt-2 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs text-slate-500">
                    <span class="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.patientId?.address}</span>
                    </span>
                    <span class="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{booking.patientId?.userId?.phone || booking.patientId?.emergencyContact}</span>
                    </span>
                  </div>
                </div>

                {/* Service information */}
                <div class="flex justify-between items-center text-sm font-semibold border-t border-slate-100 pt-3 text-slate-500">
                  <span>Service: <strong class="text-slate-700 font-extrabold">{booking.serviceId?.serviceName}</strong></span>
                  <span class="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(booking.bookingDate).toLocaleDateString()} ({booking.bookingTime})</span>
                  </span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div class="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                {/* Accept/Reject request flow */}
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'accepted')}
                      class="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-extrabold px-4 py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>Accept Visit</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
                      class="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-1.5"
                    >
                      <X className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {/* Transition accepted to ongoing */}
                {booking.status === 'accepted' && (
                  <button
                    onClick={() => handleUpdateStatus(booking._id, 'ongoing')}
                    class="w-full bg-primary-500 hover:bg-primary-600 text-white font-extrabold px-4 py-3 rounded-xl text-sm transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Play className="h-4 w-4" />
                    <span>Start Care Session</span>
                  </button>
                )}

                {/* Transition ongoing to completed */}
                {booking.status === 'ongoing' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'completed')}
                      class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Award className="h-4 w-4" />
                      <span>Mark Session Completed</span>
                    </button>
                    <button
                      onClick={() => handleOpenNoteModal(booking)}
                      class="bg-primary-50 hover:bg-primary-100 text-primary-600 font-bold px-4 py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-1.5"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Add Care Note</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Care Note Modal */}
      {noteBooking && (
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full p-8 border border-slate-200 shadow-2xl space-y-6">
            <div>
              <h3 class="text-2xl font-extrabold text-slate-800">
                Log Session Care Note
              </h3>
              <p class="text-xs text-slate-400 font-bold uppercase mt-1">
                Patient: {noteBooking.patientId?.patientName}
              </p>
            </div>

            <form onSubmit={handleNoteSubmit} class="space-y-4">
              <div>
                <label class="block text-slate-700 text-sm font-bold mb-1">Observation Notes / Treatment Logs</label>
                <textarea
                  required
                  rows={6}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
                  placeholder="Record blood pressure, medication doses administered, food intake, mobility exercises, or caregiver observations..."
                ></textarea>
              </div>

              <div class="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={savingNote}
                  class="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-extrabold py-3.5 rounded-xl shadow-sm transition"
                >
                  {savingNote ? 'Logging notes...' : 'Save Care Note'}
                </button>
                <button
                  type="button"
                  onClick={() => setNoteBooking(null)}
                  class="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-5 py-3 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
