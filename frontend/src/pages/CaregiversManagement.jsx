import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { ShieldAlert, Check, X, Search, Info } from 'lucide-react';
import { getUploadUrl } from '../utils/url';

const CaregiversManagement = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCaregivers = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter) queryParams.append('verificationStatus', statusFilter);
      // Fetch caregivers. Admin role gets all of them including pending/rejected.
      const { data } = await API.get(`/api/caregivers?${queryParams.toString()}`);
      setCaregivers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaregivers();
  }, [statusFilter]);

  const handleVerify = async (id, status) => {
    try {
      await API.put(`/api/caregivers/${id}/verify`, { status });
      fetchCaregivers();
    } catch (err) {
      alert(err);
    }
  };

  const filteredCaregivers = caregivers.filter((c) => {
    const name = c.userId?.name || '';
    const email = c.userId?.email || '';
    const specialization = c.specialization || '';
    
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Loading caregivers base...</p>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <ShieldAlert className="h-8 w-8 text-primary-500" />
          <span>Caregiver Accounts & Verification</span>
        </h1>
        <p class="text-slate-500 font-medium">Verify qualifications, accept applications, or reject credentials logs.</p>
      </div>

      {/* Filter toolbar */}
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search caregiver name, email, specialization..."
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
          />
        </div>

        <div class="w-full md:w-64">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-700"
          >
            <option value="">All Verification Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="verified">Verified Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Grid of caregivers */}
      {filteredCaregivers.length === 0 ? (
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
          <p class="text-slate-500 font-medium">No caregivers found matching criteria.</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCaregivers.map((cg) => (
            <div key={cg._id} class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-6 hover:shadow-md transition">
              <div class="space-y-4">
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="text-xl font-extrabold text-slate-800">{cg.userId?.name}</h3>
                    <p class="text-xs font-bold text-primary-600 uppercase mt-0.5">{cg.specialization}</p>
                  </div>
                  <span class={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase ${getStatusBadge(cg.verificationStatus)}`}>
                    {cg.verificationStatus}
                  </span>
                </div>

                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-semibold space-y-2">
                  <p class="text-xs text-slate-400 uppercase font-bold">Credential Details:</p>
                  <p class="text-slate-700 font-extrabold">{cg.qualification || 'No document uploaded yet.'}</p>
                  {cg.degreeDocument && (
                    <a
                      href={getUploadUrl(cg.degreeDocument)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-600 font-bold text-xs mt-1"
                    >
                      📄 View Degree Document
                    </a>
                  )}
                  <div class="pt-2 border-t border-slate-200 grid grid-cols-3 gap-2 text-xs text-slate-500">
                    <div>
                      <span class="block text-slate-400 uppercase font-bold text-[10px]">Experience:</span>
                      <span class="text-slate-800 font-bold">{cg.experience} Years</span>
                    </div>
                    <div>
                      <span class="block text-slate-400 uppercase font-bold text-[10px]">Service Area:</span>
                      <span class="text-slate-800 font-bold">{cg.serviceArea}</span>
                    </div>
                    <div>
                      <span class="block text-slate-400 uppercase font-bold text-[10px]">Hourly Rate:</span>
                      <span class="text-slate-800 font-bold">₹{cg.hourlyRate || 0}/hr</span>
                    </div>
                  </div>
                </div>

                <div class="text-xs text-slate-500 font-semibold space-y-1">
                  <div>Email: <span class="text-slate-850 font-bold">{cg.userId?.email}</span></div>
                  <div>Phone: <span class="text-slate-850 font-bold">{cg.userId?.phone}</span></div>
                  <div>Available Days: <span class="text-slate-850 font-bold">{(cg.availability || []).join(', ')}</span></div>
                </div>
              </div>

              {/* Verify Actions */}
              <div class="flex gap-2 pt-4 border-t border-slate-100">
                {cg.verificationStatus !== 'verified' && (
                  <button
                    onClick={() => handleVerify(cg._id, 'verified')}
                    class="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                )}
                {cg.verificationStatus !== 'rejected' && (
                  <button
                    onClick={() => handleVerify(cg._id, 'rejected')}
                    class="bg-red-50 hover:bg-red-100 text-red-650 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 transition"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject Application</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CaregiversManagement;
