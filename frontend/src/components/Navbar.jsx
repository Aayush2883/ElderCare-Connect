import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  HeartHandshake,
  Home,
  Info,
  Stethoscope,
  User,
  Search,
  Calendar,
  Settings,
  Clock,
  ClipboardList,
  Users,
  ShieldAlert,
  Layers
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'caregiver') return '/caregiver';
    return '/dashboard'; // user dashboard
  };

  const isActive = (path) => location.pathname === path;

  // General navigation links
  const generalLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Services', path: '/services', icon: Stethoscope },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            {/* Left Section: Logo */}
            <div class="flex items-center">
              <Link to="/" class="flex items-center gap-2 text-primary-500 font-extrabold text-2xl tracking-tight">
                <HeartHandshake className="h-8 w-8 text-primary-500" />
                <span class="hidden sm:inline">ElderCare Connect</span>
              </Link>
            </div>

            {/* Right Section: Quick User Status / CTAs & Menu Trigger */}
            <div class="flex items-center space-x-4">
              {user ? (
                <div class="flex items-center space-x-4">
                  {/* User Info Badge */}
                  <div class="flex flex-col text-right">
                    <span class="text-sm font-semibold text-slate-800">{user.name}</span>
                    <span class="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">{user.role}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    class="flex items-center gap-1 text-slate-500 hover:text-red-500 text-base font-semibold transition"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                    <span class="hidden md:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div class="flex items-center space-x-3">
                  <Link
                    to="/login"
                    class="text-slate-650 hover:text-primary-500 px-3 py-2 text-base font-bold transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    class="bg-primary-500 text-white hover:bg-primary-600 px-5 py-2.5 rounded-xl text-base font-bold shadow-sm transition"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Menu button on the right side */}
              <button
                onClick={() => setIsOpen(true)}
                class="p-2 rounded-xl text-slate-500 hover:text-primary-500 hover:bg-slate-50 focus:outline-none transition duration-200 border border-slate-100 shadow-sm"
                aria-label="Open Menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Backdrop Drawer Panel */}
      {isOpen && (
        <div
          class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation Drawer (sliding from right) */}
      <div
        class={`fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div class="flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              class="flex items-center gap-2 text-primary-500 font-extrabold text-xl tracking-tight"
            >
              <HeartHandshake className="h-6 w-6 text-primary-500" />
              <span>ElderCare Connect</span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none transition duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Card */}
          {user && (
            <div class="px-6 py-6 border-b border-slate-100 bg-slate-50/50 space-y-1">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 class="font-extrabold text-slate-800 text-sm leading-none">{user.name}</h4>
                  <span class="text-[10px] uppercase font-bold text-primary-600 block mt-1">{user.role}</span>
                </div>
              </div>
            </div>
          )}

          {/* Nav Links Body */}
          <div class="px-4 py-6 space-y-6 flex-1">
            {/* General Section */}
            <div class="space-y-1">
              <span class="px-3 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-2">Navigation</span>
              {generalLinks.map((link) => {
                const IconComponent = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-bold transition-all duration-200 ${
                      active
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-slate-650 hover:bg-slate-50 hover:text-primary-500'
                    }`}
                  >
                    <IconComponent className={`h-5 w-5 ${active ? 'text-primary-500' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Dashboard Link (if logged in) */}
            {user && (
              <div class="space-y-1">
                <span class="px-3 text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-2">Role Controls</span>
                
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsOpen(false)}
                  class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-bold transition-all duration-200 ${
                    isActive(getDashboardPath())
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-650 hover:bg-slate-50 hover:text-primary-500'
                  }`}
                >
                  <LayoutDashboard className={`h-5 w-5 ${isActive(getDashboardPath()) ? 'text-primary-500' : 'text-slate-400'}`} />
                  <span>Main Dashboard</span>
                </Link>

                {/* Patient Links */}
                {user.role === 'user' && (
                  <>
                    <Link
                      to="/patients"
                      onClick={() => setIsOpen(false)}
                      class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-bold transition-all duration-200 ${
                        isActive('/patients')
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-slate-650 hover:bg-slate-50 hover:text-primary-500'
                      }`}
                    >
                      <User className={`h-5 w-5 ${isActive('/patients') ? 'text-primary-500' : 'text-slate-400'}`} />
                      <span>Patient Profiles</span>
                    </Link>

                    <Link
                      to="/caregivers"
                      onClick={() => setIsOpen(false)}
                      class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-bold transition-all duration-200 ${
                        isActive('/caregivers')
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-slate-650 hover:bg-slate-50 hover:text-primary-500'
                      }`}
                    >
                      <Search className={`h-5 w-5 ${isActive('/caregivers') ? 'text-primary-500' : 'text-slate-400'}`} />
                      <span>Browse Caregivers</span>
                    </Link>

                    <Link
                      to="/bookings"
                      onClick={() => setIsOpen(false)}
                      class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-bold transition-all duration-200 ${
                        isActive('/bookings')
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-slate-650 hover:bg-slate-50 hover:text-primary-500'
                      }`}
                    >
                      <Calendar className={`h-5 w-5 ${isActive('/bookings') ? 'text-primary-500' : 'text-slate-400'}`} />
                      <span>Manage Bookings</span>
                    </Link>
                  </>
                )}

                {/* Caregiver Links */}
                {user.role === 'caregiver' && (
                  <>
                    <Link
                      to="/caregiver/profile"
                      onClick={() => setIsOpen(false)}
                      class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-bold transition-all duration-200 ${
                        isActive('/caregiver/profile')
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-slate-650 hover:bg-slate-50 hover:text-primary-500'
                      }`}
                    >
                      <Settings className={`h-5 w-5 ${isActive('/caregiver/profile') ? 'text-primary-500' : 'text-slate-400'}`} />
                      <span>Edit Profile</span>
                    </Link>

                    <Link
                      to="/caregiver/availability"
                      onClick={() => setIsOpen(false)}
                      class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-bold transition-all duration-200 ${
                        isActive('/caregiver/availability')
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-slate-650 hover:bg-slate-50 hover:text-primary-500'
                      }`}
                    >
                      <Clock className={`h-5 w-5 ${isActive('/caregiver/availability') ? 'text-primary-500' : 'text-slate-400'}`} />
                      <span>Availability</span>
                    </Link>

                    <Link
                      to="/caregiver/requests"
                      onClick={() => setIsOpen(false)}
                      class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-bold transition-all duration-200 ${
                        isActive('/caregiver/requests')
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-slate-650 hover:bg-slate-50 hover:text-primary-500'
                      }`}
                    >
                      <ClipboardList className={`h-5 w-5 ${isActive('/caregiver/requests') ? 'text-primary-500' : 'text-slate-400'}`} />
                      <span>Manage Bookings</span>
                    </Link>
                  </>
                )}

                {/* Admin Links */}
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/users"
                      onClick={() => setIsOpen(false)}
                      class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-bold transition-all duration-200 ${
                        isActive('/admin/users')
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-slate-650 hover:bg-slate-50 hover:text-primary-500'
                      }`}
                    >
                      <Users className={`h-5 w-5 ${isActive('/admin/users') ? 'text-primary-500' : 'text-slate-400'}`} />
                      <span>Users Management</span>
                    </Link>

                    <Link
                      to="/admin/caregivers"
                      onClick={() => setIsOpen(false)}
                      class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-bold transition-all duration-200 ${
                        isActive('/admin/caregivers')
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-slate-650 hover:bg-slate-50 hover:text-primary-500'
                      }`}
                    >
                      <ShieldAlert className={`h-5 w-5 ${isActive('/admin/caregivers') ? 'text-primary-500' : 'text-slate-400'}`} />
                      <span>Caregivers Review</span>
                    </Link>

                    <Link
                      to="/admin/services"
                      onClick={() => setIsOpen(false)}
                      class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-bold transition-all duration-200 ${
                        isActive('/admin/services')
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-slate-650 hover:bg-slate-50 hover:text-primary-500'
                      }`}
                    >
                      <Layers className={`h-5 w-5 ${isActive('/admin/services') ? 'text-primary-500' : 'text-slate-400'}`} />
                      <span>Service Settings</span>
                    </Link>

                    <Link
                      to="/admin/bookings"
                      onClick={() => setIsOpen(false)}
                      class={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-bold transition-all duration-200 ${
                        isActive('/admin/bookings')
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-slate-650 hover:bg-slate-50 hover:text-primary-500'
                      }`}
                    >
                      <Calendar className={`h-5 w-5 ${isActive('/admin/bookings') ? 'text-primary-500' : 'text-slate-400'}`} />
                      <span>Booking Logs</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer in Drawer (Logout option) */}
        {user && (
          <div class="p-4 border-t border-slate-100">
            <button
              onClick={handleLogout}
              class="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl text-base font-extrabold transition"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
