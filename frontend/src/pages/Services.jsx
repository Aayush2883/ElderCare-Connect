import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { DollarSign, Clock, ShieldCheck, Stethoscope } from 'lucide-react';

const Services = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await API.get('/api/services');
        setServices(data);
        setLoading(false);
      } catch (err) {
        setError('Could not fetch services catalogue. Please try again.');
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Fetching services catalog...</p>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div class="text-center max-w-2xl mx-auto space-y-4">
        <h1 class="text-4xl font-extrabold text-slate-800">Our Care Services</h1>
        <p class="text-lg text-slate-600 font-medium">
          Professional, background-verified help tailored directly to your home. Select a service to find available caregivers.
        </p>
      </div>

      {error && (
        <div class="bg-red-50 text-red-700 p-4 rounded-xl text-center font-medium max-w-md mx-auto">
          {error}
        </div>
      )}

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div key={service._id} class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col justify-between hover:shadow-md transition duration-200">
            <div class="space-y-4">
              <div class="flex items-start justify-between gap-4">
                <div class="p-3 bg-primary-50 text-primary-600 rounded-2xl">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <div class="text-right">
                  <span class="text-2xl font-extrabold text-slate-800">₹{service.price}</span>
                  <span class="text-xs text-slate-500 block font-bold uppercase">{service.duration}</span>
                </div>
              </div>

              <div>
                <h3 class="text-2xl font-extrabold text-slate-800 mb-2">{service.serviceName}</h3>
                <p class="text-slate-600 font-medium text-base leading-relaxed">{service.description}</p>
              </div>

              <div class="pt-4 border-t border-slate-100 space-y-2">
                <div class="flex items-center gap-2 text-sm text-slate-500 font-bold">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Required Qualification:</span>
                  <span class="text-slate-700 font-extrabold">{service.requiredQualification}</span>
                </div>
              </div>
            </div>

            <div class="pt-8">
              {user && user.role === 'user' ? (
                <Link
                  to="/caregivers"
                  state={{ serviceId: service._id, serviceName: service.serviceName }}
                  class="block w-full text-center bg-primary-500 hover:bg-primary-600 text-white font-extrabold py-3.5 rounded-xl shadow-sm hover:shadow transition text-lg"
                >
                  Book this Service
                </Link>
              ) : user ? (
                <div class="text-center text-slate-400 font-bold text-sm bg-slate-50 py-3 rounded-xl">
                  Log in as Family User to book
                </div>
              ) : (
                <Link
                  to="/login"
                  class="block w-full text-center bg-slate-800 hover:bg-slate-900 text-white font-extrabold py-3.5 rounded-xl transition text-lg"
                >
                  Log in to Book Care
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
