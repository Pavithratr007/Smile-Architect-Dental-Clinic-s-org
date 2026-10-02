import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Phone, MessageCircle, Navigation, Calendar, MapPin, Clock, ExternalLink } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings, navigateTo } = useClinic();

  const handleWhatsApp = () => {
    const text = encodeURIComponent('Hello Smile Architect Dental Clinic, I would like to book a dental appointment.');
    window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#0D6969]">
            Location & Inquiries
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#15222E] tracking-tight mt-1" style={{ textWrap: 'balance' }}>
            Visit Smile Architect in Mysuru
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2">
            Located in Hebbal 2nd Stage near Sankranthi Circle. Easy accessibility, street parking, and welcoming staff.
          </p>
        </div>

        {/* Contact Info & Direct CTAs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Address, Hours, CTAs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E6DF] shadow-sm space-y-6">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-[#EEF8F7] text-[#0D6969] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#15222E]">Clinic Location</h3>
                  <p className="text-xs text-[#1E252B]/85 leading-relaxed">
                    <strong>{settings.name}</strong><br />
                    {settings.addressLine1}<br />
                    {settings.addressLine2}<br />
                    {settings.city}, {settings.state} - {settings.postalCode}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-[#F6EDE8] text-[#6D4C41] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#15222E]">Phone & Inquiries</h3>
                  <p className="text-xs text-[#1E252B]/85">
                    For direct consultations & queries:
                  </p>
                  <a
                    href={`tel:${settings.phoneRaw}`}
                    className="inline-block text-sm font-bold text-[#0D6969] hover:underline tabular-nums"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-[#EEF8F7] text-[#0D6969] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#15222E]">Consultation Hours</h3>
                  <div className="text-xs text-[#64748B] space-y-1">
                    <p>
                      <strong className="text-[#15222E]">Monday – Saturday:</strong><br />
                      Morning: 10:00 AM – 1:30 PM<br />
                      Evening: 5:00 PM – 8:30 PM
                    </p>
                    <p className="text-[#6D4C41] font-medium pt-1">
                      Sunday: Prior appointment only
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="pt-4 border-t border-[#E8E6DF] grid grid-cols-2 gap-3">
                {/* Book Appointment */}
                <button
                  onClick={() => navigateTo('booking')}
                  className="flex items-center justify-center gap-2 p-3 text-xs font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>

                {/* Call Clinic */}
                <a
                  href={`tel:${settings.phoneRaw}`}
                  className="flex items-center justify-center gap-2 p-3 text-xs font-semibold text-[#15222E] bg-white border border-[#E8E6DF] hover:bg-[#FAF9F5] rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#0D6969]" />
                  <span>Call Clinic</span>
                </a>

                {/* WhatsApp */}
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 p-3 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#1EBE5D] rounded-xl transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                {/* Get Directions */}
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 text-xs font-semibold text-[#6D4C41] bg-[#F6EDE8] hover:bg-[#EAE0D9] rounded-xl transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Large Interactive Map & Directions Section */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#15222E]">Find Us on Google Maps</h3>
                  <p className="text-xs text-[#64748B]">Sankranthi Circle, Hebbal 2nd Stage, Mysuru</p>
                </div>

                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0D6969] bg-[#EEF8F7] hover:bg-[#D1EAE7] rounded-lg transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Map Visual Display with interactive pin & directions trigger */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#E8E6DF] bg-[#FAF9F5]">
                {/* Embed OpenStreetMap / Interactive Map centered at Hebbal Sankranthi Circle Mysuru */}
                <iframe
                  title="Smile Architect Dental Clinic Location Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=76.595%2C12.350%2C76.615%2C12.365&layer=mapnik&marker=12.3575%2C76.6045"
                  className="w-full h-full border-0"
                  loading="lazy"
                />

                {/* Custom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-md p-4 rounded-xl border border-[#E8E6DF] shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#0D6969] text-white">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#15222E]">Smile Architect Dental Clinic</h4>
                      <p className="text-[11px] text-[#64748B]">850/S, 25th Cross Rd, Hebbal 2nd Stage</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#E8E6DF] flex items-center justify-between text-xs">
                    <a
                      href={settings.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#0D6969] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Navigate via Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] text-xs text-[#64748B] flex items-center justify-between">
                <span>Landmark: Near Sankranthi Circle, Manchegowdana Koppalu</span>
                <span className="text-[#0D6969] font-medium">Pin: 570016</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
