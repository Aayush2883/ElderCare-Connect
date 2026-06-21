import React from 'react';
import { HeartHandshake } from 'lucide-react';

const Footer = () => {
  return (
    <footer class="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div class="md:col-span-2 space-y-4">
            <div class="flex items-center gap-2 text-white font-extrabold text-2xl">
              <HeartHandshake className="h-7 w-7 text-primary-400" />
              <span>ElderCare Connect</span>
            </div>
            <p class="text-slate-400 text-base max-w-sm">
              Connecting families with verified nursing, personal care, and therapeutic professionals to enable dignified, safe, and independent living.
            </p>
          </div>

          {/* Core Services */}
          <div>
            <h4 class="text-white font-bold text-lg mb-4">Our Services</h4>
            <ul class="space-y-2 text-sm">
              <li>Nursing Care</li>
              <li>Elderly Attendant</li>
              <li>Physiotherapy</li>
              <li>Post-Hospital Rehab</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 class="text-white font-bold text-lg mb-4">Contact Info</h4>
            <ul class="space-y-2 text-sm text-slate-400">
              <li>Emergency Support:</li>
              <li class="text-white font-bold text-base">1-800-ELDER-CARE</li>
              <li>Email: contact@eldercareconnect.com</li>
              <li>Address: 100 Health Building , Prayagraj</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
