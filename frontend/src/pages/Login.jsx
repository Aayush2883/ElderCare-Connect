import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, HeartHandshake } from 'lucide-react';

const Login = () => {
  const { user, login, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  // If user is already logged in, redirect them
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

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else if (loggedUser.role === 'caregiver') {
        navigate('/caregiver');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setLocalError(err || 'Failed to authenticate');
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
          <h2 class="text-3xl font-extrabold text-slate-800">Welcome Back</h2>
          <p class="text-slate-500 text-sm font-medium">
            Log in to manage patient care, check schedules, or view notes.
          </p>
        </div>

        {/* Alerts */}
        {(localError || error) && (
          <div class="bg-red-50 text-red-700 p-4 rounded-xl text-center font-bold text-sm border border-red-100">
            {localError || error}
          </div>
        )}

        <form class="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div class="space-y-4">
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
                  name="email"
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
              <label htmlFor="password" class="block text-slate-700 text-base font-bold mb-1">
                Password
              </label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  class="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              class="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-xl font-extrabold text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-50"
            >
              {loading ? 'Logging in safely...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div class="text-center text-sm font-semibold text-slate-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" class="text-primary-500 hover:text-primary-600 font-extrabold">
            Create Account
          </Link>
        </div>

        {/* Demo Credentials Helper */}
        <div class="mt-8 bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2 text-xs">
          <p class="font-extrabold text-slate-700 text-sm mb-1">Demo Accounts:</p>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <p class="font-bold text-slate-500 uppercase tracking-wider">Admin:</p>
              <p class="text-slate-600 font-medium">admin@eldercare.com</p>
              <p class="text-slate-600 font-medium">pwd: admin123</p>
            </div>
            <div>
              <p class="font-bold text-slate-500 uppercase tracking-wider">Family User:</p>
              <p class="text-slate-600 font-medium">user@eldercare.com</p>
              <p class="text-slate-600 font-medium">pwd: user123</p>
            </div>
            <div class="col-span-2 pt-2 border-t border-slate-200">
              <p class="font-bold text-slate-500 uppercase tracking-wider">Caregiver (Nurse):</p>
              <p class="text-slate-600 font-medium">nurse1@eldercare.com</p>
              <p class="text-slate-600 font-medium">pwd: caregiver123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
