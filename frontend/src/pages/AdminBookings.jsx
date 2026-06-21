import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar, Trash2, Search, ClipboardList } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/api/bookings');
      setBookings(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this booking record?')) return;
    try {
      await API.delete(`/api/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      alert(err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const patientName = b.patientId?.patientName || '';
    const caregiverName = b.caregiverId?.userId?.name || '';
    const serviceName = b.serviceId?.serviceName || '';
    
    const matchesSearch =
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caregiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter ? b.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

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
        <p class="text-slate-600 font-medium">Loading all scheduled bookings...</p>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <ClipboardList className="h-8 w-8 text-primary-500" />
          <span>Scheduled Bookings Registry</span>
        </h1>
        <p class="text-slate-500 font-medium">Monitor all platform healthcare appointments, filter statuses, and override schedule records.</p>
      </div>

      {/* Filter toolbar */}
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient, caregiver or service name..."
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
          />
        </div>

        <div class="w-full md:w-64">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table registry */}
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div class="p-8 text-center text-slate-500">No bookings match filters.</div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 font-extrabold">
                  <th class="px-8 py-4">Patient Name</th>
                  <th class="px-8 py-4">Caregiver</th>
                  <th class="px-8 py-4">Service</th>
                  <th class="px-8 py-4">Scheduled Date</th>
                  <th class="px-8 py-4">Duration</th>
                  <th class="px-8 py-4">Status</th>
                  <th class="px-8 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm font-medium">
                {filteredBookings.map((b) => (
                  <tr key={b._id} class="hover:bg-slate-50 transition">
                    <td class="px-8 py-4 font-bold text-slate-800">{b.patientId?.patientName}</td>
                    <td class="px-8 py-4 text-slate-650">
                      {b.caregiverId?.userId?.name || 'Unassigned'}
                      <span class="block text-[10px] text-slate-400 font-bold uppercase">{b.caregiverId?.specialization}</span>
                    </td>
                    <td class="px-8 py-4 text-slate-700">{b.serviceId?.serviceName}</td>
                    <td class="px-8 py-4 text-slate-600">
                      {new Date(b.bookingDate).toLocaleDateString()}
                      <span class="block text-[10px] text-slate-400 font-semibold">{b.bookingTime}</span>
                    </td>
                    <td class="px-8 py-4 text-slate-500">{b.duration}</td>
                    <td class="px-8 py-4">
                      <span class={`px-2.5 py-1 rounded-full border text-xs font-extrabold uppercase ${getStatusColor(b.status)}`}>
                        {b.status}
                      </span>
                    </td>
                    <td class="px-8 py-4 text-center">
                      <button
                        onClick={() => handleDelete(b._id)}
                        class="p-2 text-slate-400 hover:text-red-500 rounded-xl transition"
                        title="Delete Record"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
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

export default AdminBookings;
