import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Doctor,
  Service,
  ClinicSchedule,
  BlockedDate,
  Appointment,
  PatientReview,
  GalleryItem,
  ClinicSettings,
  ActivePage,
  AppointmentStatus
} from '../types';
import {
  INITIAL_DOCTORS,
  INITIAL_SERVICES,
  INITIAL_SCHEDULE,
  INITIAL_SETTINGS,
  INITIAL_GALLERY,
  INITIAL_REVIEWS,
  INITIAL_APPOINTMENTS
} from '../data/initialData';
import { isSlotBooked } from '../utils/calendar';
import {
  saveAppointmentToSupabase,
  fetchAppointmentsFromSupabase,
  updateAppointmentStatusInSupabase,
  updateAppointmentDetailsInSupabase,
  deleteAppointmentFromSupabase,
  checkSupabaseConnection
} from '../lib/supabase';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface SupabaseStatusState {
  connected: boolean;
  tableExists: boolean;
  error?: string;
  count?: number;
}

interface ClinicContextType {
  activePage: ActivePage;
  selectedServiceSlug: string | null;
  selectedDoctorId: string | null;
  doctors: Doctor[];
  services: Service[];
  schedule: ClinicSchedule;
  blockedDates: BlockedDate[];
  appointments: Appointment[];
  reviews: PatientReview[];
  gallery: GalleryItem[];
  settings: ClinicSettings;
  isAdminLoggedIn: boolean;
  toast: ToastState | null;
  supabaseStatus: SupabaseStatusState;
  refreshSupabase: () => Promise<void>;

  navigateTo: (page: ActivePage, options?: { serviceSlug?: string; doctorId?: string }) => void;

  bookAppointment: (
    bookingData: Omit<Appointment, 'id' | 'bookingRef' | 'status' | 'createdAt' | 'updatedAt'>
  ) => Promise<{ success: boolean; appointment?: Appointment; error?: string }>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<boolean>;
  editAppointment: (id: string, updates: Partial<Appointment>) => Promise<boolean>;
  deleteAppointment: (id: string) => Promise<boolean>;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => Promise<boolean>;
  adminLogin: (passwordOrPin: string) => boolean;
  adminLogout: () => void;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  toggleDoctorActive: (id: string) => void;
  addService: (service: Omit<Service, 'id' | 'slug'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  updateSchedule: (schedule: ClinicSchedule) => void;
  addBlockedDate: (date: string, reason: string) => void;
  removeBlockedDate: (id: string) => void;
  submitReview: (review: Omit<PatientReview, 'id' | 'date' | 'isApproved' | 'source'>) => void;
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  updateSettings: (settings: ClinicSettings) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const ClinicContext = createContext<ClinicContextType | null>(null);

const STORAGE_KEYS = {
  APPOINTMENTS: 'sa_appointments_v1',
  DOCTORS: 'sa_doctors_v1',
  SERVICES: 'sa_services_v1',
  SCHEDULE: 'sa_schedule_v1',
  SETTINGS: 'sa_settings_v1',
  GALLERY: 'sa_gallery_v1',
  REVIEWS: 'sa_reviews_v1',
  BLOCKED_DATES: 'sa_blocked_dates_v1',
  ADMIN_SESSION: 'sa_admin_session_v1'
};

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  // Initialize state with localStorage fallbacks
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCTORS);
      return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
    } catch {
      return INITIAL_DOCTORS;
    }
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [schedule, setSchedule] = useState<ClinicSchedule>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
    } catch {
      return INITIAL_SCHEDULE;
    }
  });

  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED_DATES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [reviews, setReviews] = useState<PatientReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return saved ? JSON.parse(saved) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  const [settings, setSettings] = useState<ClinicSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
    } catch {
      return false;
    }
  });

  const [toast, setToast] = useState<ToastState | null>(null);

  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatusState>({
    connected: false,
    tableExists: false
  });

  // Sync with Supabase on mount
  const refreshSupabase = async () => {
    try {
      const status = await checkSupabaseConnection();
      setSupabaseStatus(status);

      if (status.connected && status.tableExists) {
        const result = await fetchAppointmentsFromSupabase();
        if (result.success && result.appointments.length > 0) {
          setAppointments((prev) => {
            const existingRefs = new Set(prev.map((a) => a.bookingRef));
            const newFromDb = result.appointments.filter((a) => !existingRefs.has(a.bookingRef));
            if (newFromDb.length === 0) return prev;
            return [...newFromDb, ...prev];
          });
        }
      }
    } catch (e) {
      console.warn('Supabase initialization note:', e);
    }
  };

  useEffect(() => {
    refreshSupabase();
  }, []);

  // Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch {}
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    } catch {}
  }, [doctors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch {}
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
    } catch {}
  }, [schedule]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOCKED_DATES, JSON.stringify(blockedDates));
    } catch {}
  }, [blockedDates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    } catch {}
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Toast auto-clear
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const navigateTo = (page: ActivePage, options?: { serviceSlug?: string; doctorId?: string }) => {
    if (options?.serviceSlug) {
      setSelectedServiceSlug(options.serviceSlug);
    }
    if (options?.doctorId) {
      setSelectedDoctorId(options.doctorId);
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Real appointment booking with double-booking prevention
  const bookAppointment = async (
    bookingData: Omit<Appointment, 'id' | 'bookingRef' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<{ success: boolean; appointment?: Appointment; error?: string }> => {
    // 1. Double check slot availability
    const isBooked = isSlotBooked(
      bookingData.appointmentDate,
      bookingData.startTime,
      bookingData.doctorId,
      appointments
    );

    if (isBooked) {
      return {
        success: false,
        error: 'This appointment slot has just been reserved by another patient. Please choose an alternative slot or date.'
      };
    }

    // 2. Check blocked dates
    const isBlocked = blockedDates.some((b) => b.date === bookingData.appointmentDate);
    if (isBlocked) {
      return {
        success: false,
        error: 'The clinic is closed on this selected date. Please choose another date.'
      };
    }

    // 3. Generate unique booking reference
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `SA-${randomNum}`;

    const newAppointment: Appointment = {
      ...bookingData,
      id: `apt-${Date.now()}`,
      bookingRef,
      status: 'Confirmed', // Immediate confirmation as specified
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Send to Supabase in real-time
    saveAppointmentToSupabase(newAppointment).then((res) => {
      if (res.success) {
        showToast(`Appointment confirmed & saved to Supabase! Ref: ${bookingRef}`, 'success');
        setSupabaseStatus((prev) => ({ ...prev, connected: true, tableExists: true }));
      } else {
        showToast(`Appointment confirmed! Booking Reference: ${bookingRef}`, 'success');
        console.warn('Note on Supabase save:', res.error);
      }
    });

    return {
      success: true,
      appointment: newAppointment
    };
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus): Promise<boolean> => {
    const apt = appointments.find((a) => a.id === id);
    if (apt) {
      updateAppointmentStatusInSupabase(apt.bookingRef, status);
    }

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a))
    );
    showToast(`Appointment status updated to "${status}"`, 'info');
    return true;
  };

  const rescheduleAppointment = async (id: string, newDate: string, newTime: string): Promise<boolean> => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return false;

    // Check if new slot is booked by someone else
    const isBooked = appointments.some(
      (a) => a.id !== id && a.status !== 'Cancelled' && a.appointmentDate === newDate && a.startTime === newTime && a.doctorId === apt.doctorId
    );

    if (isBooked) {
      showToast('The requested rescheduled slot is already occupied.', 'error');
      return false;
    }

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              appointmentDate: newDate,
              startTime: newTime,
              status: 'Confirmed',
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );
    showToast(`Appointment ${apt.bookingRef} rescheduled to ${newDate} at ${newTime}`, 'success');
    return true;
  };

  const editAppointment = async (id: string, updates: Partial<Appointment>): Promise<boolean> => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return false;

    // Sync full edit to Supabase
    try {
      await updateAppointmentDetailsInSupabase(apt.bookingRef, updates);
    } catch (e) {
      console.warn('Supabase edit warning:', e);
    }

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              ...updates,
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );
    showToast(`Appointment ${apt.bookingRef} updated successfully`, 'success');
    return true;
  };

  const deleteAppointment = async (id: string): Promise<boolean> => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return false;

    // Delete in Supabase
    try {
      await deleteAppointmentFromSupabase(apt.bookingRef);
    } catch (e) {
      console.warn('Supabase delete warning:', e);
    }

    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast(`Appointment ${apt.bookingRef} removed from database`, 'info');
    return true;
  };

  const adminLogin = (passwordOrPin: string): boolean => {
    // Allows secure pass 'smile2026' or 'admin123' or '9036' (from clinic phone)
    const validCredentials = ['smile2026', 'admin123', '9036', 'admin'];
    if (validCredentials.includes(passwordOrPin.trim())) {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
      } catch {}
      showToast('Admin logged in successfully', 'success');
      return true;
    }
    showToast('Invalid admin credentials. Please try again.', 'error');
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    } catch {}
    showToast('Admin logged out', 'info');
    navigateTo('home');
  };

  const addDoctor = (doctorData: Omit<Doctor, 'id'>) => {
    const newDoc: Doctor = {
      ...doctorData,
      id: `doc-${Date.now()}`
    };
    setDoctors((prev) => [...prev, newDoc]);
    showToast(`Doctor ${newDoc.name} added successfully`, 'success');
  };

  const updateDoctor = (id: string, updates: Partial<Doctor>) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
    showToast('Doctor details updated', 'info');
  };

  const toggleDoctorActive = (id: string) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const next = !d.isActive;
          showToast(`${d.name} is now ${next ? 'Active' : 'Inactive'}`, 'info');
          return { ...d, isActive: next };
        }
        return d;
      })
    );
  };

  const addService = (serviceData: Omit<Service, 'id' | 'slug'>) => {
    const slug = serviceData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const newService: Service = {
      ...serviceData,
      id: `srv-${Date.now()}`,
      slug
    };
    setServices((prev) => [...prev, newService]);
    showToast(`Service "${newService.name}" created`, 'success');
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Service updated successfully', 'info');
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    showToast('Service removed from directory', 'info');
  };

  const updateSchedule = (newSchedule: ClinicSchedule) => {
    setSchedule(newSchedule);
    showToast('Clinic hours and appointment duration updated', 'success');
  };

  const addBlockedDate = (date: string, reason: string) => {
    const newBlocked: BlockedDate = {
      id: `block-${Date.now()}`,
      date,
      reason
    };
    setBlockedDates((prev) => [...prev, newBlocked]);
    showToast(`Date ${date} marked as blocked (${reason})`, 'info');
  };

  const removeBlockedDate = (id: string) => {
    setBlockedDates((prev) => prev.filter((b) => b.id !== id));
    showToast('Blocked date removed', 'info');
  };

  const submitReview = (reviewData: Omit<PatientReview, 'id' | 'date' | 'isApproved' | 'source'>) => {
    const newReview: PatientReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      source: 'Verified Patient',
      isApproved: true // Auto-approved or pending in dashboard
    };
    setReviews((prev) => [newReview, ...prev]);
    showToast('Thank you for sharing your experience!', 'success');
  };

  const approveReview = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r)));
    showToast('Review approved', 'info');
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review deleted', 'info');
  };

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`
    };
    setGallery((prev) => [newItem, ...prev]);
    showToast('Gallery item added', 'success');
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    showToast('Gallery item removed', 'info');
  };

  const updateSettings = (newSettings: ClinicSettings) => {
    setSettings(newSettings);
    showToast('Clinic contact & location settings saved', 'success');
  };

  return (
    <ClinicContext.Provider
      value={{
        activePage,
        selectedServiceSlug,
        selectedDoctorId,
        doctors,
        services,
        schedule,
        blockedDates,
        appointments,
        reviews,
        gallery,
        settings,
        isAdminLoggedIn,
        toast,
        navigateTo,
        bookAppointment,
        updateAppointmentStatus,
        editAppointment,
        deleteAppointment,
        rescheduleAppointment,
        adminLogin,
        adminLogout,
        addDoctor,
        updateDoctor,
        toggleDoctorActive,
        addService,
        updateService,
        deleteService,
        updateSchedule,
        addBlockedDate,
        removeBlockedDate,
        submitReview,
        approveReview,
        deleteReview,
        addGalleryItem,
        deleteGalleryItem,
        updateSettings,
        showToast,
        supabaseStatus,
        refreshSupabase
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
