import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { User, Calendar, Search, Activity, FileText, Star } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewedBookings, setReviewedBookings] = useState([]);
  const [selectedReviewBooking, setSelectedReviewBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

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
      
      // Refresh dashboard data
      const [patientsRes, bookingsRes, reviewsRes] = await Promise.all([
        API.get('/api/patients'),
        API.get('/api/bookings'),
        API.get('/api/reviews'),
      ]);
      setPatients(patientsRes.data);
      setBookings(bookingsRes.data);
      setReviewedBookings(reviewsRes.data.map(r => r.bookingId));
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [patientsRes, bookingsRes, reviewsRes] = await Promise.all([
          API.get('/api/patients'),
          API.get('/api/bookings'),
          API.get('/api/reviews'),
        ]);
        setPatients(patientsRes.data);
        setBookings(bookingsRes.data);
        setReviewedBookings(reviewsRes.data.map(r => r.bookingId));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user dashboard data:', err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-800">Hello, {user.name}</h1>
          <p class="text-slate-500 font-medium mt-1">Manage elder care services and schedule patient assistance visits easily.</p>
        </div>
        <div class="flex gap-3 w-full md:w-auto">
          <Link
            to="/caregivers"
            class="flex-1 md:flex-initial text-center bg-primary-500 hover:bg-primary-600 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-sm transition"
          >
            Find a Caregiver
          </Link>
        </div>
      </div>

      {/* Navigation Quick Cards */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/patients"
          class="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary-500 shadow-sm transition hover:shadow duration-200 flex items-center gap-4"
        >
          <span class="p-4 rounded-xl bg-primary-50 text-primary-600">
            <User className="h-6 w-6" />
          </span>
          <div>
            <h3 class="font-extrabold text-slate-800 text-lg">Patient Profiles</h3>
            <p class="text-slate-500 text-sm font-medium">{patients.length} Registered Patients</p>
          </div>
        </Link>

        <Link
          to="/caregivers"
          class="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary-500 shadow-sm transition hover:shadow duration-200 flex items-center gap-4"
        >
          <span class="p-4 rounded-xl bg-accent-50 text-accent-600">
            <Search className="h-6 w-6" />
          </span>
          <div>
            <h3 class="font-extrabold text-slate-800 text-lg">Browse Caregivers</h3>
            <p class="text-slate-500 text-sm font-medium">Find nurses & physiotherapists</p>
          </div>
        </Link>

        <Link
          to="/bookings"
          class="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary-500 shadow-sm transition hover:shadow duration-200 flex items-center gap-4"
        >
          <span class="p-4 rounded-xl bg-indigo-50 text-indigo-600">
            <Calendar className="h-6 w-6" />
          </span>
          <div>
            <h3 class="font-extrabold text-slate-800 text-lg">Manage Bookings</h3>
            <p class="text-slate-500 text-sm font-medium">
              {bookings.filter(b => ['pending', 'accepted', 'ongoing'].includes(b.status)).length} Active Bookings
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Bookings Schedule */}
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h2 class="text-2xl font-extrabold text-slate-800">Recent Care Appointments</h2>
          <Link to="/bookings" class="text-primary-500 hover:text-primary-600 font-bold text-sm">
            View All Bookings
          </Link>
        </div>
        {bookings.length === 0 ? (
          <div class="p-8 text-center space-y-4">
            <p class="text-slate-500 font-medium text-lg">No appointments scheduled yet.</p>
            <Link
              to="/caregivers"
              class="inline-block bg-primary-50 text-primary-600 font-extrabold px-5 py-2.5 rounded-lg hover:bg-primary-100 transition"
            >
              Book Your First Caregiver
            </Link>
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th class="px-8 py-4">Patient</th>
                  <th class="px-8 py-4">Caregiver</th>
                  <th class="px-8 py-4">Service</th>
                  <th class="px-8 py-4">Date & Time</th>
                  <th class="px-8 py-4">Status</th>
                  <th class="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm font-medium">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id} class="hover:bg-slate-50 transition">
                    <td class="px-8 py-4 font-bold text-slate-800">
                      {booking.patientId?.patientName || 'Ramesh Mehta'}
                    </td>
                    <td class="px-8 py-4">
                      {booking.caregiverId?.userId?.name || 'Priya Sharma'}
                      <span class="text-xs text-slate-400 block font-bold uppercase">
                        {booking.caregiverId?.specialization || 'Nurse'}
                      </span>
                      {['accepted', 'ongoing', 'completed'].includes(booking.status) && booking.caregiverId?.userId?.phone && (
                        <span class="text-xs text-primary-500 block font-extrabold mt-0.5">
                          📞 {booking.caregiverId.userId.phone}
                        </span>
                      )}
                    </td>
                    <td class="px-8 py-4 text-slate-700">
                      {booking.serviceId?.serviceName || 'Nursing Care'}
                    </td>
                    <td class="px-8 py-4">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                      <span class="text-xs text-slate-400 block font-semibold">{booking.bookingTime}</span>
                    </td>
                    <td class="px-8 py-4">
                      <span class={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td class="px-8 py-4 text-right">
                      {booking.status === 'completed' && (
                        reviewedBookings.includes(booking._id) ? (
                          <span class="text-xs text-slate-400 font-semibold italic">Reviewed ✓</span>
                        ) : (
                          <button
                            onClick={() => handleOpenReview(booking)}
                            class="bg-accent-50 hover:bg-accent-100 text-accent-600 font-extrabold px-3 py-1.5 rounded-lg text-xs transition inline-flex items-center gap-1"
                          >
                            <Star className="h-3.5 w-3.5 fill-accent-600 text-accent-600" />
                            <span>Rate</span>
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Dialog Modal */}
      {selectedReviewBooking && (
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl max-w-md w-full p-8 border border-slate-200 shadow-2xl space-y-6">
            <h3 class="text-2xl font-extrabold text-slate-800">
              Rate Caregiver: {selectedReviewBooking.caregiverId?.userId?.name || 'Assigned Specialist'}
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
    </div>
  );
};

export default UserDashboard;
