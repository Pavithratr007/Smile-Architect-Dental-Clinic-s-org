import React from 'react';
import { Service } from '../../types';
import { useClinic } from '../../context/ClinicContext';
import { X, Calendar, Clock, HelpCircle, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface ServiceDetailModalProps {
  service: Service | null;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose }) => {
  const { navigateTo, doctors } = useClinic();

  if (!service) return null;

  const assignedDoc = doctors.find((d) => d.id === service.assignedDoctorId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E8E6DF] shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Service Details"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#15222E] shadow-sm border border-[#E8E6DF] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-[#FAF9F5] border-b border-[#E8E6DF]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0D6969] uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{service.category}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-[#15222E] tracking-tight">
            {service.name}
          </h3>

          <p className="text-xs sm:text-sm text-[#1E252B]/80 mt-2 leading-relaxed">
            {service.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-[#64748B]">
              <Clock className="w-4 h-4 text-[#0D6969]" />
              <span>Est. Duration: {service.durationMinutes} mins</span>
            </div>

            <div className="px-2.5 py-1 rounded bg-white border border-[#E8E6DF] text-[#6D4C41] font-semibold">
              {service.customPrice
                ? `₹${service.customPrice.toLocaleString('en-IN')}`
                : service.priceNote || 'Price available after consultation'}
            </div>

            {assignedDoc && (
              <span className="text-slate-600 font-medium">
                Consulting Specialist: <strong className="text-[#15222E]">{assignedDoc.name}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Section: What the treatment is */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#15222E] mb-2">
              What the Treatment Is
            </h4>
            <p className="text-xs sm:text-sm text-[#1E252B]/85 leading-relaxed bg-[#FAF9F5] p-4 rounded-xl border border-[#E8E6DF]">
              {service.whatItIs || service.description}
            </p>
          </div>

          {/* Section: When patients may need consultation */}
          {service.whenNeeded && service.whenNeeded.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#15222E] mb-3">
                When You May Need a Consultation
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#1E252B]/90">
                {service.whenNeeded.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#0D6969] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section: What to expect */}
          {service.whatToExpect && service.whatToExpect.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#15222E] mb-3">
                What to Expect During Your Visit
              </h4>
              <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
                {service.whatToExpect.map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-[#E8E6DF]">
                    <span className="w-5 h-5 rounded-full bg-[#EEF8F7] text-[#0D6969] text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[#1E252B]/90">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: FAQs */}
          {service.faqs && service.faqs.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#15222E] mb-3 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#6D4C41]" />
                <span>Frequently Asked Questions</span>
              </h4>
              <div className="space-y-3">
                {service.faqs.map((faq, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] space-y-1">
                    <p className="text-xs font-bold text-[#15222E]">{faq.question}</p>
                    <p className="text-xs text-[#64748B] leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mandatory Medical Disclaimer */}
          <div className="p-3.5 rounded-xl bg-[#FFF8E1] border border-[#FFE082] flex items-start gap-2.5 text-xs text-[#856404]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This information is for general educational purposes and does not replace professional dental advice.
              Specific treatment plans are determined after a clinical examination by our dental specialists.
            </p>
          </div>

          {/* Modal Footer CTA */}
          <div className="pt-4 border-t border-[#E8E6DF] flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#15222E] hover:bg-[#FAF9F5] rounded-lg transition-colors cursor-pointer"
            >
              Back to Services
            </button>
            <button
              onClick={() => {
                onClose();
                navigateTo('booking', { serviceSlug: service.slug });
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment for this Service</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
