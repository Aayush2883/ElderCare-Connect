import React from 'react';
import { ShieldAlert, Users, Award, Heart } from 'lucide-react';

const About = () => {
  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Title */}
      <div class="text-center max-w-3xl mx-auto space-y-4">
        <h1 class="text-4xl font-extrabold text-slate-800 sm:text-5xl">Our Care Commitment</h1>
        <p class="text-xl text-slate-600 font-medium">
          ElderCare Connect is dedicated to making professional nursing, physiotherapy, and elderly assistance safe, transparent, and simple to coordinate.
        </p>
      </div>

      {/* Grid Features */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <h2 class="text-3xl font-extrabold text-slate-800">Our Story & Vision</h2>
          <p class="text-lg text-slate-600 leading-relaxed font-medium">
            Finding reliable, vetted care for aging family members shouldn't be a source of stress. We founded ElderCare Connect with a clear vision: build an intuitive platform that pairs professional caregivers with patients who require assistance.
          </p>
          <p class="text-lg text-slate-600 leading-relaxed font-medium">
            Whether it's post-hospital treatment monitoring, joint therapy sessions, or helper support for basic daily needs, we provide a secure, transparent platform where credentials can be verified, care schedules are recorded, and reviews help you make informed decisions.
          </p>
        </div>

        <div class="bg-primary-50 p-8 rounded-3xl space-y-6">
          <h3 class="text-2xl font-bold text-primary-900">Platform Standards</h3>
          
          <div class="flex items-start gap-4">
            <span class="p-2 bg-primary-100 rounded-xl text-primary-700">
              <Users className="h-6 w-6" />
            </span>
            <div>
              <h4 class="font-bold text-slate-800 text-lg">Family Transparency</h4>
              <p class="text-slate-600 font-medium text-sm">Families can coordinate multiple patient profiles, review bookings history, and read notes left by caregivers after assignments.</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <span class="p-2 bg-primary-100 rounded-xl text-primary-700">
              <Award className="h-6 w-6" />
            </span>
            <div>
              <h4 class="font-bold text-slate-800 text-lg">Caregiver Verification</h4>
              <p class="text-slate-600 font-medium text-sm">Every caregiver profile is manually checked by our administration team to confirm training, certifications, and background logs.</p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <span class="p-2 bg-primary-100 rounded-xl text-primary-700">
              <ShieldAlert className="h-6 w-6" />
            </span>
            <div>
              <h4 class="font-bold text-slate-800 text-lg">Safety First</h4>
              <p class="text-slate-600 font-medium text-sm">Dedicated direct booking cancellation support and 24/7 hotline numbers are provided for medical emergencies.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
