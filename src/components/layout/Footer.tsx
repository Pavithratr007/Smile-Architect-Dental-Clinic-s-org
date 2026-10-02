import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Logo } from '../brand/Logo';
import { Phone, MapPin, Clock, ExternalLink, Calendar } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, settings } = useClinic();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#15222E] text-white pt-16 pb-24 md:pb-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" onClick={() => navigateTo('home')} />
            <p className="text-white/70 text-sm max-w-sm leading-relaxed mt-3">
              Comprehensive dental health centre providing personalized care for children and adults.
              Led by experienced specialists in pediatric dentistry, oral & maxillofacial surgery, and implantology.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateTo('booking')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#15222E] bg-[#80CBC4] hover:bg-[#4DB6AC] rounded-lg transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book a Consultation</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white/90">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Clinic
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('doctors')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Our Specialists
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Treatments & Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('gallery')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Clinic Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Map
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Patient Information */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white/90">
              Patient Care
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <button
                  onClick={() => navigateTo('booking')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Book Appointment
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Why Patients Choose Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('terms')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Appointment Policy & Terms
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('admin')}
                  className="hover:text-white transition-colors cursor-pointer text-white/40"
                >
                  Staff Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-white/90">
              Contact & Hours
            </h4>
            <div className="space-y-2.5 text-xs text-white/70">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#80CBC4] shrink-0 mt-0.5" />
                <span>
                  {settings.addressLine1}, {settings.addressLine2}, {settings.city}, Karnataka
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#80CBC4] shrink-0" />
                <a href={`tel:${settings.phoneRaw}`} className="hover:text-white tabular-nums">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1 border-t border-white/10">
                <Clock className="w-4 h-4 text-[#80CBC4] shrink-0 mt-0.5" />
                <div>
                  <div className="text-white/90 font-medium">Mon - Sat:</div>
                  <div>10:00 AM - 1:30 PM</div>
                  <div>5:00 PM - 8:30 PM</div>
                  <div className="text-white/50 text-[11px] mt-0.5">Sunday: Prior appointment only</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {currentYear} Smile Architect Dental Clinic. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a
              href={settings.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-white/20">|</span>
            <button
              onClick={() => navigateTo('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => navigateTo('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
