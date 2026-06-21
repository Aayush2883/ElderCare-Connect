import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Users, ShieldCheck, FileText, Calendar, Check, X, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [pendingCaregivers, setPendingCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [analyticsRes, caregiversRes] = await Promise.all([
        API.get('/api/bookings/admin/analytics'),
        API.get('/api/caregivers?verificationStatus=pending'),
      ]);
      setAnalytics(analyticsRes.data);
      setPendingCaregivers(caregiversRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (id, status) => {
    try {
      await API.put(`/api/caregivers/${id}/verify`, { status });
      fetchData();
    } catch (err) {
      alert(err);
    }
  };

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Loading administrative dashboard...</p>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome banner */}
      <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <h1 class="text-3xl font-extrabold text-slate-800">Admin Command Center</h1>
        <p class="text-slate-500 font-medium mt-1">Oversee agency operations, manage users database, verify credentials, and review bookings.</p>
      </div>

      {/* Analytics Summary */}
      {analytics && (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <span class="p-3 bg-primary-50 text-primary-600 rounded-xl">
              <Users className="h-6 w-6" />
            </span>
            <div>
              <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Total Customers</p>
              <h3 class="text-2xl font-extrabold text-slate-800">{analytics.totalUsers}</h3>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <span class="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Verified Caregivers</p>
              <h3 class="text-2xl font-extrabold text-slate-800">{analytics.verifiedCaregivers} / {analytics.totalCaregivers}</h3>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <span class="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Calendar className="h-6 w-6" />
            </span>
            <div>
              <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Pending Bookings</p>
              <h3 class="text-2xl font-extrabold text-slate-800">{analytics.pendingBookings}</h3>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <span class="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <FileText className="h-6 w-6" />
            </span>
            <div>
              <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Completed Visits</p>
              <h3 class="text-2xl font-extrabold text-slate-800">{analytics.completedBookings}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Admin Shortcuts */}
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Link to="/admin/users" class="bg-white p-4 rounded-xl border border-slate-200 hover:border-primary-500 text-center font-bold text-slate-700 shadow-sm transition">
          Users List
        </Link>
        <Link to="/admin/caregivers" class="bg-white p-4 rounded-xl border border-slate-200 hover:border-primary-500 text-center font-bold text-slate-700 shadow-sm transition">
          Caregivers Queue
        </Link>
        <Link to="/admin/services" class="bg-white p-4 rounded-xl border border-slate-200 hover:border-primary-500 text-center font-bold text-slate-700 shadow-sm transition">
          Services CRUD
        </Link>
        <Link to="/admin/bookings" class="bg-white p-4 rounded-xl border border-slate-200 hover:border-primary-500 text-center font-bold text-slate-700 shadow-sm transition">
          Bookings Register
        </Link>
        <Link to="/admin/analytics" class="bg-white p-4 rounded-xl border border-slate-200 hover:border-primary-500 text-center font-bold text-slate-700 shadow-sm transition">
          Full Analytics
        </Link>
      </div>

      {/* Verification queue card */}
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h2 class="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-amber-500" />
            <span>Caregiver Verification Queue ({pendingCaregivers.length})</span>
          </h2>
          <Link to="/admin/caregivers" class="text-primary-500 hover:text-primary-600 font-bold text-sm">
            View All Caregivers
          </Link>
        </div>

        {pendingCaregivers.length === 0 ? (
          <div class="p-8 text-center text-slate-500 font-semibold">
            Verification queue is completely clear. No caregivers waiting for review!
          </div>
        ) : (
          <div class="divide-y divide-slate-100">
            {pendingCaregivers.map((cg) => (
              <div key={cg._id} class="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition">
                <div class="space-y-1">
                  <h4 class="text-lg font-extrabold text-slate-800">{cg.userId?.name}</h4>
                  <p class="text-xs font-bold text-primary-600 uppercase tracking-wider">{cg.specialization} • Exp: {cg.experience} yrs</p>
                  <p class="text-sm font-semibold text-slate-500">{cg.qualification}</p>
                  <p class="text-xs text-slate-400 font-bold">Email: {cg.userId?.email} | Service Area: {cg.serviceArea}</p>
                </div>
                <div class="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleVerify(cg._id, 'verified')}
                    class="flex-1 md:flex-initial bg-primary-500 hover:bg-primary-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve Credentials</span>
                  </button>
                  <button
                    onClick={() => handleVerify(cg._id, 'rejected')}
                    class="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
