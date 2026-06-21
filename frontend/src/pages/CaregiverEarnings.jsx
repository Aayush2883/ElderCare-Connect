import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { IndianRupee, Award, Calendar, ChevronRight } from 'lucide-react';

const CaregiverEarnings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const { data } = await API.get('/api/bookings');
        setBookings(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchEarningsData();
  }, []);

  const completedVisits = bookings.filter(b => b.status === 'completed');
  const totalEarnings = completedVisits.reduce((sum, b) => sum + (b.serviceId?.price || 0), 0);
  const averageRate = completedVisits.length > 0 ? parseFloat((totalEarnings / completedVisits.length).toFixed(2)) : 0;

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Loading financial logs...</p>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <IndianRupee className="h-8 w-8 text-primary-500" />
          <span>Earnings Dashboard</span>
        </h1>
        <p class="text-slate-500 font-medium">Review your earnings details, completed patient visits, and revenue summaries.</p>
      </div>

      {/* Analytics Cards */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span class="p-3 bg-emerald-50 text-emerald-600 rounded-xl inline-block">
            <IndianRupee className="h-6 w-6" />
          </span>
          <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Total Earnings</p>
          <h3 class="text-3xl font-extrabold text-slate-800">₹{totalEarnings}</h3>
        </div>

        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span class="p-3 bg-primary-50 text-primary-600 rounded-xl inline-block">
            <Award className="h-6 w-6" />
          </span>
          <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Completed Visits</p>
          <h3 class="text-3xl font-extrabold text-slate-800">{completedVisits.length}</h3>
        </div>

        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span class="p-3 bg-indigo-50 text-indigo-600 rounded-xl inline-block">
            <IndianRupee className="h-6 w-6" />
          </span>
          <p class="text-slate-400 font-bold uppercase tracking-wider text-xs">Average Income / Session</p>
          <h3 class="text-3xl font-extrabold text-slate-800">₹{averageRate}</h3>
        </div>
      </div>

      {/* Completed visits detail list */}
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-8 py-6 border-b border-slate-100">
          <h2 class="text-2xl font-extrabold text-slate-800">Job Income Details</h2>
        </div>
        {completedVisits.length === 0 ? (
          <div class="p-12 text-center text-slate-500">
            No completed visits recorded to calculate payouts yet.
          </div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 font-extrabold">
                  <th class="px-8 py-4">Date</th>
                  <th class="px-8 py-4">Patient</th>
                  <th class="px-8 py-4">Service Performed</th>
                  <th class="px-8 py-4">Duration</th>
                  <th class="px-8 py-4">Payout Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm font-medium">
                {completedVisits.map((booking) => (
                  <tr key={booking._id} class="hover:bg-slate-50 transition">
                    <td class="px-8 py-4 text-slate-700">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td class="px-8 py-4 font-bold text-slate-800">
                      {booking.patientId?.patientName}
                    </td>
                    <td class="px-8 py-4 text-slate-650">
                      {booking.serviceId?.serviceName}
                    </td>
                    <td class="px-8 py-4 text-slate-500">
                      {booking.duration}
                    </td>
                    <td class="px-8 py-4 text-emerald-600 font-extrabold text-base">
                      +₹{booking.serviceId?.price || 0}
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

export default CaregiverEarnings;
