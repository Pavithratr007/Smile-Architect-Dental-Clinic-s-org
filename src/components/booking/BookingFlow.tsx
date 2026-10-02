import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Service,
  Doctor,
  CommunicationPreference,
  Appointment
} from '../../types';
import {
  generateDayTimeSlots,
  isSlotBooked,
  formatReadableDate,
  generateGoogleCalendarUrl,
  downloadIcsFile
} from '../../utils/calendar';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  MapPin,
  MessageCircle,
  AlertCircle,
  CalendarPlus,
  Navigation,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { ClinicVisual } from '../common/ClinicVisuals';

export const BookingFlow: React.FC = () => {
  const {
    services,
    doctors,
    schedule,
    blockedDates,
    appointments,
    settings,
    bookAppointment,
    selectedServiceSlug,
    selectedDoctorId
  } = useClinic();

  // Multi-step state: 1 (Service) -> 2 (Doctor) -> 3 (Date) -> 4 (Time) -> 5 (Patient Details) -> 6 (Confirmation)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selection states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Patient Info Form States
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [isNewPatient, setIsNewPatient] = useState<boolean>(true);
  const [preferredContact, setPreferredContact] = useState<CommunicationPreference>('WhatsApp');
  const [notes, setNotes] = useState('');

  // Processing & Error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Category filter in Step 1
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>('All');
  const [serviceSearch, setServiceSearch] = useState<string>('');

  // Sync initial preselection if opened from service card or doctor card
  useEffect(() => {
    if (selectedServiceSlug) {
      const matchSrv = services.find((s) => s.slug === selectedServiceSlug && s.isActive);
      if (matchSrv) {
        setSelectedService(matchSrv);
        if (matchSrv.assignedDoctorId) {
          const matchDoc = doctors.find((d) => d.id === matchSrv.assignedDoctorId && d.isActive);
          if (matchDoc) setSelectedDoctor(matchDoc);
        }
      }
    }
    if (selectedDoctorId) {
      const matchDoc = doctors.find((d) => d.id === selectedDoctorId && d.isActive);
      if (matchDoc) setSelectedDoctor(matchDoc);
    }
  }, [selectedServiceSlug, selectedDoctorId, services, doctors]);

  // Today's date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Helper: check if date is blocked or past
  const isDateUnavailable = (dateStr: string) => {
    if (!dateStr) return true;
    if (dateStr < todayStr) return true;
    return blockedDates.some((b) => b.date === dateStr);
  };

  // Generate real morning and evening time slots based on clinic schedule
  const slots = generateDayTimeSlots(schedule, schedule.slotDurationMinutes || 30);

  // Check if Sunday
  const isSelectedDateSunday = () => {
    if (!selectedDate) return false;
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.getDay() === 0;
  };

  // Form submission handler
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!patientName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanPhone = patientPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!patientEmail.includes('@') || !patientEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!selectedService || !selectedDoctor || !selectedDate || !selectedTimeSlot) {
      setErrorMessage('Please complete all booking steps.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await bookAppointment({
        patientName: patientName.trim(),
        patientPhone: cleanPhone.startsWith('91') ? `+${cleanPhone}` : `+91 ${cleanPhone}`,
        patientEmail: patientEmail.trim().toLowerCase(),
        patientAge: patientAge ? parseInt(patientAge, 10) : undefined,
        isNewPatient,
        preferredContact,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        appointmentDate: selectedDate,
        startTime: selectedTimeSlot,
        notes: notes.trim()
      });

      if (result.success && result.appointment) {
        setConfirmedAppointment(result.appointment);
        setCurrentStep(6); // Step 6: Confirmation
      } else {
        setErrorMessage(result.error || "We couldn't complete your booking. Please try again or contact the clinic.");
      }
    } catch {
      setErrorMessage("We couldn't complete your booking. Please try again or contact the clinic.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick WhatsApp link generator
  const getWhatsAppConfirmationUrl = () => {
    if (!confirmedAppointment) return '#';
    const text = encodeURIComponent(
      `Hello Smile Architect Dental Clinic, I have booked appointment ref: ${confirmedAppointment.bookingRef} for ${confirmedAppointment.patientName} on ${formatReadableDate(confirmedAppointment.appointmentDate)} at ${confirmedAppointment.startTime} with ${confirmedAppointment.doctorName}.`
    );
    return `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${text}`;
  };

  return (
    <section className="py-12 sm:py-20 bg-[#FAF9F5] min-h-[85vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#0D6969]">
            Online Appointment System
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#15222E] tracking-tight mt-1">
            Book Your Dental Consultation
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2">
            Instant confirmation with our dental specialists. Real-time availability with zero double-booking.
          </p>
        </div>

        {/* Step Progress Tracker */}
        {currentStep < 6 && (
          <div className="mb-10 bg-white p-4 rounded-2xl border border-[#E8E6DF] shadow-sm">
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {[
                { step: 1, label: 'Service' },
                { step: 2, label: 'Doctor' },
                { step: 3, label: 'Date' },
                { step: 4, label: 'Time' },
                { step: 5, label: 'Details' }
              ].map((item) => {
                const isPassed = currentStep > item.step;
                const isCurrent = currentStep === item.step;
                return (
                  <div key={item.step} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isPassed
                          ? 'bg-[#0D6969] text-white'
                          : isCurrent
                          ? 'bg-[#15222E] text-white ring-4 ring-[#EEF8F7]'
                          : 'bg-[#FAF9F5] text-slate-400 border border-[#E8E6DF]'
                      }`}
                    >
                      {isPassed ? <CheckCircle className="w-4 h-4" /> : item.step}
                    </div>
                    <span
                      className={`mt-1.5 text-[11px] font-medium hidden sm:block ${
                        isCurrent ? 'text-[#15222E] font-bold' : 'text-slate-500'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <div className="flex-1">
              <p className="font-semibold">Unable to proceed</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* ================= STEP 1: CHOOSE SERVICE ================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
              <div>
                <h2 className="text-xl font-bold text-[#15222E]">Step 1: Choose Service</h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Select the dental treatment or consultation you require.
                </p>
              </div>

              {/* Quick search input */}
              <input
                type="text"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Search treatments..."
                className="px-3 py-2 text-xs border border-[#E8E6DF] rounded-lg focus:outline-none focus:border-[#0D6969] w-full sm:w-60"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {['All', 'General Dentistry', 'Pediatric Dentistry', 'Oral & Maxillofacial', 'Endodontics', 'Implantology', 'Orthodontics'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setServiceCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer border ${
                    serviceCategoryFilter === cat
                      ? 'bg-[#15222E] text-white border-[#15222E]'
                      : 'bg-[#FAF9F5] text-[#1E252B] border-[#E8E6DF] hover:bg-[#F6EDE8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Services List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {services
                .filter((s) => s.isActive)
                .filter((s) => serviceCategoryFilter === 'All' || s.category === serviceCategoryFilter)
                .filter(
                  (s) =>
                    !serviceSearch ||
                    s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                    s.category.toLowerCase().includes(serviceSearch.toLowerCase())
                )
                .map((srv) => {
                  const isSelected = selectedService?.id === srv.id;
                  const doc = doctors.find((d) => d.id === srv.assignedDoctorId);

                  return (
                    <div
                      key={srv.id}
                      onClick={() => {
                        setSelectedService(srv);
                        // Auto-recommend assigned doctor if present
                        if (doc && !selectedDoctor) {
                          setSelectedDoctor(doc);
                        }
                      }}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#EEF8F7] border-[#0D6969] ring-2 ring-[#0D6969]/20 shadow-sm'
                          : 'bg-[#FAF9F5] border-[#E8E6DF] hover:bg-white hover:border-[#CBD5E1]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#0D6969]">
                            {srv.category}
                          </span>
                          <h4 className="text-sm font-bold text-[#15222E] mt-0.5">
                            {srv.name}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#64748B] shrink-0">
                          <Clock className="w-3 h-3 text-[#0D6969]" />
                          <span>{srv.durationMinutes}m</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#64748B] mt-2 line-clamp-2">
                        {srv.description}
                      </p>

                      <div className="mt-3 pt-2 border-t border-[#E8E6DF]/60 flex items-center justify-between text-[11px]">
                        <span className="text-[#6D4C41] font-semibold">
                          {srv.customPrice
                            ? `₹${srv.customPrice.toLocaleString('en-IN')}`
                            : srv.priceNote}
                        </span>
                        {doc && <span className="text-slate-500">Dr. {doc.name.split(' ')[1]}</span>}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Next Button */}
            <div className="pt-4 border-t border-[#E8E6DF] flex items-center justify-between">
              <span className="text-xs text-[#64748B]">
                {selectedService ? (
                  <span>Selected: <strong>{selectedService.name}</strong></span>
                ) : (
                  'Please select a service to proceed'
                )}
              </span>

              <button
                disabled={!selectedService}
                onClick={() => {
                  setErrorMessage(null);
                  setCurrentStep(2);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer ${
                  selectedService
                    ? 'bg-[#0D6969] hover:bg-[#094F4F]'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <span>Continue to Doctor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: CHOOSE DOCTOR ================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[#E8E6DF]">
              <h2 className="text-xl font-bold text-[#15222E]">Step 2: Choose Doctor</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Select your specialist dentist or choose based on your treatment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors
                .filter((d) => d.isActive)
                .map((doc) => {
                  const isSelected = selectedDoctor?.id === doc.id;
                  const visualType = doc.id === 'doc-1' ? 'doctor-pediatric' : 'doctor-surgeon';

                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctor(doc)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#EEF8F7] border-[#0D6969] ring-2 ring-[#0D6969]/20 shadow-sm'
                          : 'bg-[#FAF9F5] border-[#E8E6DF] hover:bg-white hover:border-[#CBD5E1]'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#E8E6DF]">
                          <ClinicVisual type={visualType} className="w-full h-full" alt={doc.name} />
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-[#15222E]">{doc.name}</h4>
                          <p className="text-xs font-semibold text-[#6D4C41]">{doc.qualification}</p>
                          <p className="text-xs text-[#0D6969] font-medium">{doc.role}</p>
                        </div>
                      </div>

                      <p className="text-xs text-[#64748B] mt-3 leading-relaxed line-clamp-2">
                        {doc.shortBio}
                      </p>

                      <div className="mt-3 pt-3 border-t border-[#E8E6DF]/70 flex items-center justify-between text-[11px] text-[#15222E]">
                        <span>Consults: Mon - Sat</span>
                        {isSelected && (
                          <span className="font-semibold text-[#0D6969] flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Selected
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-[#E8E6DF] flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#15222E] hover:bg-[#FAF9F5] rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                disabled={!selectedDoctor}
                onClick={() => {
                  setErrorMessage(null);
                  setCurrentStep(3);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer ${
                  selectedDoctor
                    ? 'bg-[#0D6969] hover:bg-[#094F4F]'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <span>Continue to Date</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: CHOOSE DATE ================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[#E8E6DF]">
              <h2 className="text-xl font-bold text-[#15222E]">Step 3: Choose Date</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Select your preferred appointment date with Dr. {selectedDoctor?.name}.
              </p>
            </div>

            {/* Date Picker Section */}
            <div className="max-w-md mx-auto space-y-4">
              <label htmlFor="appointment-date-picker" className="block text-xs font-bold text-[#15222E] uppercase tracking-wider">
                Select Consultation Date
              </label>

              <div className="relative">
                <input
                  id="appointment-date-picker"
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => {
                    const chosen = e.target.value;
                    if (chosen < todayStr) {
                      setErrorMessage('Please select a future date.');
                      return;
                    }
                    setErrorMessage(null);
                    setSelectedDate(chosen);
                    setSelectedTimeSlot(''); // Reset slot on date change
                  }}
                  className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E8E6DF] rounded-xl text-sm font-semibold text-[#15222E] focus:outline-none focus:border-[#0D6969] shadow-inner"
                />
              </div>

              {/* Sunday Notice */}
              {isSelectedDateSunday() && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Sunday Note:</strong> Clinic is open for prior appointments only on Sundays. Slots will be specifically confirmed by our clinic reception.
                  </span>
                </div>
              )}

              {/* Quick Select Next 5 Available Working Days */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-[#64748B] mb-2">Quick Dates:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((offset) => {
                    const d = new Date();
                    d.setDate(d.getDate() + offset);
                    const dateStr = d.toISOString().split('T')[0];
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        key={dateStr}
                        type="button"
                        onClick={() => {
                          setSelectedDate(dateStr);
                          setSelectedTimeSlot('');
                          setErrorMessage(null);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer text-xs ${
                          isSelected
                            ? 'bg-[#15222E] text-white border-[#15222E] font-bold'
                            : 'bg-[#FAF9F5] text-[#1E252B] border-[#E8E6DF] hover:bg-white'
                        }`}
                      >
                        <div className="text-[10px] text-slate-400">
                          {d.toLocaleDateString('en-IN', { weekday: 'short' })}
                        </div>
                        <div className="font-semibold">
                          {d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-[#E8E6DF] flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#15222E] hover:bg-[#FAF9F5] rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                disabled={!selectedDate || isDateUnavailable(selectedDate)}
                onClick={() => {
                  setErrorMessage(null);
                  setCurrentStep(4);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer ${
                  selectedDate && !isDateUnavailable(selectedDate)
                    ? 'bg-[#0D6969] hover:bg-[#094F4F]'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <span>Continue to Time Slots</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: SHOW AVAILABLE TIME SLOTS ================= */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[#E8E6DF]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#15222E]">Step 4: Select Time Slot</h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Available consultation slots for {formatReadableDate(selectedDate)} with {selectedDoctor?.name}.
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-xs font-bold text-[#0D6969] tabular-nums">
                    {schedule.slotDurationMinutes} min consultations
                  </span>
                </div>
              </div>
            </div>

            {/* Morning Shift Slots */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#15222E]">
                <Clock className="w-4 h-4 text-[#0D6969]" />
                <span>Morning Shift (10:00 AM – 1:30 PM)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {slots.morning.map((slot) => {
                  const booked = isSlotBooked(selectedDate, slot, selectedDoctor?.id || '', appointments);
                  const isSelected = selectedTimeSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={booked}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center justify-center cursor-pointer ${
                        booked
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-[#0D6969] text-white border-[#0D6969] shadow-sm'
                          : 'bg-[#FAF9F5] border-[#E8E6DF] text-[#15222E] hover:border-[#0D6969] hover:bg-white'
                      }`}
                    >
                      <span className="tabular-nums">{slot}</span>
                      <span className="text-[10px] mt-0.5 opacity-80 font-normal">
                        {booked ? 'Booked' : 'Available'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evening Shift Slots */}
            <div className="space-y-3 pt-4 border-t border-[#E8E6DF]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#15222E]">
                <Clock className="w-4 h-4 text-[#6D4C41]" />
                <span>Evening Shift (5:00 PM – 8:30 PM)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {slots.evening.map((slot) => {
                  const booked = isSlotBooked(selectedDate, slot, selectedDoctor?.id || '', appointments);
                  const isSelected = selectedTimeSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={booked}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all flex flex-col items-center justify-center cursor-pointer ${
                        booked
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-[#0D6969] text-white border-[#0D6969] shadow-sm'
                          : 'bg-[#FAF9F5] border-[#E8E6DF] text-[#15222E] hover:border-[#0D6969] hover:bg-white'
                      }`}
                    >
                      <span className="tabular-nums">{slot}</span>
                      <span className="text-[10px] mt-0.5 opacity-80 font-normal">
                        {booked ? 'Booked' : 'Available'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-[#E8E6DF] flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#15222E] hover:bg-[#FAF9F5] rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                disabled={!selectedTimeSlot}
                onClick={() => {
                  setErrorMessage(null);
                  setCurrentStep(5);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer ${
                  selectedTimeSlot
                    ? 'bg-[#0D6969] hover:bg-[#094F4F]'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <span>Continue to Patient Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: PATIENT DETAILS ================= */}
        {currentStep === 5 && (
          <form onSubmit={handleBookingSubmit} className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="pb-4 border-b border-[#E8E6DF]">
              <h2 className="text-xl font-bold text-[#15222E]">Step 5: Patient Information</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Please enter the patient details for booking confirmation and clinic records.
              </p>
            </div>

            {/* Summary pill box */}
            <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <p className="text-[#64748B]">Service</p>
                <p className="font-bold text-[#15222E] truncate">{selectedService?.name}</p>
              </div>
              <div>
                <p className="text-[#64748B]">Specialist</p>
                <p className="font-bold text-[#15222E]">{selectedDoctor?.name}</p>
              </div>
              <div>
                <p className="text-[#64748B]">Date</p>
                <p className="font-bold text-[#15222E]">{formatReadableDate(selectedDate)}</p>
              </div>
              <div>
                <p className="text-[#64748B]">Time Slot</p>
                <p className="font-bold text-[#0D6969] tabular-nums">{selectedTimeSlot}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#15222E] mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ramesh Hegde"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8E6DF] rounded-xl text-xs sm:text-sm text-[#15222E] focus:outline-none focus:border-[#0D6969]"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-[#15222E] mb-1">
                  Mobile Number (India) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="9845012345"
                    className="w-full pl-12 pr-3 py-2.5 bg-white border border-[#E8E6DF] rounded-xl text-xs sm:text-sm text-[#15222E] focus:outline-none focus:border-[#0D6969] tabular-nums"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-[#15222E] mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8E6DF] rounded-xl text-xs sm:text-sm text-[#15222E] focus:outline-none focus:border-[#0D6969]"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-[#15222E] mb-1">
                  Age (Optional)
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g. 28 (or child's age)"
                  className="w-full px-3 py-2.5 bg-white border border-[#E8E6DF] rounded-xl text-xs sm:text-sm text-[#15222E] focus:outline-none focus:border-[#0D6969] tabular-nums"
                />
              </div>

              {/* Patient Type */}
              <div>
                <label className="block text-xs font-bold text-[#15222E] mb-1">
                  Patient Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewPatient(true)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      isNewPatient
                        ? 'bg-[#EEF8F7] border-[#0D6969] text-[#0D6969] font-bold'
                        : 'bg-white border-[#E8E6DF] text-slate-600'
                    }`}
                  >
                    New Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewPatient(false)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                      !isNewPatient
                        ? 'bg-[#EEF8F7] border-[#0D6969] text-[#0D6969] font-bold'
                        : 'bg-white border-[#E8E6DF] text-slate-600'
                    }`}
                  >
                    Existing Patient
                  </button>
                </div>
              </div>

              {/* Preferred Communication */}
              <div>
                <label className="block text-xs font-bold text-[#15222E] mb-1">
                  Preferred Communication
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['WhatsApp', 'Phone', 'Email'] as CommunicationPreference[]).map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setPreferredContact(pref)}
                      className={`py-2 px-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer text-center ${
                        preferredContact === pref
                          ? 'bg-[#15222E] border-[#15222E] text-white font-bold'
                          : 'bg-white border-[#E8E6DF] text-slate-600'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional message / reason for visit */}
            <div>
              <label className="block text-xs font-bold text-[#15222E] mb-1">
                Optional Message / Specific Symptoms
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any dental symptoms, sensitivity, or medical history..."
                className="w-full px-3 py-2 bg-white border border-[#E8E6DF] rounded-xl text-xs text-[#15222E] focus:outline-none focus:border-[#0D6969]"
              />
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-[#E8E6DF] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#15222E] hover:bg-[#FAF9F5] rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span>Reserving Slot...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm Appointment Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 6: CONFIRMATION SCREEN ================= */}
        {currentStep === 6 && confirmedAppointment && (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-10 shadow-lg space-y-8 animate-in zoom-in-95 duration-300">
            {/* Header Badge & Title */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#E0F2F1] text-[#0D6969] flex items-center justify-center shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>

              <span className="text-xs uppercase tracking-wider font-semibold text-[#0D6969]">
                ✓ Appointment Request Confirmed
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#15222E] tracking-tight">
                Thank you, {confirmedAppointment.patientName}.
              </h2>

              <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto">
                Your appointment request has been received and confirmed in our clinical system.
              </p>
            </div>

            {/* Appointment Details Card */}
            <div className="bg-[#FAF9F5] rounded-2xl p-6 border border-[#E8E6DF] max-w-xl mx-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
                <div>
                  <span className="text-xs text-[#64748B]">Appointment Reference ID</span>
                  <div className="text-sm font-bold text-[#0D6969] font-mono tracking-wider">
                    {confirmedAppointment.bookingRef}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Saved to Supabase</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#64748B]">Doctor</span>
                  <p className="text-sm font-bold text-[#15222E] mt-0.5">
                    {confirmedAppointment.doctorName}
                  </p>
                </div>

                <div>
                  <span className="text-[#64748B]">Treatment Service</span>
                  <p className="text-sm font-bold text-[#15222E] mt-0.5">
                    {confirmedAppointment.serviceName}
                  </p>
                </div>

                <div>
                  <span className="text-[#64748B]">Date</span>
                  <p className="text-sm font-bold text-[#15222E] mt-0.5">
                    {formatReadableDate(confirmedAppointment.appointmentDate)}
                  </p>
                </div>

                <div>
                  <span className="text-[#64748B]">Time Slot</span>
                  <p className="text-sm font-bold text-[#0D6969] mt-0.5 tabular-nums">
                    {confirmedAppointment.startTime}
                  </p>
                </div>
              </div>

              {/* Clinic Location */}
              <div className="pt-3 border-t border-[#E8E6DF] flex items-start gap-2.5 text-xs text-[#15222E]">
                <MapPin className="w-4 h-4 text-[#6D4C41] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#15222E]">Smile Architect Dental Clinic</span>
                  <p className="text-[#64748B] text-[11px] mt-0.5">
                    {settings.addressLine1}, {settings.addressLine2}, {settings.landmark}, {settings.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Calendar, Directions, Call, WhatsApp */}
            <div className="max-w-xl mx-auto space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Add to Calendar (.ics download) */}
                <button
                  type="button"
                  onClick={() =>
                    downloadIcsFile(
                      confirmedAppointment,
                      `${settings.name}, ${settings.addressLine1}, ${settings.city}`
                    )
                  }
                  className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-[#15222E] bg-white border border-[#E8E6DF] hover:bg-[#FAF9F5] rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  <CalendarPlus className="w-4 h-4 text-[#0D6969]" />
                  <span>Download .ICS Calendar</span>
                </button>

                {/* Google Calendar Web Link */}
                <a
                  href={generateGoogleCalendarUrl(
                    confirmedAppointment,
                    `${settings.name}, ${settings.addressLine1}, ${settings.city}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-[#15222E] bg-white border border-[#E8E6DF] hover:bg-[#FAF9F5] rounded-xl transition-colors shadow-sm"
                >
                  <CalendarIcon className="w-4 h-4 text-[#0D6969]" />
                  <span>Google Calendar</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Get Directions */}
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-[#15222E] bg-[#F6EDE8] hover:bg-[#EAE0D9] text-[#6D4C41] rounded-xl transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>

                {/* Call Clinic */}
                <a
                  href={`tel:${settings.phoneRaw}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-[#15222E] bg-white border border-[#E8E6DF] hover:bg-[#FAF9F5] rounded-xl transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#0D6969]" />
                  <span>Call Clinic</span>
                </a>

                {/* WhatsApp Clinic */}
                <a
                  href={getWhatsAppConfirmationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#1EBE5D] rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Clinic</span>
                </a>
              </div>
            </div>

            {/* Back to Home / Book Another */}
            <div className="pt-6 border-t border-[#E8E6DF] text-center">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedService(null);
                  setSelectedDoctor(null);
                  setSelectedDate('');
                  setSelectedTimeSlot('');
                  setConfirmedAppointment(null);
                }}
                className="text-xs font-semibold text-[#0D6969] hover:underline cursor-pointer"
              >
                + Book Another Consultation
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
