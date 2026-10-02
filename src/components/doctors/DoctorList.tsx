import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Doctor } from '../../types';
import { DoctorProfileModal } from './DoctorProfileModal';
import { ClinicVisual } from '../common/ClinicVisuals';
import { Calendar, User, GraduationCap, ArrowRight } from 'lucide-react';

export const DoctorList: React.FC = () => {
  const { doctors, navigateTo } = useClinic();
  const [activeDoctorModal, setActiveDoctorModal] = useState<Doctor | null>(null);

  // Active doctors
  const activeDoctors = doctors.filter((d) => d.isActive);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#0D6969]">
            Dental Specialists
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#15222E] tracking-tight mt-1.5" style={{ textWrap: 'balance' }}>
            Meet Our Experienced Doctors
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            Our multi-speciality clinical team combines postgraduate training in pediatric dentistry,
            preventive dental health, oral & maxillofacial surgery, and dental implantology.
          </p>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mx-auto">
          {activeDoctors.map((doc) => {
            const visualType = doc.id === 'doc-1' ? 'doctor-pediatric' : 'doctor-surgeon';

            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-[#E8E6DF] hover:border-[#CBD5E1] shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
              >
                {/* Visual Portrait */}
                <div className="relative aspect-[4/3] w-full bg-[#F4ECE7] overflow-hidden border-b border-[#E8E6DF]">
                  <ClinicVisual type={visualType} className="w-full h-full object-cover" alt={doc.name} />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8E6DF] text-[11px] font-semibold text-[#0D6969]">
                    {doc.specialization}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#15222E] tracking-tight">
                      {doc.name}
                    </h3>

                    {/* Qualifications */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6D4C41]">
                      <GraduationCap className="w-4 h-4 shrink-0 text-[#6D4C41]" />
                      <span>{doc.qualification}</span>
                    </div>

                    {/* Role */}
                    <p className="text-xs text-[#0D6969] font-medium">
                      {doc.role}
                    </p>

                    {/* Short Biography */}
                    <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed pt-1">
                      {doc.shortBio}
                    </p>
                  </div>

                  {/* Specialties Pills */}
                  {doc.specialties && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {doc.specialties.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] bg-[#FAF9F5] text-[#1E252B] border border-[#E8E6DF]"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="pt-4 border-t border-[#E8E6DF] flex items-center justify-between gap-3">
                    <button
                      onClick={() => setActiveDoctorModal(doc)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#15222E] hover:text-[#0D6969] transition-colors cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => navigateTo('booking', { doctorId: doc.id })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-lg transition-colors cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Appointment</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Schedule note banner */}
        <div className="mt-12 max-w-2xl mx-auto p-4 rounded-xl bg-[#EEF8F7] border border-[#D1EAE7] flex items-center justify-between text-xs text-[#0D6969]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0D6969] shrink-0" />
            <span>Regular Hours: Mon – Sat (10:00 AM – 1:30 PM & 5:00 PM – 8:30 PM)</span>
          </div>
          <button
            onClick={() => navigateTo('booking')}
            className="font-semibold underline hover:text-[#094F4F] cursor-pointer"
          >
            Check Slots
          </button>
        </div>
      </div>

      {/* Doctor Modal */}
      {activeDoctorModal && (
        <DoctorProfileModal
          doctor={activeDoctorModal}
          onClose={() => setActiveDoctorModal(null)}
        />
      )}
    </section>
  );
};
