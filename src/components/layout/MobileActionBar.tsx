import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Phone, MessageCircle, Navigation, Calendar } from 'lucide-react';

export const MobileActionBar: React.FC = () => {
  const { settings, navigateTo } = useClinic();

  const handleWhatsApp = () => {
    const text = encodeURIComponent('Hello Smile Architect Dental Clinic, I would like to book a dental appointment.');
    window.open(`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleDirections = () => {
    window.open(settings.googleMapsUrl, '_blank');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E6DF] px-2 py-1.5 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
        {/* Call */}
        <a
          href={`tel:${settings.phoneRaw}`}
          className="flex flex-col items-center justify-center py-1 rounded-lg text-[#15222E] hover:bg-[#F6EDE8]/60 transition-colors"
          aria-label="Call Smile Architect Clinic"
        >
          <Phone className="w-4 h-4 text-[#0D6969]" />
          <span className="text-[11px] font-medium mt-0.5">Call</span>
        </a>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          className="flex flex-col items-center justify-center py-1 rounded-lg text-[#15222E] hover:bg-[#F6EDE8]/60 transition-colors cursor-pointer"
          aria-label="WhatsApp Smile Architect Clinic"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <span className="text-[11px] font-medium mt-0.5">WhatsApp</span>
        </button>

        {/* Directions */}
        <button
          onClick={handleDirections}
          className="flex flex-col items-center justify-center py-1 rounded-lg text-[#15222E] hover:bg-[#F6EDE8]/60 transition-colors cursor-pointer"
          aria-label="Get Directions to Clinic"
        >
          <Navigation className="w-4 h-4 text-[#6D4C41]" />
          <span className="text-[11px] font-medium mt-0.5">Directions</span>
        </button>

        {/* Book */}
        <button
          onClick={() => navigateTo('booking')}
          className="flex flex-col items-center justify-center py-1 rounded-lg bg-[#0D6969] text-white hover:bg-[#094F4F] transition-colors cursor-pointer shadow-sm"
          aria-label="Book Dental Appointment"
        >
          <Calendar className="w-4 h-4 text-white" />
          <span className="text-[11px] font-semibold mt-0.5">Book</span>
        </button>
      </div>
    </div>
  );
};
