import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { IndianRupee, Star, Calendar, Clock, ClipboardList, Settings } from 'lucide-react';

const CaregiverDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [skipped, setSkipped] = useState(() => {
    if (!user) return false;
    return localStorage.getItem(`skip_upload_${user._id}`) === 'true';
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const handlePdfUpload = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      setUploadError('Please select a PDF file first');
      return;
    }
    if (pdfFile.type !== 'application/pdf') {
      setUploadError('Only PDF documents are allowed');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('degreeDocument', pdfFile);

    try {
      const { data } = await API.post('/api/auth/upload-degree', formData);
      setUploadSuccess('Document uploaded successfully!');
      if (user) {
        localStorage.removeItem(`skip_upload_${user._id}`);
      }
      setSkipped(true);
      // Update local profile state to unlock the dashboard
      setProfile(prev => ({
        ...prev,
        degreeDocument: data.degreeDocument,
        qualification: 'Degree Uploaded'
      }));
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    if (user) {
      localStorage.setItem(`skip_upload_${user._id}`, 'true');
    }
    setSkipped(true);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookingsRes, profileRes] = await Promise.all([
          API.get('/api/bookings'),
          API.get('/api/auth/profile')
        ]);
        setBookings(bookingsRes.data);
        setProfile(profileRes.data.caregiverProfile);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Earnings calculation: sum service pricing for completed bookings
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.serviceId?.price || 0), 0);

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
        <p class="text-slate-600 font-medium">Loading caregiver console...</p>
      </div>
    );
  }

  if (profile && !profile.degreeDocument && !skipped) {
    return (
      <div class="max-w-xl mx-auto px-4 py-16">
        <div class="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div class="text-center space-y-2">
            <h2 class="text-2xl font-extrabold text-slate-800">Complete Your Registration</h2>
            <p class="text-slate-500 font-medium">Please upload your qualification or degree document in PDF format to complete your profile.</p>
          </div>

          {uploadError && (
            <div class="bg-red-50 text-red-700 p-4 rounded-xl text-center font-bold text-sm border border-red-100">
              {uploadError}
            </div>
          )}

          {uploadSuccess && (
            <div class="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center font-bold text-sm border border-emerald-100">
              {uploadSuccess}
            </div>
          )}

          <form onSubmit={handlePdfUpload} class="space-y-4">
            <div>
              <label htmlFor="degreeDocument" class="block text-slate-700 text-sm font-bold mb-2">
                Degree / Certification Document (PDF only, max 5MB)
              </label>
              <div class="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-primary-500 transition cursor-pointer relative">
                <input
                  id="degreeDocument"
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => {
                    setPdfFile(e.target.files[0]);
                    setUploadError(null);
                  }}
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div class="space-y-2">
                  <div class="text-slate-400 text-3xl">📄</div>
                  <p class="text-slate-650 font-bold text-sm">
                    {pdfFile ? pdfFile.name : 'Click to select or drag and drop PDF file'}
                  </p>
                  <p class="text-slate-400 text-xs font-semibold">
                    {pdfFile ? `${(pdfFile.size / (1024 * 1024)).toFixed(2)} MB` : 'PDF format only'}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              class="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-extrabold text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-50"
            >
              {uploading ? 'Uploading your document...' : 'Upload & Complete Registration'}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              class="w-full flex justify-center py-4 px-4 border border-slate-200 rounded-xl shadow-sm text-lg font-extrabold text-slate-650 bg-slate-50 hover:bg-slate-100 focus:outline-none transition mt-2"
            >
              Skip for Now
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-extrabold text-slate-800">Welcome, {user.name}</h1>
            {profile && (
              <span class={`text-xs font-bold px-3 py-1 rounded-full uppercase border ${
                profile.verificationStatus === 'verified'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : profile.verificationStatus === 'rejected'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                Verification: {profile.verificationStatus === 'verified' ? 'Verified' : 'Not Verified'}
              </span>
            )}
          </div>
          <p class="text-slate-500 font-medium">Monitor patient bookings, daily schedules, and analyze completed job earnings.</p>
        </div>
        
        <div class="flex gap-3 w-full md:w-auto">
          <Link
            to="/caregiver/requests"
            class="flex-1 md:flex-initial text-center bg-primary-500 hover:bg-primary-600 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-sm transition"
          >
            Manage Requests
          </Link>
        </div>
      </div>

      {/* Verification Warning Alert */}
      {profile && !profile.degreeDocument && (
        <div class="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="space-y-1">
            <h4 class="font-extrabold text-amber-850 text-lg flex items-center gap-2">
              <span>⚠️ Profile Not Verified</span>
            </h4>
            <p class="text-amber-700 font-semibold text-sm">
              Please upload your qualification or degree document in PDF format to get verified by the admin. Until verified, your profile will not be shown to patients.
            </p>
          </div>
          <button
            onClick={() => {
              if (user) {
                localStorage.removeItem(`skip_upload_${user._id}`);
              }
              setSkipped(false);
            }}
            class="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-5 py-3 rounded-xl text-sm transition shadow-sm whitespace-nowrap w-full sm:w-auto text-center"
          >
            Upload Now
          </button>
        </div>
      )}

      {/* Analytics Widgets */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Earnings Card */}
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span class="p-3 bg-emerald-50 text-emerald-600 rounded-xl inline-block">
            <IndianRupee className="h-6 w-6" />
          </span>
          <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Total Income</p>
          <h3 class="text-3xl font-extrabold text-slate-800">₹{totalEarnings}</h3>
        </div>

        {/* Completed Visits Card */}
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span class="p-3 bg-primary-50 text-primary-600 rounded-xl inline-block">
            <Calendar className="h-6 w-6" />
          </span>
          <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Completed Services</p>
          <h3 class="text-3xl font-extrabold text-slate-800">{completedBookings.length}</h3>
        </div>

        {/* Rating Card */}
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span class="p-3 bg-amber-50 text-amber-500 rounded-xl inline-block">
            <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
          </span>
          <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Average Rating</p>
          <h3 class="text-3xl font-extrabold text-slate-800">{profile?.rating || 'New'}</h3>
        </div>

        {/* Pending Requests Card */}
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span class="p-3 bg-amber-50 text-amber-600 rounded-xl inline-block">
            <Clock className="h-6 w-6" />
          </span>
          <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Pending Requests</p>
          <h3 class="text-3xl font-extrabold text-slate-800">
            {bookings.filter(b => b.status === 'pending').length}
          </h3>
        </div>
      </div>

      {/* Navigation Quick Shortcuts */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/caregiver/profile"
          class="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary-500 shadow-sm transition hover:shadow flex items-center gap-4"
        >
          <span class="p-4 rounded-xl bg-slate-100 text-slate-600">
            <Settings className="h-6 w-6" />
          </span>
          <div>
            <h3 class="font-extrabold text-slate-800 text-lg">Edit Profile</h3>
            <p class="text-slate-500 text-sm font-medium">Specialization & qualification</p>
          </div>
        </Link>

        <Link
          to="/caregiver/availability"
          class="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary-500 shadow-sm transition hover:shadow flex items-center gap-4"
        >
          <span class="p-4 rounded-xl bg-indigo-50 text-indigo-600">
            <Clock className="h-6 w-6" />
          </span>
          <div>
            <h3 class="font-extrabold text-slate-800 text-lg">Availability Calendar</h3>
            <p class="text-slate-500 text-sm font-medium">Manage shifts & active days</p>
          </div>
        </Link>

        <Link
          to="/caregiver/requests"
          class="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary-500 shadow-sm transition hover:shadow flex items-center gap-4"
        >
          <span class="p-4 rounded-xl bg-primary-50 text-primary-600">
            <ClipboardList className="h-6 w-6" />
          </span>
          <div>
            <h3 class="font-extrabold text-slate-800 text-lg">Manage Bookings</h3>
            <p class="text-slate-500 text-sm font-medium">Accept or reject requests</p>
          </div>
        </Link>
      </div>

      {/* Active Assignments */}
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h2 class="text-2xl font-extrabold text-slate-800">Your Active & Upcoming Visits</h2>
          <Link to="/caregiver/requests" class="text-primary-500 hover:text-primary-600 font-bold text-sm">
            View Requests Manager
          </Link>
        </div>
        {bookings.length === 0 ? (
          <div class="p-8 text-center text-slate-500">
            No active schedules mapped to your caregiver account.
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th class="px-8 py-4">Patient</th>
                  <th class="px-8 py-4">Service</th>
                  <th class="px-8 py-4">Schedule</th>
                  <th class="px-8 py-4">Phone</th>
                  <th class="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm font-medium">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id} class="hover:bg-slate-50 transition">
                    <td class="px-8 py-4">
                      <p class="font-bold text-slate-850">{booking.patientId?.patientName}</p>
                      <span class="text-xs text-slate-400 block font-semibold">{booking.patientId?.address}</span>
                    </td>
                    <td class="px-8 py-4 text-slate-700">
                      {booking.serviceId?.serviceName}
                    </td>
                    <td class="px-8 py-4">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                      <span class="text-xs text-slate-400 block font-semibold">{booking.bookingTime} ({booking.duration})</span>
                    </td>
                    <td class="px-8 py-4 text-slate-600">
                      {booking.patientId?.userId?.phone || booking.patientId?.emergencyContact}
                    </td>
                    <td class="px-8 py-4">
                      <span class={`px-3 py-1 rounded-full border text-xs font-bold uppercase ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaregiverDashboard;
