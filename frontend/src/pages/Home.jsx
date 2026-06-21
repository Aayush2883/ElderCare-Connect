import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Award, Activity } from 'lucide-react';

const Home = () => {
  return (
    <div class="space-y-16 pb-16">
      {/* Hero Section */}
      <section class="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Dignified Care for Your Loved Ones.
            </h1>
            <p class="text-xl text-primary-100 font-medium max-w-xl">
              Connect with verified nurses, experienced physiotherapists, and compassionate attendants tailored to your family's needs.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/services"
                class="inline-flex items-center justify-center bg-accent-500 hover:bg-accent-600 text-white font-extrabold text-xl px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 text-center"
              >
                Find Caregivers Now
              </Link>
              <Link
                to="/register"
                class="inline-flex items-center justify-center bg-transparent border-2 border-white hover:bg-white hover:text-primary-800 text-white font-bold text-lg px-8 py-4 rounded-xl transition text-center"
              >
                Join as a Caregiver
              </Link>
            </div>
          </div>
          
          {/* Decorative Panel */}
          <div class="hidden lg:block relative">
            <div class="glass-card p-8 rounded-3xl shadow-2xl space-y-6 text-slate-800 max-w-md mx-auto">
              <div class="flex items-center gap-4 border-b border-slate-100 pb-4">
                <span class="p-3 rounded-2xl bg-primary-100 text-primary-600">
                  <Activity className="h-7 w-7" />
                </span>
                <div>
                  <h3 class="text-xl font-extrabold">Instant Connection</h3>
                  <p class="text-sm text-slate-500 font-medium">Verified local healthcare assistance</p>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-start gap-3">
                  <span class="text-emerald-500 font-bold text-lg">✓</span>
                  <span class="text-slate-600 font-medium">100% Background-Checked Staff</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-emerald-500 font-bold text-lg">✓</span>
                  <span class="text-slate-600 font-medium">Customizable Patient Profiles</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-emerald-500 font-bold text-lg">✓</span>
                  <span class="text-slate-600 font-medium">Secure Booking & Easy Dashboard Track</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-3">
            <div class="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 class="text-xl font-bold text-slate-800">Verified Providers</h3>
            <p class="text-slate-500 font-medium">
              Every caregiver goes through a strict documentation verification process before taking bookings.
            </p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-3">
            <div class="mx-auto w-12 h-12 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 class="text-xl font-bold text-slate-800">Compassionate Care</h3>
            <p class="text-slate-500 font-medium">
              We select caregivers with verified positive track records, empathy, and specialized credentials.
            </p>
          </div>

          <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center space-y-3">
            <div class="mx-auto w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
            <h3 class="text-xl font-bold text-slate-800">Quality Assured</h3>
            <p class="text-slate-500 font-medium">
              Track notes, leave ratings, and update health details seamlessly through patient profiles.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Services Overview CTA */}
      <section class="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto">
        <div class="text-center max-w-3xl mx-auto space-y-4">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-800">Services We Provide</h2>
          <p class="text-lg text-slate-600 font-medium">
            From round-the-clock attendants to specific clinical therapy sessions, we help you cover all aspects of elderly health support.
          </p>
          <div class="pt-6">
            <Link
              to="/services"
              class="inline-block bg-primary-500 hover:bg-primary-600 text-white font-extrabold text-lg px-8 py-3.5 rounded-lg shadow transition"
            >
              Browse Services Catalogue
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
