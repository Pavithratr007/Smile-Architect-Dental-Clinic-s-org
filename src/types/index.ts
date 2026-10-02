export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-show';

export type CommunicationPreference = 'WhatsApp' | 'Phone' | 'Email';

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  role: string;
  specialization: string;
  shortBio: string;
  fullBio: string;
  specialties: string[];
  daysAvailable: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  isActive: boolean;
  avatarColor: string;
}

export type ServiceCategory =
  | 'General Dentistry'
  | 'Pediatric Dentistry'
  | 'Cosmetic Dentistry'
  | 'Orthodontics'
  | 'Endodontics'
  | 'Prosthodontics'
  | 'Implantology'
  | 'Oral & Maxillofacial'
  | 'Periodontics';

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategory;
  description: string;
  durationMinutes: number;
  priceNote: string; // e.g. "Price available after consultation"
  customPrice?: number;
  assignedDoctorId?: string; // id of doctor specialist
  isActive: boolean;
  whatItIs: string;
  whenNeeded: string[];
  whatToExpect: string[];
  faqs: { question: string; answer: string }[];
}

export interface Appointment {
  id: string;
  bookingRef: string; // e.g. "SA-8291"
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge?: number;
  isNewPatient: boolean;
  preferredContact: CommunicationPreference;
  serviceId: string;
  serviceName: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:30 AM"
  endTime?: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicTimingShift {
  name: string;
  start: string; // "10:00"
  end: string; // "13:30"
  label: string; // "10:00 AM - 1:30 PM"
}

export interface ClinicSchedule {
  workingDays: string[]; // ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  morningShift: ClinicTimingShift;
  eveningShift: ClinicTimingShift;
  sundayNotice: string; // "Prior appointment only"
  slotDurationMinutes: number; // default 30
  bufferMinutes: number; // default 0
  maxDailyAppointments: number; // default 24
}

export interface BlockedDate {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Clinic' | 'Treatment Room' | 'Dental Equipment' | 'Waiting Area' | 'Team' | 'Branding';
  description: string;
  imageTag: string; // visual motif / render representation
}

export interface PatientReview {
  id: string;
  patientName: string;
  rating: number; // 5
  reviewText: string;
  date: string;
  source: string; // "Verified Patient", "Google Review"
  doctorMentioned?: string;
  isApproved: boolean;
}

export interface ClinicSettings {
  name: string;
  tagline: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  phoneRaw: string; // 9036827916
  whatsappNumber: string;
  email: string;
  googleMapsUrl: string;
  announcementText?: string;
  showAnnouncement: boolean;
}

export type ActivePage =
  | 'home'
  | 'about'
  | 'doctors'
  | 'services'
  | 'service-detail'
  | 'booking'
  | 'gallery'
  | 'reviews'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'admin';
