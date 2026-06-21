import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { UserPlus, Edit3, Trash2, ShieldAlert } from 'lucide-react';

const PatientProfiles = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    address: '',
    medicalNeeds: '',
    emergencyContact: '',
  });

  const fetchPatients = async () => {
    try {
      const { data } = await API.get('/api/patients');
      setPatients(data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      age: '',
      gender: 'Male',
      address: '',
      medicalNeeds: '',
      emergencyContact: '',
    });
    setEditMode(false);
    setCurrentId(null);
  };

  const handleEdit = (patient) => {
    setFormData({
      patientName: patient.patientName,
      age: patient.age,
      gender: patient.gender,
      address: patient.address,
      medicalNeeds: patient.medicalNeeds,
      emergencyContact: patient.emergencyContact,
    });
    setCurrentId(patient._id);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this patient profile?')) return;
    try {
      await API.delete(`/api/patients/${id}`);
      fetchPatients();
    } catch (err) {
      alert(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await API.put(`/api/patients/${currentId}`, formData);
      } else {
        await API.post('/api/patients', formData);
      }
      resetForm();
      fetchPatients();
    } catch (err) {
      alert(err);
    }
  };

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Fetching patient profiles...</p>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List column */}
      <div class="lg:col-span-2 space-y-6">
        <h2 class="text-3xl font-extrabold text-slate-800">Elderly Patient Profiles</h2>
        <p class="text-slate-500 font-medium">Create profiles for family members so caregivers can adapt services to their specific medical history.</p>

        {patients.length === 0 ? (
          <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
            <p class="text-slate-500 font-medium">No patient profiles registered yet.</p>
          </div>
        ) : (
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {patients.map((patient) => (
              <div key={patient._id} class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div class="space-y-2">
                  <div class="flex justify-between items-start">
                    <h3 class="text-xl font-extrabold text-slate-800">{patient.patientName}</h3>
                    <span class="bg-primary-50 text-primary-600 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                      Age: {patient.age} ({patient.gender})
                    </span>
                  </div>
                  <p class="text-slate-500 text-sm font-semibold">{patient.address}</p>
                  
                  <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-700">
                    <p class="font-extrabold text-slate-600 text-xs uppercase mb-1">Medical Needs:</p>
                    <p class="font-semibold leading-relaxed">{patient.medicalNeeds}</p>
                  </div>

                  <div class="text-xs text-slate-500 font-bold">
                    Emergency Contact: <span class="text-slate-800">{patient.emergencyContact}</span>
                  </div>
                </div>

                <div class="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleEdit(patient)}
                    class="p-2 text-slate-500 hover:text-primary-500 hover:bg-slate-50 rounded-xl transition"
                    title="Edit Profile"
                  >
                    <Edit3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(patient._id)}
                    class="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-xl transition"
                    title="Remove Profile"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form column */}
      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-fit">
        <h3 class="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
          {editMode ? 'Edit Profile' : 'Add New Patient'}
        </h3>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-slate-700 text-sm font-bold mb-1">Patient Name</label>
            <input
              type="text"
              name="patientName"
              required
              value={formData.patientName}
              onChange={handleChange}
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
              placeholder="e.g. Ramesh Mehta"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-700 text-sm font-bold mb-1">Age</label>
              <input
                type="number"
                name="age"
                required
                value={formData.age}
                onChange={handleChange}
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
                placeholder="75"
              />
            </div>
            <div>
              <label class="block text-slate-700 text-sm font-bold mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-slate-700 text-sm font-bold mb-1">Address</label>
            <input
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
              placeholder="e.g. Sector 15, Noida"
            />
          </div>

          <div>
            <label class="block text-slate-700 text-sm font-bold mb-1">Emergency Contact Number</label>
            <input
              type="tel"
              name="emergencyContact"
              required
              value={formData.emergencyContact}
              onChange={handleChange}
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
              placeholder="10-digit phone number"
            />
          </div>

          <div>
            <label class="block text-slate-700 text-sm font-bold mb-1">Medical Needs & Notes</label>
            <textarea
              name="medicalNeeds"
              required
              value={formData.medicalNeeds}
              onChange={handleChange}
              rows={4}
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold text-slate-700 leading-relaxed"
              placeholder="Specify medical history, mobility aids, prescription schedules, vitals checklists..."
            ></textarea>
          </div>

          <div class="pt-4 flex gap-3">
            <button
              type="submit"
              class="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-extrabold py-3.5 rounded-xl shadow-sm transition"
            >
              {editMode ? 'Update Profile' : 'Register Patient'}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                class="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-4 rounded-xl transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientProfiles;
