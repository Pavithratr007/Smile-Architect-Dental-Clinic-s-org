import React from 'react';
import { Doctor } from '../../types';
import { useClinic } from '../../context/ClinicContext';
import { X, Calendar, Check, GraduationCap, Award } from 'lucide-react';
import { ClinicVisual } from '../common/ClinicVisuals';

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  onClose: () => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({ doctor, onClose }) => {
  const { navigateTo } = useClinic();

  if (!doctor) return null;

  const visualType = doctor.id === 'doc-1' ? 'doctor-pediatric' : 'doctor-surgeon';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#E8E6DF] shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Doctor Profile"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#15222E] shadow-sm border border-[#E8E6DF] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="p-6 sm:p-8 bg-[#FAF9F5] border-b border-[#E8E6DF] flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-28 h-28 shrink-0 rounded-2xl overflow-hidden shadow-md border border-[#E8E6DF]">
            <ClinicVisual type={visualType} className="w-full h-full" alt={doctor.name} />
          </div>

          <div className="text-center sm:text-left space-y-1.5">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#0D6969]">
              Specialist Profile
            </span>
            <h3 className="text-2xl font-bold text-[#15222E]">{doctor.name}</h3>
            <p className="text-xs font-semibold text-[#6D4C41] flex items-center justify-center sm:justify-start gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{doctor.qualification}</span>
            </p>
            <p className="text-xs text-[#64748B] font-medium">{doctor.role}</p>

            <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {doctor.isActive ? 'Available for Consultations' : 'Temporarily Unavailable'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Biography */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#15222E] mb-2 flex items-center gap-1.5">
              <span>About Dr. {doctor.name.split(' ')[1] || doctor.name}</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#1E252B]/85 leading-relaxed">
              {doctor.fullBio || doctor.shortBio}
            </p>
          </div>

          {/* Specialties Focus */}
          {doctor.specialties && doctor.specialties.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-[#15222E] mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#0D6969]" />
                <span>Clinical Focus & Specialties</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1E252B]">
                {doctor.specialties.map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F5] border border-[#E8E6DF]">
                    <Check className="w-3.5 h-3.5 text-[#0D6969] shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consultation Days */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#15222E] mb-2">
              Consultation Schedule
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                const isAvail = doctor.daysAvailable.includes(day);
                return (
                  <span
                    key={day}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium border ${
                      isAvail
                        ? 'bg-[#EEF8F7] border-[#D1EAE7] text-[#0D6969]'
                        : 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </span>
                );
              })}
            </div>
            <p className="text-[11px] text-[#64748B] mt-2">
              Timings: 10:00 AM - 1:30 PM & 5:00 PM - 8:30 PM (Sunday by prior appointment only)
            </p>
          </div>

          {/* Action */}
          <div className="pt-4 border-t border-[#E8E6DF] flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-[#15222E] hover:bg-[#FAF9F5] rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                navigateTo('booking', { doctorId: doctor.id });
              }}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book with Dr. {doctor.name.split(' ')[1] || doctor.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
