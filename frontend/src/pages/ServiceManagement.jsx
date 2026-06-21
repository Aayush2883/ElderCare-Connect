import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Plus, Edit3, Trash2, ShieldCheck, DollarSign } from 'lucide-react';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    duration: 'per hour',
    price: '',
    requiredQualification: '',
  });

  const fetchServices = async () => {
    try {
      const { data } = await API.get('/api/services');
      setServices(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const value = e.target.name === 'price' ? Number(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleEdit = (service) => {
    setFormData({
      serviceName: service.serviceName,
      description: service.description,
      duration: service.duration,
      price: service.price,
      requiredQualification: service.requiredQualification,
    });
    setCurrentId(service._id);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await API.delete(`/api/services/${id}`);
      fetchServices();
    } catch (err) {
      alert(err);
    }
  };

  const handleReset = () => {
    setFormData({
      serviceName: '',
      description: '',
      duration: 'per hour',
      price: '',
      requiredQualification: '',
    });
    setEditMode(false);
    setCurrentId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await API.put(`/api/services/${currentId}`, formData);
      } else {
        await API.post('/api/services', formData);
      }
      handleReset();
      fetchServices();
    } catch (err) {
      alert(err);
    }
  };

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Loading catalog services...</p>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List Column */}
      <div class="lg:col-span-2 space-y-6">
        <h2 class="text-3xl font-extrabold text-slate-800">Services Catalog</h2>
        <p class="text-slate-500 font-medium">Create or update service modules, specify required certifications, and set hourly/daily rates.</p>

        {services.length === 0 ? (
          <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center">
            <p class="text-slate-500 font-medium">No services registered in the database catalog.</p>
          </div>
        ) : (
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service) => (
              <div key={service._id} class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div class="space-y-3">
                  <div class="flex justify-between items-start gap-4">
                    <h3 class="text-xl font-extrabold text-slate-800">{service.serviceName}</h3>
                    <div class="text-right">
                      <span class="text-lg font-extrabold text-slate-800">₹{service.price}</span>
                      <span class="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">{service.duration}</span>
                    </div>
                  </div>
                  <p class="text-slate-500 text-sm font-medium leading-relaxed">{service.description}</p>
                  
                  <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Req. Cert: <strong class="text-slate-800">{service.requiredQualification}</strong></span>
                  </div>
                </div>

                <div class="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleEdit(service)}
                    class="p-2 text-slate-500 hover:text-primary-500 rounded-xl hover:bg-slate-50 transition"
                    title="Edit Service"
                  >
                    <Edit3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    class="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-50 transition"
                    title="Delete Service"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Column */}
      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-fit">
        <h3 class="text-2xl font-extrabold text-slate-800 mb-6">
          {editMode ? 'Modify Service' : 'Add New Service'}
        </h3>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-slate-700 text-sm font-bold mb-1">Service Name</label>
            <input
              type="text"
              name="serviceName"
              required
              value={formData.serviceName}
              onChange={handleChange}
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
              placeholder="e.g. Nursing Care"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-700 text-sm font-bold mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
                placeholder="40"
              />
            </div>
            <div>
              <label class="block text-slate-700 text-sm font-bold mb-1">Duration Unit</label>
              <input
                type="text"
                name="duration"
                required
                value={formData.duration}
                onChange={handleChange}
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
                placeholder="per hour"
              />
            </div>
          </div>

          <div>
            <label class="block text-slate-700 text-sm font-bold mb-1">Required Qualifications</label>
            <input
              type="text"
              name="requiredQualification"
              required
              value={formData.requiredQualification}
              onChange={handleChange}
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
              placeholder="e.g. Registered Nurse / LPN"
            />
          </div>

          <div>
            <label class="block text-slate-700 text-sm font-bold mb-1">Description</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={4}
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold leading-relaxed"
              placeholder="Describe what services are included, task sheets, clinical support details..."
            ></textarea>
          </div>

          <div class="pt-4 flex gap-3">
            <button
              type="submit"
              class="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-extrabold py-3.5 rounded-xl shadow-sm transition"
            >
              {editMode ? 'Save Changes' : 'Create Service'}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={handleReset}
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

export default ServiceManagement;
