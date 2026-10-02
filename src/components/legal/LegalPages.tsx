import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const { navigateTo, settings } = useClinic();

  return (
    <div className="py-16 bg-[#FAF9F5] min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0D6969] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white p-8 rounded-2xl border border-[#E8E6DF] shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E8E6DF]">
            <div className="p-2.5 rounded-xl bg-[#EEF8F7] text-[#0D6969]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#15222E]">Privacy Policy</h1>
              <p className="text-xs text-[#64748B]">Smile Architect Dental Clinic · Mysuru</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-xs sm:text-sm text-[#1E252B]/85 space-y-4 leading-relaxed">
            <p>
              At <strong>{settings.name}</strong>, protecting the privacy and confidentiality of our patients
              is a primary commitment. This policy describes how we collect, store, and safeguard your medical and contact information.
            </p>

            <h3 className="text-base font-bold text-[#15222E] pt-2">1. Information We Collect</h3>
            <p>
              When you schedule an appointment via our website or in person, we collect essential details including your name,
              contact mobile number, email address, age, appointment history, and clinical symptoms described.
            </p>

            <h3 className="text-base font-bold text-[#15222E] pt-2">2. Confidentiality & Medical Records</h3>
            <p>
              All clinical records, diagnostic charts, treatment notes, and radiographs remain strictly confidential under
              established healthcare ethics and dental council standards. We never sell, lease, or distribute patient information
              to third parties.
            </p>

            <h3 className="text-base font-bold text-[#15222E] pt-2">3. Communication & Reminders</h3>
            <p>
              We use your provided contact details solely for appointment confirmations, scheduling modifications, recall reminders,
              and essential post-operative follow-up.
            </p>

            <h3 className="text-base font-bold text-[#15222E] pt-2">4. Clinic Contact</h3>
            <p>
              If you have any questions regarding your patient data, please contact us at {settings.phone} or visit our clinic at {settings.addressLine1}, Hebbal, Mysuru.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TermsConditions: React.FC = () => {
  const { navigateTo, settings } = useClinic();

  return (
    <div className="py-16 bg-[#FAF9F5] min-h-[70vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={() => navigateTo('home')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0D6969] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white p-8 rounded-2xl border border-[#E8E6DF] shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E8E6DF]">
            <div className="p-2.5 rounded-xl bg-[#F6EDE8] text-[#6D4C41]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#15222E]">Terms & Appointment Policy</h1>
              <p className="text-xs text-[#64748B]">Smile Architect Dental Clinic · Mysuru</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-xs sm:text-sm text-[#1E252B]/85 space-y-4 leading-relaxed">
            <h3 className="text-base font-bold text-[#15222E]">1. Appointment Scheduling</h3>
            <p>
              Appointments booked online represent confirmed consultation slots. We request patients to arrive 5–10 minutes
              prior to their scheduled time to ensure smooth clinical flow.
            </p>

            <h3 className="text-base font-bold text-[#15222E] pt-2">2. Rescheduling & Cancellations</h3>
            <p>
              If you need to reschedule or cancel your visit, please inform the clinic at least 3 hours in advance via phone or WhatsApp
              ({settings.phone}) so that the designated time slot can be made available to other emergency patients.
            </p>

            <h3 className="text-base font-bold text-[#15222E] pt-2">3. Educational Content Disclaimer</h3>
            <p>
              All service descriptions, FAQ answers, and oral health guides on this website are provided strictly for general
              educational awareness. They do not constitute individual medical diagnosis or replace chairside professional dental consultation.
            </p>

            <h3 className="text-base font-bold text-[#15222E] pt-2">4. Treatment Estimates</h3>
            <p>
              Exact clinical fees, material choices, and visit durations are determined following visual and diagnostic evaluation by our doctors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
