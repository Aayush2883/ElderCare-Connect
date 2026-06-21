import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Phone, HeartHandshake } from 'lucide-react';

const Register = () => {
  const { user, register, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user'); // default is user
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'caregiver') navigate('/caregiver');
      else navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!name || !email || !password || !phone) {
      setLocalError('Please fill in all standard fields');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    if (role === 'caregiver') {
      if (!specialization || !experience || !serviceArea || !profilePhoto || !hourlyRate) {
        setLocalError('Please fill in all caregiver fields, specify your hourly rate, and upload a profile photo');
        return;
      }
    }

    try {
      let payload;
      if (role === 'caregiver') {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('phone', phone);
        formData.append('role', role);
        formData.append('specialization', specialization);
        formData.append('experience', experience);
        formData.append('serviceArea', serviceArea);
        formData.append('hourlyRate', hourlyRate);
        formData.append('profilePhoto', profilePhoto);
        payload = formData;
      } else {
        payload = { name, email, password, phone, role };
      }

      const regUser = await register(payload);
      if (regUser.role === 'caregiver') {
        navigate('/caregiver');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setLocalError(err.message || err || 'Registration failed');
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
        {/* Title */}
        <div class="text-center space-y-3">
          <div class="flex justify-center text-primary-500">
            <HeartHandshake className="h-12 w-12" />
          </div>
          <h2 class="text-3xl font-extrabold text-slate-800">Create Account</h2>
          <p class="text-slate-500 text-sm font-medium font-medium">
            Register to request healthcare services or apply as a provider.
          </p>
        </div>

        {/* Alerts */}
        {(localError || error) && (
          <div class="bg-red-50 text-red-700 p-4 rounded-xl text-center font-bold text-sm border border-red-100">
            {localError || error}
          </div>
        )}

        <form class="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div class="space-y-4">
            {/* Role selection widget */}
            <div>
              <label class="block text-slate-700 text-base font-bold mb-2">I am registering as a:</label>
              <div class="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  class={`py-3.5 px-4 rounded-xl border text-center text-base font-extrabold transition ${
                    role === 'user'
                      ? 'bg-primary-50 border-primary-500 text-primary-600 ring-2 ring-primary-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  👵 Family / Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole('caregiver')}
                  class={`py-3.5 px-4 rounded-xl border text-center text-base font-extrabold transition ${
                    role === 'caregiver'
                      ? 'bg-primary-50 border-primary-500 text-primary-600 ring-2 ring-primary-500'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  🩺 Caregiver
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="name" class="block text-slate-700 text-base font-bold mb-1">
                Full Name
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User className="h-5 w-5" />
                </span>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  class="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" class="block text-slate-700 text-base font-bold mb-1">
                Email Address
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  class="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" class="block text-slate-700 text-base font-bold mb-1">
                Phone Number
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Phone className="h-5 w-5" />
                </span>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  class="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
                  placeholder="10-digit number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" class="block text-slate-700 text-base font-bold mb-1">
                Password
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  class="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>
            
            {role === 'caregiver' && (
              <div class="space-y-4 pt-4 border-t border-slate-100">
                <h3 class="text-lg font-bold text-slate-800">Caregiver Profile Details</h3>
                
                <div>
                  <label htmlFor="specialization" class="block text-slate-700 text-sm font-bold mb-1">
                    Specialization
                  </label>
                  <input
                    id="specialization"
                    type="text"
                    required
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                    placeholder="e.g. Registered Nurse, Physiotherapist"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="experience" class="block text-slate-700 text-sm font-bold mb-1">
                      Experience (Years)
                    </label>
                    <input
                      id="experience"
                      type="number"
                      min="0"
                      required
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                      placeholder="e.g. 5"
                    />
                  </div>

                  <div>
                    <label htmlFor="serviceArea" class="block text-slate-700 text-sm font-bold mb-1">
                      Service Area
                    </label>
                    <input
                      id="serviceArea"
                      type="text"
                      required
                      value={serviceArea}
                      onChange={(e) => setServiceArea(e.target.value)}
                      class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                      placeholder="e.g. Downtown"
                    />
                  </div>

                  <div>
                    <label htmlFor="hourlyRate" class="block text-slate-700 text-sm font-bold mb-1">
                      Hourly Rate (₹/hr)
                    </label>
                    <input
                      id="hourlyRate"
                      type="number"
                      min="0"
                      required
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                      placeholder="e.g. 25"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="profilePhoto" class="block text-slate-700 text-sm font-bold mb-1">
                    Profile Photo (JPG / PNG)
                  </label>
                  <input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                    class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                </div>
              </div>
            )}
          </div>

          <div class="pt-2">
            <button
              type="submit"
              disabled={loading}
              class="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-xl font-extrabold text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-50"
            >
              {loading ? 'Creating your account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div class="text-center text-sm font-semibold text-slate-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" class="text-primary-500 hover:text-primary-600 font-extrabold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
