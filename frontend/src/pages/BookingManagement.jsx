import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar, Star, FileText, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review states
  const [selectedReviewBooking, setSelectedReviewBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewedBookings, setReviewedBookings] = useState([]);

  // Care Notes states
  const [selectedNotesBooking, setSelectedNotesBooking] = useState(null);
  const [careNotes, setCareNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);

  const fetchBookings = async () => {
    try {
      const [bookingsRes, reviewsRes] = await Promise.all([
        API.get('/api/bookings'),
        API.get('/api/reviews'),
      ]);
      setBookings(bookingsRes.data);
      setReviewedBookings(reviewsRes.data.map(r => r.bookingId));
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Could not fetch bookings logs.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/api/bookings/${id}/status`, { status: 'cancelled' });
      fetchBookings();
    } catch (err) {
      alert(err);
    }
  };

  const handleOpenReview = (booking) => {
    setSelectedReviewBooking(booking);
    setReviewForm({ rating: 5, comment: '' });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/reviews', {
        bookingId: selectedReviewBooking._id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      alert('Thank you! Your review has been submitted.');
      setSelectedReviewBooking(null);
      fetchBookings();
    } catch (err) {
      alert(err);
    }
  };

  const handleViewNotes = async (booking) => {
    setSelectedNotesBooking(booking);
    setLoadingNotes(true);
    try {
      const { data } = await API.get(`/api/care-notes/booking/${booking._id}`);
      setCareNotes(data);
      setLoadingNotes(false);
    } catch (err) {
      console.error(err);
      setCareNotes([]);
      setLoadingNotes(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-amber-500" />;
      case 'accepted': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'ongoing': return <Activity className="h-5 w-5 text-purple-500" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      default: return <XCircle className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'accepted': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'ongoing': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'completed': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Loading your bookings log...</p>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-800">Booking Management</h1>
        <p class="text-slate-500 font-medium">Track scheduled visits, read care updates left by caregivers, and leave performance reviews.</p>
      </div>

      {error && (
        <div class="bg-red-50 text-red-700 p-4 rounded-xl text-center font-bold text-sm border border-red-100 max-w-md">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          <p class="text-slate-500 font-medium">No bookings logged yet.</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-6 hover:shadow-md transition">
              <div class="space-y-4">
                {/* Header */}
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <span class={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <h3 class="text-xl font-extrabold text-slate-800 mt-2">
                      {booking.serviceId?.serviceName || 'Eldercare service'}
                    </h3>
                  </div>
                  <span class="text-slate-400 font-bold">
                    ₹{booking.serviceId?.price || 0}
                  </span>
                </div>

                {/* Details snippet */}
                <div class="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-semibold">
                  <div>
                    <p class="text-slate-400 uppercase font-bold text-xs">Patient:</p>
                    <p class="text-slate-800 font-bold">{booking.patientId?.patientName}</p>
                  </div>
                  <div>
                    <p class="text-slate-400 uppercase font-bold text-xs">Caregiver:</p>
                    <p class="text-slate-800 font-bold">
                      {booking.caregiverId?.userId?.name || 'Assigned Specialist'}
                      {['accepted', 'ongoing', 'completed'].includes(booking.status) && booking.caregiverId?.userId?.phone && (
                        <span class="text-xs text-primary-500 block font-extrabold mt-0.5">
                          📞 {booking.caregiverId.userId.phone}
                        </span>
                      )}
                    </p>
                  </div>
                  <div class="col-span-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span class="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(booking.bookingDate).toLocaleDateString()} at {booking.bookingTime}</span>
                    </span>
                    <span>Duration: {booking.duration}</span>
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div class="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                {/* Cancel option */}
                {['pending', 'accepted'].includes(booking.status) && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    class="bg-red-50 hover:bg-red-100 text-red-600 font-extrabold px-4 py-2.5 rounded-xl text-sm transition"
                  >
                    Cancel Booking
                  </button>
                )}

                {/* Care Notes option */}
                {['ongoing', 'completed'].includes(booking.status) && (
                  <button
                    onClick={() => handleViewNotes(booking)}
                    class="bg-primary-50 hover:bg-primary-100 text-primary-600 font-extrabold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-1.5"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Care Notes</span>
                  </button>
                )}

                {/* Review option */}
                {booking.status === 'completed' && (
                  reviewedBookings.includes(booking._id) ? (
                    <span class="text-xs text-slate-400 font-semibold italic ml-auto pt-2">Reviewed ✓</span>
                  ) : (
                    <button
                      onClick={() => handleOpenReview(booking)}
                      class="bg-accent-50 hover:bg-accent-100 text-accent-600 font-extrabold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-1.5 ml-auto"
                    >
                      <Star className="h-4 w-4" />
                      <span>Write Review</span>
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Dialog Modal */}
      {selectedReviewBooking && (
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full p-8 border border-slate-200 shadow-2xl space-y-6">
            <h3 class="text-2xl font-extrabold text-slate-800">
              Review {selectedReviewBooking.caregiverId?.userId?.name}
            </h3>

            <form onSubmit={handleReviewSubmit} class="space-y-4">
              <div>
                <label class="block text-slate-700 text-sm font-bold mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                  <option value="4">⭐⭐⭐⭐ (4/5 Good)</option>
                  <option value="3">⭐⭐⭐ (3/5 Average)</option>
                  <option value="2">⭐⭐ (2/5 Poor)</option>
                  <option value="1">⭐ (1/5 Terrible)</option>
                </select>
              </div>

              <div>
                <label class="block text-slate-700 text-sm font-bold mb-1">Your Review Comment</label>
                <textarea
                  required
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
                  placeholder="Share details of your experience to help other families..."
                ></textarea>
              </div>

              <div class="pt-4 flex gap-3">
                <button
                  type="submit"
                  class="flex-1 bg-accent-500 hover:bg-accent-600 text-white font-extrabold py-3.5 rounded-xl shadow-sm transition"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReviewBooking(null)}
                  class="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-5 py-3 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Care Notes Dialog Modal */}
      {selectedNotesBooking && (
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full p-8 border border-slate-200 shadow-2xl space-y-6">
            <div class="border-b border-slate-100 pb-4">
              <h3 class="text-2xl font-extrabold text-slate-800">
                Care Notes Log
              </h3>
              <p class="text-xs text-slate-400 font-bold uppercase mt-1">
                For booking: {selectedNotesBooking.serviceId?.serviceName} ({selectedNotesBooking.patientId?.patientName})
              </p>
            </div>

            <div class="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {loadingNotes ? (
                <p class="text-center text-slate-500">Retrieving caregiver notes...</p>
              ) : careNotes.length === 0 ? (
                <p class="text-center text-slate-500 font-semibold py-8">No notes logged for this session yet.</p>
              ) : (
                careNotes.map((note) => (
                  <div key={note._id} class="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm">
                    <p class="text-slate-700 leading-relaxed font-semibold">{note.notes}</p>
                    <span class="text-xs text-slate-400 block font-bold uppercase mt-3">
                      Logged on: {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setSelectedNotesBooking(null)}
              class="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3.5 rounded-xl transition"
            >
              Close Notes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
