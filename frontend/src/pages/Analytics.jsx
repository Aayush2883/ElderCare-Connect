import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { TrendingUp, Users, Calendar, Award, CheckCircle2 } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await API.get('/api/bookings/admin/analytics');
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Loading system analytics reports...</p>
      </div>
    );
  }

  // Calculate highest bookings value to scale the monthly CSS chart dynamically
  const maxBookings = stats?.monthlyBookingStats?.length > 0 
    ? Math.max(...stats.monthlyBookingStats.map(s => s.bookings)) 
    : 10;

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-primary-500" />
          <span>Platform Analytics Reports</span>
        </h1>
        <p class="text-slate-500 font-medium">Verify system growth rates, caregiver performance ratings, and monthly booking activity summaries.</p>
      </div>

      {stats && (
        <>
          {/* Key Metrics Grid */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span class="p-3 bg-primary-50 text-primary-600 rounded-xl inline-block">
                <Users className="h-6 w-6" />
              </span>
              <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Total Customers</p>
              <h3 class="text-3xl font-extrabold text-slate-800">{stats.totalUsers}</h3>
              <p class="text-xs text-slate-400 font-semibold">Registered family accounts</p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span class="p-3 bg-indigo-50 text-indigo-600 rounded-xl inline-block">
                <CheckCircle2 className="h-6 w-6" />
              </span>
              <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Caregivers Registered</p>
              <h3 class="text-3xl font-extrabold text-slate-800">{stats.totalCaregivers}</h3>
              <p class="text-xs text-emerald-600 font-bold">{stats.verifiedCaregivers} Verified & Approved</p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span class="p-3 bg-amber-50 text-amber-600 rounded-xl inline-block">
                <Calendar className="h-6 w-6" />
              </span>
              <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Total Bookings Logs</p>
              <h3 class="text-3xl font-extrabold text-slate-800">{stats.totalBookings}</h3>
              <p class="text-xs text-slate-400 font-semibold">Scheduled service appointments</p>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span class="p-3 bg-emerald-50 text-emerald-600 rounded-xl inline-block">
                <Award className="h-6 w-6" />
              </span>
              <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Caregiver Avg Rating</p>
              <h3 class="text-3xl font-extrabold text-slate-800">{stats.avgCaregiverRating || 'No ratings'}</h3>
              <p class="text-xs text-slate-400 font-semibold">Across all reviewed providers</p>
            </div>
          </div>

          {/* Graphical Analytics Section */}
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Monthly Chart Card */}
            <div class="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 class="text-xl font-extrabold text-slate-800">Monthly Bookings Distribution</h3>
              
              {stats.monthlyBookingStats.length === 0 ? (
                <p class="text-slate-500 font-semibold py-20 text-center">No scheduling records found to chart.</p>
              ) : (
                <div class="space-y-6 pt-4">
                  {/* Visual Bar Grid */}
                  <div class="flex items-end justify-between h-48 border-b border-slate-250 pb-2">
                    {stats.monthlyBookingStats.map((item, idx) => {
                      const heightPercent = Math.max(5, (item.bookings / maxBookings) * 100);
                      return (
                        <div key={idx} class="flex flex-col items-center flex-1 group">
                          {/* Value bubble */}
                          <span class="text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                            {item.bookings}
                          </span>
                          {/* Visual CSS block bar */}
                          <div
                            style={{ height: `${heightPercent}%` }}
                            class="w-8 sm:w-12 bg-primary-500 group-hover:bg-primary-600 rounded-t-lg transition-all duration-300"
                          ></div>
                          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3">
                            {item.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bookings Status breakdown card */}
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 class="text-xl font-extrabold text-slate-800">Workflows Status Breakdown</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center text-sm font-semibold">
                  <span class="text-slate-500 flex items-center gap-2">
                    <span class="w-3.5 h-3.5 bg-emerald-500 rounded-full"></span>
                    Completed Bookings
                  </span>
                  <span class="text-slate-800 font-bold">{stats.completedBookings}</span>
                </div>
                <div class="flex justify-between items-center text-sm font-semibold">
                  <span class="text-slate-500 flex items-center gap-2">
                    <span class="w-3.5 h-3.5 bg-amber-500 rounded-full"></span>
                    Pending Confirmation
                  </span>
                  <span class="text-slate-800 font-bold">{stats.pendingBookings}</span>
                </div>
                <div class="flex justify-between items-center text-sm font-semibold border-t border-slate-100 pt-3">
                  <span class="text-slate-600 font-bold">Total Platform Bookings</span>
                  <span class="text-slate-800 font-extrabold text-base">{stats.totalBookings}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
