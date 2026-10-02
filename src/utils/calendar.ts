import { Appointment, ClinicSchedule } from '../types';

export function formatReadableDate(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function parseSlotTimeToDate(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return new Date(year, month - 1, day, 10, 0);

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3].toUpperCase();

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return new Date(year, month - 1, day, hours, minutes);
}

export function generateGoogleCalendarUrl(appointment: Appointment, clinicAddress: string): string {
  const startDate = parseSlotTimeToDate(appointment.appointmentDate, appointment.startTime);
  const endDate = new Date(startDate.getTime() + 45 * 60 * 1000); // 45 min default duration

  const formatGoogleDate = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const title = encodeURIComponent(`Dental Appointment: ${appointment.serviceName} - Smile Architect`);
  const details = encodeURIComponent(
    `Appointment Reference: ${appointment.bookingRef}\nDoctor: ${appointment.doctorName}\nService: ${appointment.serviceName}\nPatient: ${appointment.patientName}\n\nClinic Phone: +91 90368 27916\nClinic Location: ${clinicAddress}`
  );
  const location = encodeURIComponent(clinicAddress);
  const dates = `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
}

export function downloadIcsFile(appointment: Appointment, clinicAddress: string) {
  const startDate = parseSlotTimeToDate(appointment.appointmentDate, appointment.startTime);
  const endDate = new Date(startDate.getTime() + 45 * 60 * 1000);

  const formatIcsDate = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15) + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Smile Architect Dental Clinic//Appointment Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${appointment.bookingRef}-${Date.now()}@smilearchitect.in`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:Dental Visit - ${appointment.serviceName} (${appointment.doctorName})`,
    `DESCRIPTION:Smile Architect Dental Clinic\\nAppointment Ref: ${appointment.bookingRef}\\nPatient: ${appointment.patientName}\\nDoctor: ${appointment.doctorName}\\nService: ${appointment.serviceName}`,
    `LOCATION:${clinicAddress.replace(/,/g, '\\,')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `SmileArchitect-Appointment-${appointment.bookingRef}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate time slots based on shift hours and slot duration
export function generateDayTimeSlots(
  schedule: ClinicSchedule,
  intervalMinutes: number = 30
): { morning: string[]; evening: string[] } {
  const generateRange = (startStr: string, endStr: string): string[] => {
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    const slots: string[] = [];
    for (let time = startTotal; time + intervalMinutes <= endTotal; time += intervalMinutes) {
      const h = Math.floor(time / 60);
      const m = time % 60;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const displayM = m < 10 ? `0${m}` : `${m}`;
      slots.push(`${displayH}:${displayM} ${period}`);
    }
    return slots;
  };

  const morning = generateRange(schedule.morningShift.start, schedule.morningShift.end);
  const evening = generateRange(schedule.eveningShift.start, schedule.eveningShift.end);

  return { morning, evening };
}

// Check if slot is booked
export function isSlotBooked(
  slotsDate: string,
  slotTime: string,
  doctorId: string,
  appointments: Appointment[]
): boolean {
  return appointments.some((apt) => {
    if (apt.status === 'Cancelled') return false;
    const matchDate = apt.appointmentDate === slotsDate;
    const matchTime = apt.startTime.trim().toUpperCase() === slotTime.trim().toUpperCase();
    const matchDoctor = !doctorId || apt.doctorId === doctorId;
    return matchDate && matchTime && matchDoctor;
  });
}
