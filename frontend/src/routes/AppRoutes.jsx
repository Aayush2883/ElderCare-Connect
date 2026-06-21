import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Public Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Services from '../pages/Services';
import Login from '../pages/Login';
import Register from '../pages/Register';

// User Dashboard Pages
import UserDashboard from '../pages/UserDashboard';
import PatientProfiles from '../pages/PatientProfiles';
import CaregiverListing from '../pages/CaregiverListing';
import BookingManagement from '../pages/BookingManagement';

// Caregiver Dashboard Pages
import CaregiverDashboard from '../pages/CaregiverDashboard';
import CaregiverProfile from '../pages/CaregiverProfile';
import Availability from '../pages/Availability';
import BookingRequests from '../pages/BookingRequests';
import CareNotes from '../pages/CareNotes';
import CaregiverEarnings from '../pages/CaregiverEarnings';

// Admin Dashboard Pages
import AdminDashboard from '../pages/AdminDashboard';
import UsersManagement from '../pages/UsersManagement';
import CaregiversManagement from '../pages/CaregiversManagement';
import ServiceManagement from '../pages/ServiceManagement';
import AdminBookings from '../pages/AdminBookings';
import Analytics from '../pages/Analytics';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <PatientProfiles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/caregivers"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <CaregiverListing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <BookingManagement />
          </ProtectedRoute>
        }
      />

      {/* Caregiver Protected Routes */}
      <Route
        path="/caregiver"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <CaregiverDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/caregiver/profile"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <CaregiverProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/caregiver/availability"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <Availability />
          </ProtectedRoute>
        }
      />
      <Route
        path="/caregiver/requests"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <BookingRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/caregiver/notes"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <CareNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/caregiver/earnings"
        element={
          <ProtectedRoute allowedRoles={['caregiver']}>
            <CaregiverEarnings />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UsersManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/caregivers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CaregiversManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ServiceManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Analytics />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
