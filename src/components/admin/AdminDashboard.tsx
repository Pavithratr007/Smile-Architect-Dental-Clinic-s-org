import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import {
  Appointment,
  AppointmentStatus,
  Doctor,
  Service,
  ServiceCategory
} from '../../types';
import { formatReadableDate } from '../../utils/calendar';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Settings,
  Image as ImageIcon,
  MessageSquare,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Search,
  Check,
  CalendarDays,
  Database,
  Copy,
  Eye,
  Download,
  RefreshCw,
  FileSpreadsheet,
  AlertTriangle,
  X,
  Printer
} from 'lucide-react';
import { AdminLoginModal } from './AdminLoginModal';
import {
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_SQL_SCHEMA
} from '../../lib/supabase';

type AdminTab =
  | 'overview'
  | 'calendar'
  | 'appointments'
  | 'doctors'
  | 'services'
  | 'schedule'
  | 'gallery'
  | 'reviews'
  | 'settings'
  | 'supabase';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminLoggedIn,
    adminLogout,
    appointments,
    updateAppointmentStatus,
    editAppointment,
    deleteAppointment,
    rescheduleAppointment,
    bookAppointment,
    doctors,
    addDoctor,
    updateDoctor,
    toggleDoctorActive,
    services,
    addService,
    updateService,
    deleteService,
    schedule,
    updateSchedule,
    blockedDates,
    addBlockedDate,
    removeBlockedDate,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    reviews,
    approveReview,
    deleteReview,
    settings,
    updateSettings,
    navigateTo,
    supabaseStatus,
    refreshSupabase
  } = useClinic();

  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [copiedSql, setCopiedSql] = useState(false);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());

  // Filter state for appointments
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [doctorFilter, setDoctorFilter] = useState<string>('All');
  const [timeframeFilter, setTimeframeFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  const [searchAppointment, setSearchAppointment] = useState('');

  // View Details Modal State
  const [viewApt, setViewApt] = useState<Appointment | null>(null);

  // Edit Appointment Modal State
  const [editApt, setEditApt] = useState<Appointment | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editIsNew, setEditIsNew] = useState(true);
  const [editContact, setEditContact] = useState<'WhatsApp' | 'Phone' | 'Email'>('WhatsApp');
  const [editServiceId, setEditServiceId] = useState('');
  const [editDoctorId, setEditDoctorId] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<AppointmentStatus>('Confirmed');

  // Cancel & Delete Modal State
  const [cancelConfirmApt, setCancelConfirmApt] = useState<Appointment | null>(null);
  const [deleteConfirmApt, setDeleteConfirmApt] = useState<Appointment | null>(null);

  // Reschedule Modal State
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');
  const [newRescheduleTime, setNewRescheduleTime] = useState('');

  // Manual Walk-in Appointment Modal State
  const [walkinModalOpen, setWalkinModalOpen] = useState(false);
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinEmail, setWalkinEmail] = useState('');
  const [walkinServiceId, setWalkinServiceId] = useState(services[0]?.id || '');
  const [walkinDoctorId, setWalkinDoctorId] = useState(doctors[0]?.id || '');
  const [walkinDate, setWalkinDate] = useState(new Date().toISOString().split('T')[0]);
  const [walkinTime, setWalkinTime] = useState('11:00 AM');
  const [walkinNotes, setWalkinNotes] = useState('');

  // Doctor Form Modal State
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [docName, setDocName] = useState('');
  const [docQual, setDocQual] = useState('');
  const [docRole, setDocRole] = useState('');
  const [docSpec, setDocSpec] = useState('');
  const [docBio, setDocBio] = useState('');

  // Service Form Modal State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [srvName, setSrvName] = useState('');
  const [srvCategory, setSrvCategory] = useState<ServiceCategory>('General Dentistry');
  const [srvDesc, setSrvDesc] = useState('');
  const [srvDuration, setSrvDuration] = useState('30');
  const [srvPriceNote, setSrvPriceNote] = useState('Price available after consultation');
  const [srvPrice, setSrvPrice] = useState('');
  const [srvDocId, setSrvDocId] = useState(doctors[0]?.id || '');

  // Schedule settings temporary edit state
  const [schedMorningStart, setSchedMorningStart] = useState(schedule.morningShift.start);
  const [schedMorningEnd, setSchedMorningEnd] = useState(schedule.morningShift.end);
  const [schedEveningStart, setSchedEveningStart] = useState(schedule.eveningShift.start);
  const [schedEveningEnd, setSchedEveningEnd] = useState(schedule.eveningShift.end);
  const [schedSlotDuration, setSchedSlotDuration] = useState(schedule.slotDurationMinutes.toString());
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');

  // Gallery Item Modal State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState<any>('Treatment Room');
  const [galDesc, setGalDesc] = useState('');

  // Calendar view mode
  const [calendarViewMode, setCalendarViewMode] = useState<'day' | 'week' | 'month'>('month');

  // If not logged in, show login modal
  if (!isAdminLoggedIn) {
    return (
      <div className="py-20 min-h-[75vh] flex items-center justify-center bg-[#FAF9F5]">
        <AdminLoginModal onSuccess={() => setCurrentTab('overview')} onClose={() => navigateTo('home')} />
      </div>
    );
  }

  // Today date string
  const todayStr = new Date().toISOString().split('T')[0];

  // Metric Computations
  const totalAppointments = appointments.length;
  const todayAppointments = appointments.filter((a) => a.appointmentDate === todayStr);
  const upcomingAppointments = appointments.filter(
    (a) => a.appointmentDate >= todayStr && a.status !== 'Cancelled' && a.status !== 'Completed'
  );
  const pendingAppointments = appointments.filter((a) => a.status === 'Pending');
  const completedAppointments = appointments.filter((a) => a.status === 'Completed');
  const cancelledAppointments = appointments.filter((a) => a.status === 'Cancelled');

  // Popular services count
  const serviceCounts: Record<string, number> = {};
  appointments.forEach((a) => {
    serviceCounts[a.serviceName] = (serviceCounts[a.serviceName] || 0) + 1;
  });
  const popularServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]);

  // Filtered Appointments Table
  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    const matchesDoctor = doctorFilter === 'All' || apt.doctorId === doctorFilter;
    const matchesSearch =
      !searchAppointment ||
      apt.patientName.toLowerCase().includes(searchAppointment.toLowerCase()) ||
      apt.bookingRef.toLowerCase().includes(searchAppointment.toLowerCase()) ||
      apt.patientPhone.includes(searchAppointment);
    return matchesStatus && matchesDoctor && matchesSearch;
  });

  // Handle manual walkin appointment
  const handleCreateWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    const srv = services.find((s) => s.id === walkinServiceId);
    const doc = doctors.find((d) => d.id === walkinDoctorId);
    if (!srv || !doc) return;

    await bookAppointment({
      patientName: walkinName,
      patientPhone: walkinPhone,
      patientEmail: walkinEmail || 'walkin@smilearchitect.in',
      isNewPatient: true,
      preferredContact: 'Phone',
      serviceId: srv.id,
      serviceName: srv.name,
      doctorId: doc.id,
      doctorName: doc.name,
      appointmentDate: walkinDate,
      startTime: walkinTime,
      notes: walkinNotes ? `[Walk-in Entry] ${walkinNotes}` : '[Walk-in / Phone Booking]'
    });

    setWalkinModalOpen(false);
    setWalkinName('');
    setWalkinPhone('');
    setWalkinNotes('');
  };

  // Handle doctor save
  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoctor) {
      updateDoctor(editingDoctor.id, {
        name: docName,
        qualification: docQual,
        role: docRole,
        specialization: docSpec,
        shortBio: docBio,
        fullBio: docBio
      });
    } else {
      addDoctor({
        name: docName,
        qualification: docQual,
        role: docRole,
        specialization: docSpec,
        shortBio: docBio,
        fullBio: docBio,
        specialties: [docSpec],
        daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        isActive: true,
        avatarColor: 'from-[#15222E] to-[#0D6969]'
      });
    }
    setDoctorModalOpen(false);
    setEditingDoctor(null);
  };

  // Handle service save
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      updateService(editingService.id, {
        name: srvName,
        category: srvCategory,
        description: srvDesc,
        durationMinutes: parseInt(srvDuration, 10) || 30,
        priceNote: srvPriceNote,
        customPrice: srvPrice ? parseInt(srvPrice, 10) : undefined,
        assignedDoctorId: srvDocId
      });
    } else {
      addService({
        name: srvName,
        category: srvCategory,
        description: srvDesc,
        durationMinutes: parseInt(srvDuration, 10) || 30,
        priceNote: srvPriceNote,
        customPrice: srvPrice ? parseInt(srvPrice, 10) : undefined,
        assignedDoctorId: srvDocId,
        isActive: true,
        whatItIs: srvDesc,
        whenNeeded: ['Routine clinical assessment', 'Specialist consultation'],
        whatToExpect: ['Detailed clinical check', 'Treatment consultation'],
        faqs: []
      });
    }
    setServiceModalOpen(false);
    setEditingService(null);
  };

  // Handle opening edit appointment modal
  const handleOpenEdit = (apt: Appointment) => {
    setEditApt(apt);
    setEditName(apt.patientName);
    setEditPhone(apt.patientPhone);
    setEditEmail(apt.patientEmail);
    setEditAge(apt.patientAge ? String(apt.patientAge) : '');
    setEditIsNew(apt.isNewPatient);
    setEditContact(apt.preferredContact);
    setEditServiceId(apt.serviceId);
    setEditDoctorId(apt.doctorId);
    setEditDate(apt.appointmentDate);
    setEditTime(apt.startTime);
    setEditNotes(apt.notes || '');
    setEditStatus(apt.status);
  };

  // Handle saving edited appointment to local state & Supabase
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editApt) return;
    const srv = services.find((s) => s.id === editServiceId);
    const doc = doctors.find((d) => d.id === editDoctorId);

    await editAppointment(editApt.id, {
      patientName: editName,
      patientPhone: editPhone,
      patientEmail: editEmail,
      patientAge: editAge ? parseInt(editAge, 10) : undefined,
      isNewPatient: editIsNew,
      preferredContact: editContact,
      serviceId: editServiceId,
      serviceName: srv ? srv.name : editApt.serviceName,
      doctorId: editDoctorId,
      doctorName: doc ? doc.name : editApt.doctorName,
      appointmentDate: editDate,
      startTime: editTime,
      notes: editNotes,
      status: editStatus
    });

    setEditApt(null);
  };

  // Handle manual Supabase synchronization
  const handleManualSync = async () => {
    setIsSyncing(true);
    await refreshSupabase();
    setLastSyncTime(new Date().toLocaleTimeString());
    setIsSyncing(false);
  };

  // Handle export appointments to CSV
  const handleExportCsv = () => {
    const headers = [
      'Booking Ref',
      'Patient Name',
      'Phone',
      'Email',
      'Age',
      'New Patient',
      'Contact Preference',
      'Treatment Service',
      'Doctor',
      'Appointment Date',
      'Start Time',
      'Status',
      'Notes',
      'Created At'
    ];

    const rows = filteredAppointments.map((a) => [
      `"${a.bookingRef}"`,
      `"${a.patientName.replace(/"/g, '""')}"`,
      `"${a.patientPhone}"`,
      `"${a.patientEmail}"`,
      `"${a.patientAge || ''}"`,
      `"${a.isNewPatient ? 'Yes' : 'No'}"`,
      `"${a.preferredContact}"`,
      `"${a.serviceName.replace(/"/g, '""')}"`,
      `"${a.doctorName.replace(/"/g, '""')}"`,
      `"${a.appointmentDate}"`,
      `"${a.startTime}"`,
      `"${a.status}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
      `"${a.createdAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smile_architect_appointments_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen pb-20">
      {/* Top Admin Header */}
      <header className="bg-[#15222E] text-white border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-script text-2xl font-bold text-white" style={{ fontFamily: "'Caveat', cursive" }}>
              Smile Architect
            </span>
            <span className="text-xs bg-[#80CBC4]/20 text-[#80CBC4] px-2 py-0.5 rounded font-mono">
              Staff Admin
            </span>

            {/* Supabase Realtime Status Pill */}
            <button
              onClick={() => setCurrentTab('supabase')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              title="Click to view Supabase Backend Details"
            >
              <span className={`w-2 h-2 rounded-full ${supabaseStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>Supabase: {supabaseStatus.connected ? 'Connected' : 'Connecting'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('home')}
              className="text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
            >
              Public Website
            </button>
            <button
              onClick={adminLogout}
              className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-rose-100 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Navigation Bar Tabs */}
      <div className="bg-white border-b border-[#E8E6DF] sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none text-xs font-semibold">
            {[
              { id: 'overview' as const, label: 'Overview', icon: Building2 },
              { id: 'appointments' as const, label: `Appointments (${appointments.length})`, icon: CalendarIcon },
              { id: 'calendar' as const, label: 'Calendar View', icon: CalendarDays },
              { id: 'doctors' as const, label: 'Doctors', icon: User },
              { id: 'services' as const, label: 'Services', icon: Filter },
              { id: 'schedule' as const, label: 'Clinic Hours', icon: Clock },
              { id: 'gallery' as const, label: 'Gallery', icon: ImageIcon },
              { id: 'reviews' as const, label: 'Reviews', icon: MessageSquare },
              { id: 'settings' as const, label: 'Clinic Settings', icon: Settings },
              { id: 'supabase' as const, label: 'Supabase Database', icon: Database }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#15222E] text-white shadow-sm'
                      : 'text-[#1E252B]/75 hover:bg-[#FAF9F5] hover:text-[#15222E]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ================= TAB 1: OVERVIEW METRICS ================= */}
        {currentTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#15222E]">Clinic Practice Dashboard</h1>
                <p className="text-xs text-[#64748B]">Real-time metrics, appointment requests, and schedule health.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWalkinModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Walk-in / Phone Booking</span>
                </button>
              </div>
            </div>

            {/* Metrics 6-Card Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-xl border border-[#E8E6DF] shadow-sm">
                <span className="text-[11px] text-[#64748B]">Today's Visits</span>
                <p className="text-2xl font-bold text-[#0D6969] mt-1 tabular-nums">
                  {todayAppointments.length}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E8E6DF] shadow-sm">
                <span className="text-[11px] text-[#64748B]">Upcoming</span>
                <p className="text-2xl font-bold text-[#15222E] mt-1 tabular-nums">
                  {upcomingAppointments.length}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E8E6DF] shadow-sm">
                <span className="text-[11px] text-amber-700">Pending Requests</span>
                <p className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
                  {pendingAppointments.length}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E8E6DF] shadow-sm">
                <span className="text-[11px] text-emerald-700">Completed</span>
                <p className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
                  {completedAppointments.length}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E8E6DF] shadow-sm">
                <span className="text-[11px] text-rose-700">Cancelled</span>
                <p className="text-2xl font-bold text-rose-600 mt-1 tabular-nums">
                  {cancelledAppointments.length}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E8E6DF] shadow-sm">
                <span className="text-[11px] text-[#64748B]">Total Bookings</span>
                <p className="text-2xl font-bold text-[#15222E] mt-1 tabular-nums">
                  {totalAppointments}
                </p>
              </div>
            </div>

            {/* Popular Services & Today's Schedule Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Today's Appointments List */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E8E6DF] shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
                  <h3 className="text-base font-bold text-[#15222E] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0D6969]" />
                    <span>Today's Patient Schedule ({formatReadableDate(todayStr)})</span>
                  </h3>
                  <button
                    onClick={() => setCurrentTab('appointments')}
                    className="text-xs font-semibold text-[#0D6969] hover:underline"
                  >
                    View All
                  </button>
                </div>

                {todayAppointments.length === 0 ? (
                  <p className="text-xs text-[#64748B] py-8 text-center">
                    No appointments scheduled for today. Ready for walk-in consultations.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {todayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#15222E]">{apt.patientName}</span>
                            <span className="font-mono text-[10px] text-slate-500">[{apt.bookingRef}]</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                apt.status === 'Confirmed'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : apt.status === 'Completed'
                                  ? 'bg-slate-100 text-slate-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {apt.status}
                            </span>
                          </div>
                          <p className="text-[#64748B] mt-0.5">
                            {apt.serviceName} · With {apt.doctorName}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#0D6969] tabular-nums sm:text-right">{apt.startTime}</span>
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                            className="px-2 py-1 bg-white border border-[#E8E6DF] hover:bg-emerald-50 text-emerald-700 font-medium rounded transition-colors text-[11px]"
                          >
                            Mark Done
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Popular Services Demand */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E8E6DF] shadow-sm space-y-4">
                <h3 className="text-base font-bold text-[#15222E] pb-3 border-b border-[#E8E6DF]">
                  Most Requested Treatments
                </h3>

                <div className="space-y-2.5">
                  {popularServices.map(([srv, count]) => (
                    <div key={srv} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#FAF9F5]">
                      <span className="font-medium text-[#15222E] truncate max-w-[240px]">{srv}</span>
                      <span className="font-bold text-[#0D6969] tabular-nums">{count} bookings</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: APPOINTMENTS TABLE ================= */}
        {currentTab === 'appointments' && (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] shadow-sm p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[#15222E]">Appointment Management</h2>
                  <span className="text-xs bg-[#EEF8F7] text-[#0D6969] px-2.5 py-0.5 rounded-full font-bold">
                    {filteredAppointments.length} bookings
                  </span>
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">
                  View, filter, manage, edit, reschedule, or cancel patient bookings saved in your Supabase database.
                </p>
              </div>

              {/* Action Buttons: Add Walk-in, Sync Supabase, Export CSV */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#15222E] bg-[#FAF9F5] hover:bg-white border border-[#E8E6DF] rounded-xl shadow-xs transition-colors cursor-pointer"
                  title="Pull latest bookings from Supabase"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#0D6969] ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Supabase'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#15222E] bg-[#FAF9F5] hover:bg-white border border-[#E8E6DF] rounded-xl shadow-xs transition-colors cursor-pointer"
                  title="Download all bookings as CSV"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={() => setWalkinModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Walk-in Booking</span>
                </button>
              </div>
            </div>

            {/* Supabase Realtime Database Status Banner */}
            <div className="flex flex-wrap items-center justify-between text-xs px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] gap-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${supabaseStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span className="font-semibold text-[#15222E]">
                  Supabase Database: <code className="font-mono text-[#0D6969]">{SUPABASE_PROJECT_ID}</code>
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-[#64748B]">
                  Table: <code className="font-mono text-slate-700">public.appointments</code>
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-700 font-medium">
                  {supabaseStatus.tableExists ? 'Connected & Synced' : 'Ready'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#64748B]">
                <span>Last updated: {lastSyncTime}</span>
                <button
                  type="button"
                  onClick={() => setCurrentTab('supabase')}
                  className="text-[#0D6969] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Database className="w-3 h-3" />
                  <span>Database Setup & SQL</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchAppointment}
                  onChange={(e) => setSearchAppointment(e.target.value)}
                  placeholder="Search by patient name, phone, or SA-XXXX Ref ID..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#E8E6DF] rounded-xl focus:outline-none focus:border-[#0D6969] bg-white"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-[#E8E6DF] rounded-xl focus:outline-none focus:border-[#0D6969] bg-white text-[#15222E]"
              >
                <option value="All">All Statuses ({appointments.length})</option>
                <option value="Pending">Pending ({appointments.filter(a => a.status === 'Pending').length})</option>
                <option value="Confirmed">Confirmed ({appointments.filter(a => a.status === 'Confirmed').length})</option>
                <option value="Completed">Completed ({appointments.filter(a => a.status === 'Completed').length})</option>
                <option value="Cancelled">Cancelled ({appointments.filter(a => a.status === 'Cancelled').length})</option>
                <option value="No-show">No-show ({appointments.filter(a => a.status === 'No-show').length})</option>
              </select>

              {/* Doctor Filter */}
              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-[#E8E6DF] rounded-xl focus:outline-none focus:border-[#0D6969] bg-white text-[#15222E]"
              >
                <option value="All">All Specialists</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Appointments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E8E6DF] bg-[#FAF9F5] text-[#15222E] font-bold">
                    <th className="py-3 px-3">Ref ID</th>
                    <th className="py-3 px-3">Patient</th>
                    <th className="py-3 px-3">Treatment Service</th>
                    <th className="py-3 px-3">Doctor</th>
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E6DF]">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#64748B]">
                        <p className="font-semibold text-sm text-[#15222E]">No appointments found</p>
                        <p className="text-xs text-[#64748B] mt-1">Try clearing your filters or check Supabase connection.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#0D6969]">
                          <button
                            type="button"
                            onClick={() => setViewApt(apt)}
                            className="hover:underline cursor-pointer"
                            title="Click to view details"
                          >
                            {apt.bookingRef}
                          </button>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-[#15222E]">{apt.patientName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-[#64748B]">
                            {apt.patientAge && <span>{apt.patientAge} yrs</span>}
                            <span>•</span>
                            <span>{apt.isNewPatient ? 'New Patient' : 'Returning'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-medium text-[#1E252B]">
                          {apt.serviceName}
                        </td>
                        <td className="py-3 px-3 text-[#64748B]">
                          {apt.doctorName}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="font-semibold text-[#15222E]">
                            {formatReadableDate(apt.appointmentDate)}
                          </div>
                          <div className="text-[11px] text-[#0D6969] font-bold tabular-nums">
                            {apt.startTime}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={apt.status}
                            onChange={(e) =>
                              updateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)
                            }
                            className={`px-2 py-1 rounded text-[11px] font-semibold border cursor-pointer ${
                              apt.status === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : apt.status === 'Completed'
                                ? 'bg-slate-100 text-slate-800 border-slate-200'
                                : apt.status === 'Pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="No-show">No-show</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${apt.patientPhone.replace(/[^0-9]/g, '')}`}
                              className="p-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#EEF8F7] text-[#0D6969] border border-[#E8E6DF] transition-colors"
                              title={`Call ${apt.patientPhone}`}
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${apt.patientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hello ${apt.patientName}, this is Smile Architect Dental Clinic regarding your appointment ${apt.bookingRef}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#25D366] border border-emerald-200 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            {/* View Full Details */}
                            <button
                              type="button"
                              onClick={() => setViewApt(apt)}
                              className="p-1.5 text-slate-600 hover:text-[#0D6969] hover:bg-[#EEF8F7] rounded-lg transition-colors cursor-pointer"
                              title="View Full Booking Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit Appointment */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(apt)}
                              className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Booking & Patient Details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Reschedule */}
                            <button
                              type="button"
                              onClick={() => {
                                setRescheduleApt(apt);
                                setNewRescheduleDate(apt.appointmentDate);
                                setNewRescheduleTime(apt.startTime);
                              }}
                              className="px-2 py-1 text-[11px] font-semibold text-[#15222E] bg-white border border-[#E8E6DF] hover:bg-[#FAF9F5] rounded-md transition-colors cursor-pointer"
                              title="Reschedule Date/Time"
                            >
                              Reschedule
                            </button>

                            {/* Cancel with Confirmation */}
                            {apt.status !== 'Cancelled' && (
                              <button
                                type="button"
                                onClick={() => setCancelConfirmApt(apt)}
                                className="px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                title="Cancel Appointment"
                              >
                                Cancel
                              </button>
                            )}

                            {/* Delete Permanently */}
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmApt(apt)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Appointment from Database"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CALENDAR VIEW ================= */}
        {currentTab === 'calendar' && (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF]">
              <div>
                <h2 className="text-xl font-bold text-[#15222E]">Appointment Calendar</h2>
                <p className="text-xs text-[#64748B]">Visual schedule overview for clinic specialists.</p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-[#FAF9F5] rounded-xl border border-[#E8E6DF]">
                {(['day', 'week', 'month'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCalendarViewMode(mode)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                      calendarViewMode === mode ? 'bg-[#15222E] text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mode} View
                  </button>
                ))}
              </div>
            </div>

            {/* Simple Clean Responsive Month / Week Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-xs">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center font-bold text-[#15222E] py-2 bg-[#FAF9F5] rounded-lg">
                  {day}
                </div>
              ))}

              {/* Render upcoming 14 days slot overview */}
              {[...Array(14)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() + (i - 2));
                const dStr = d.toISOString().split('T')[0];
                const aptsOnDay = appointments.filter((a) => a.appointmentDate === dStr && a.status !== 'Cancelled');
                const isToday = dStr === todayStr;

                return (
                  <div
                    key={dStr}
                    className={`p-3 min-h-[90px] rounded-xl border flex flex-col justify-between ${
                      isToday
                        ? 'border-[#0D6969] bg-[#EEF8F7]/50 ring-1 ring-[#0D6969]'
                        : 'border-[#E8E6DF] bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold tabular-nums ${isToday ? 'text-[#0D6969]' : 'text-[#15222E]'}`}>
                        {d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      {aptsOnDay.length > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#15222E] text-white text-[10px] font-bold flex items-center justify-center">
                          {aptsOnDay.length}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 space-y-1">
                      {aptsOnDay.slice(0, 2).map((a) => (
                        <div
                          key={a.id}
                          className="px-1.5 py-0.5 rounded bg-[#FAF9F5] border border-[#E8E6DF] text-[10px] truncate"
                          title={`${a.patientName} (${a.startTime})`}
                        >
                          <strong>{a.startTime}</strong> {a.patientName.split(' ')[0]}
                        </div>
                      ))}
                      {aptsOnDay.length > 2 && (
                        <span className="text-[10px] text-slate-500 font-semibold">
                          +{aptsOnDay.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 4: DOCTORS CMS ================= */}
        {currentTab === 'doctors' && (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF]">
              <div>
                <h2 className="text-xl font-bold text-[#15222E]">Doctor Management CMS</h2>
                <p className="text-xs text-[#64748B]">Add new practitioners, update qualifications, and configure availability.</p>
              </div>

              <button
                onClick={() => {
                  setEditingDoctor(null);
                  setDocName('');
                  setDocQual('');
                  setDocRole('');
                  setDocSpec('');
                  setDocBio('');
                  setDoctorModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Doctor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl border border-[#E8E6DF] bg-[#FAF9F5] space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-[#15222E]">{doc.name}</h4>
                      <p className="text-xs font-semibold text-[#6D4C41]">{doc.qualification}</p>
                      <p className="text-xs text-[#0D6969]">{doc.role}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleDoctorActive(doc.id)}
                        className={`px-2 py-1 text-[11px] font-semibold rounded ${
                          doc.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {doc.isActive ? 'Active' : 'On Leave'}
                      </button>

                      <button
                        onClick={() => {
                          setEditingDoctor(doc);
                          setDocName(doc.name);
                          setDocQual(doc.qualification);
                          setDocRole(doc.role);
                          setDocSpec(doc.specialization);
                          setDocBio(doc.shortBio);
                          setDoctorModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-[#E8E6DF] bg-white hover:bg-slate-50 text-slate-700"
                        title="Edit Doctor"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                    {doc.shortBio}
                  </p>

                  <div className="pt-2 border-t border-[#E8E6DF] text-[11px] text-[#15222E]">
                    <span>Days Available: <strong>{doc.daysAvailable.join(', ')}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: SERVICES CMS ================= */}
        {currentTab === 'services' && (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF]">
              <div>
                <h2 className="text-xl font-bold text-[#15222E]">Service Management CMS</h2>
                <p className="text-xs text-[#64748B]">Manage treatments, assign specialist doctors, configure durations and fees.</p>
              </div>

              <button
                onClick={() => {
                  setEditingService(null);
                  setSrvName('');
                  setSrvCategory('General Dentistry');
                  setSrvDesc('');
                  setSrvDuration('30');
                  setSrvPriceNote('Price available after consultation');
                  setSrvPrice('');
                  setServiceModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-4 rounded-xl border border-[#E8E6DF] bg-[#FAF9F5] flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D6969]">
                      {srv.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#15222E]">{srv.name}</h4>
                    <p className="text-xs text-[#64748B] line-clamp-2">{srv.description}</p>
                  </div>

                  <div className="pt-2 border-t border-[#E8E6DF] flex items-center justify-between text-xs">
                    <span className="text-[#6D4C41] font-semibold">
                      {srv.customPrice ? `₹${srv.customPrice}` : srv.priceNote}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingService(srv);
                          setSrvName(srv.name);
                          setSrvCategory(srv.category);
                          setSrvDesc(srv.description);
                          setSrvDuration(srv.durationMinutes.toString());
                          setSrvPriceNote(srv.priceNote);
                          setSrvPrice(srv.customPrice?.toString() || '');
                          setSrvDocId(srv.assignedDoctorId || doctors[0]?.id || '');
                          setServiceModalOpen(true);
                        }}
                        className="p-1 rounded bg-white border border-[#E8E6DF] text-slate-700 hover:bg-slate-100"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteService(srv.id)}
                        className="p-1 rounded bg-white border border-[#E8E6DF] text-rose-600 hover:bg-rose-50"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: SCHEDULE & CLINIC HOURS CMS ================= */}
        {currentTab === 'schedule' && (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] shadow-sm p-6 sm:p-8 space-y-8">
            <div className="pb-4 border-b border-[#E8E6DF]">
              <h2 className="text-xl font-bold text-[#15222E]">Clinic Schedule & Working Hours</h2>
              <p className="text-xs text-[#64748B]">Configure appointment slot intervals, shifts, and blocked holiday dates.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Working Hours Configuration */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#15222E]">Working Shifts</h3>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] space-y-2 text-xs">
                    <p className="font-bold text-[#15222E]">Morning Shift</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-500">Opens (24h)</label>
                        <input
                          type="time"
                          value={schedMorningStart}
                          onChange={(e) => setSchedMorningStart(e.target.value)}
                          className="w-full px-2 py-1.5 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500">Closes (24h)</label>
                        <input
                          type="time"
                          value={schedMorningEnd}
                          onChange={(e) => setSchedMorningEnd(e.target.value)}
                          className="w-full px-2 py-1.5 border rounded bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] space-y-2 text-xs">
                    <p className="font-bold text-[#15222E]">Evening Shift</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-500">Opens (24h)</label>
                        <input
                          type="time"
                          value={schedEveningStart}
                          onChange={(e) => setSchedEveningStart(e.target.value)}
                          className="w-full px-2 py-1.5 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500">Closes (24h)</label>
                        <input
                          type="time"
                          value={schedEveningEnd}
                          onChange={(e) => setSchedEveningEnd(e.target.value)}
                          className="w-full px-2 py-1.5 border rounded bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#15222E] mb-1">
                      Consultation Slot Duration (Minutes)
                    </label>
                    <select
                      value={schedSlotDuration}
                      onChange={(e) => setSchedSlotDuration(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl bg-white"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes (Default)</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      updateSchedule({
                        ...schedule,
                        morningShift: {
                          name: 'Morning Shift',
                          start: schedMorningStart,
                          end: schedMorningEnd,
                          label: `${schedMorningStart} - ${schedMorningEnd}`
                        },
                        eveningShift: {
                          name: 'Evening Shift',
                          start: schedEveningStart,
                          end: schedEveningEnd,
                          label: `${schedEveningStart} - ${schedEveningEnd}`
                        },
                        slotDurationMinutes: parseInt(schedSlotDuration, 10) || 30
                      });
                    }}
                    className="w-full py-2.5 text-xs font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-xl transition-colors"
                  >
                    Save Clinic Schedule
                  </button>
                </div>
              </div>

              {/* Blocked Dates / Holiday Management */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#15222E]">Blocked Dates & Holidays</h3>

                {/* Add Blocked Date Form */}
                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] space-y-3 text-xs">
                  <p className="font-semibold text-[#15222E]">Block a Date for Clinic Closure</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={newBlockedDate}
                      onChange={(e) => setNewBlockedDate(e.target.value)}
                      className="px-2 py-1.5 border rounded bg-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Reason (e.g. Festival Holiday)"
                      value={newBlockedReason}
                      onChange={(e) => setNewBlockedReason(e.target.value)}
                      className="px-2 py-1.5 border rounded bg-white text-xs"
                    />
                  </div>
                  <button
                    disabled={!newBlockedDate}
                    onClick={() => {
                      if (!newBlockedDate) return;
                      addBlockedDate(newBlockedDate, newBlockedReason || 'Clinic Closed');
                      setNewBlockedDate('');
                      setNewBlockedReason('');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#15222E] hover:bg-[#0D6969] rounded-lg transition-colors"
                  >
                    Add Blocked Date
                  </button>
                </div>

                {/* Blocked Dates List */}
                <div className="space-y-2">
                  {blockedDates.length === 0 ? (
                    <p className="text-xs text-[#64748B]">No dates currently blocked.</p>
                  ) : (
                    blockedDates.map((b) => (
                      <div
                        key={b.id}
                        className="p-2.5 rounded-lg border border-rose-200 bg-rose-50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <strong className="text-rose-900">{formatReadableDate(b.date)}</strong>
                          <span className="text-rose-700 ml-2">({b.reason})</span>
                        </div>
                        <button
                          onClick={() => removeBlockedDate(b.id)}
                          className="text-rose-600 hover:text-rose-800 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: GALLERY CMS ================= */}
        {currentTab === 'gallery' && (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DF]">
              <div>
                <h2 className="text-xl font-bold text-[#15222E]">Gallery CMS</h2>
                <p className="text-xs text-[#64748B]">Manage clinic photographs and visual tour showcases.</p>
              </div>

              <button
                onClick={() => {
                  setGalTitle('');
                  setGalCategory('Treatment Room');
                  setGalDesc('');
                  setGalleryModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Gallery Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[#E8E6DF] bg-[#FAF9F5] flex flex-col justify-between space-y-2 text-xs"
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#0D6969] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-[#15222E] mt-0.5">{item.title}</h4>
                    <p className="text-[#64748B] mt-1">{item.description}</p>
                  </div>

                  <div className="pt-2 border-t border-[#E8E6DF] flex justify-end">
                    <button
                      onClick={() => deleteGalleryItem(item.id)}
                      className="text-rose-600 hover:text-rose-800 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 8: REVIEWS CMS ================= */}
        {currentTab === 'reviews' && (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] shadow-sm p-6 space-y-6">
            <div className="pb-4 border-b border-[#E8E6DF]">
              <h2 className="text-xl font-bold text-[#15222E]">Patient Feedback & Reviews CMS</h2>
              <p className="text-xs text-[#64748B]">Approve, monitor, or manage testimonials.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-xl border border-[#E8E6DF] bg-[#FAF9F5] flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#15222E]">{rev.patientName}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          rev.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rev.isApproved ? 'Approved' : 'Pending Review'}
                      </span>
                    </div>
                    <p className="text-xs text-[#1E252B]/85 italic">"{rev.reviewText}"</p>
                    {rev.doctorMentioned && (
                      <p className="text-[11px] text-[#0D6969]">Doctor: {rev.doctorMentioned}</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#E8E6DF] flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                    <div className="flex items-center gap-2">
                      {!rev.isApproved && (
                        <button
                          onClick={() => approveReview(rev.id)}
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 9: CLINIC SETTINGS CMS ================= */}
        {currentTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] shadow-sm p-6 sm:p-8 space-y-6 max-w-3xl">
            <div className="pb-4 border-b border-[#E8E6DF]">
              <h2 className="text-xl font-bold text-[#15222E]">Clinic Settings & Contact Information</h2>
              <p className="text-xs text-[#64748B]">Update address, phone, WhatsApp number, and top announcement message.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                // updateSettings is handled live or upon click
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-[#15222E] mb-1">Clinic Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => updateSettings({ ...settings, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-[#FAF9F5]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#15222E] mb-1">Positioning Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => updateSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-[#FAF9F5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#15222E] mb-1">Primary Phone</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) =>
                      updateSettings({
                        ...settings,
                        phone: e.target.value,
                        phoneRaw: e.target.value.replace(/[^0-9]/g, '')
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF9F5]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#15222E] mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => updateSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF9F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#15222E] mb-1">Address Line 1</label>
                <input
                  type="text"
                  value={settings.addressLine1}
                  onChange={(e) => updateSettings({ ...settings, addressLine1: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-[#FAF9F5]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#15222E] mb-1">Address Line 2 / Landmark</label>
                <input
                  type="text"
                  value={settings.addressLine2}
                  onChange={(e) => updateSettings({ ...settings, addressLine2: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-[#FAF9F5]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#15222E] mb-1">Google Maps Direct URL</label>
                <input
                  type="text"
                  value={settings.googleMapsUrl}
                  onChange={(e) => updateSettings({ ...settings, googleMapsUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-[#FAF9F5]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#15222E] mb-1">Top Announcement Banner</label>
                <textarea
                  rows={2}
                  value={settings.announcementText || ''}
                  onChange={(e) => updateSettings({ ...settings, announcementText: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl bg-[#FAF9F5]"
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="showAnnouncement"
                    checked={settings.showAnnouncement}
                    onChange={(e) => updateSettings({ ...settings, showAnnouncement: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="showAnnouncement" className="text-slate-600">
                    Show announcement banner on top of website
                  </label>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 10: SUPABASE BACKEND ================= */}
        {currentTab === 'supabase' && (
          <div className="bg-white rounded-2xl border border-[#E8E6DF] shadow-sm p-6 sm:p-8 space-y-8 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E6DF]">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#15222E]">Supabase Backend Integration</h2>
                    <p className="text-xs text-[#64748B]">
                      Connected to PostgreSQL database on project <code className="font-mono text-[#0D6969] font-bold">{SUPABASE_PROJECT_ID}</code>
                    </p>
                  </div>
                </div>
              </div>

              <button
                disabled={isTestingSupabase}
                onClick={async () => {
                  setIsTestingSupabase(true);
                  await refreshSupabase();
                  setTimeout(() => setIsTestingSupabase(false), 800);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-xl transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
              >
                <span>{isTestingSupabase ? 'Testing Connection...' : 'Test Connection & Re-sync'}</span>
              </button>
            </div>

            {/* Connection Credentials & Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] space-y-1">
                <span className="text-[11px] text-[#64748B]">Project ID</span>
                <p className="text-sm font-bold font-mono text-[#15222E]">{SUPABASE_PROJECT_ID}</p>
                <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  Active Project
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] space-y-1">
                <span className="text-[11px] text-[#64748B]">API Endpoint</span>
                <p className="text-xs font-mono font-bold text-[#15222E] truncate" title={SUPABASE_URL}>
                  {SUPABASE_URL}
                </p>
                <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  Client Initialized
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] space-y-1">
                <span className="text-[11px] text-[#64748B]">Table Status</span>
                <p className="text-sm font-bold text-[#15222E]">
                  public.appointments
                </p>
                <span
                  className={`text-[10px] font-medium flex items-center gap-1 ${
                    supabaseStatus.tableExists ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      supabaseStatus.tableExists ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  {supabaseStatus.tableExists
                    ? `Ready (${supabaseStatus.count ?? appointments.length} rows detected)`
                    : 'Table ready for schema verification'}
                </span>
              </div>
            </div>

            {/* How it works banner */}
            <div className="p-4 rounded-xl bg-[#EEF8F7] border border-[#D1EAE7] text-xs text-[#0D6969] space-y-1.5">
              <p className="font-bold flex items-center gap-1.5 text-sm">
                <CheckCircle className="w-4 h-4 text-[#0D6969]" />
                <span>Automatic Real-Time Database Sync</span>
              </p>
              <p className="text-[#15222E]/85 leading-relaxed">
                Whenever a patient books an appointment on the website, their appointment details (patient name, phone, email,
                doctor, service, date, time slot, notes, and booking reference ID) are automatically inserted into your Supabase database table.
              </p>
            </div>

            {/* SQL Migration Script Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#15222E]">Database Table Schema (SQL)</h3>
                  <p className="text-xs text-[#64748B]">
                    If you haven't created the <code className="font-mono text-[#0D6969]">appointments</code> table yet in your Supabase project, run this SQL in your Supabase SQL Editor:
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2500);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#15222E] bg-[#FAF9F5] border border-[#E8E6DF] hover:bg-white rounded-lg transition-colors cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#0D6969]" />
                      <span>Copy SQL Schema</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-[#15222E] text-slate-200 text-[11px] font-mono overflow-x-auto max-h-72 border border-slate-700">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>

            {/* Quick Link to Supabase Dashboard */}
            <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-[#15222E]">Open Supabase Project Dashboard</p>
                <p className="text-[#64748B]">
                  View raw rows in Table Editor, configure Row Level Security (RLS), or query logs.
                </p>
              </div>
              <a
                href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/editor`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#15222E] bg-white border border-[#E8E6DF] hover:bg-slate-50 rounded-lg transition-colors shadow-sm shrink-0"
              >
                <span>Open Supabase Table Editor</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#0D6969]" />
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-[#E8E6DF] shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#15222E]">
              Reschedule Appointment ({rescheduleApt.bookingRef})
            </h3>
            <p className="text-xs text-[#64748B]">
              Patient: <strong>{rescheduleApt.patientName}</strong> · Doctor: {rescheduleApt.doctorName}
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#15222E] mb-1">New Date</label>
              <input
                type="date"
                min={todayStr}
                value={newRescheduleDate}
                onChange={(e) => setNewRescheduleDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#15222E] mb-1">New Time Slot</label>
              <select
                value={newRescheduleTime}
                onChange={(e) => setNewRescheduleTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="05:30 PM">05:30 PM</option>
                <option value="06:00 PM">06:00 PM</option>
                <option value="06:30 PM">06:30 PM</option>
                <option value="07:00 PM">07:00 PM</option>
                <option value="07:30 PM">07:30 PM</option>
                <option value="08:00 PM">08:00 PM</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRescheduleApt(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (rescheduleApt && newRescheduleDate && newRescheduleTime) {
                    await rescheduleAppointment(rescheduleApt.id, newRescheduleDate, newRescheduleTime);
                    setRescheduleApt(null);
                  }
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0D6969] rounded hover:bg-[#094F4F]"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Walk-in Manual Booking Modal */}
      {walkinModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E6DF] shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#15222E]">Add Walk-in or Phone Booking</h3>
            <form onSubmit={handleCreateWalkin} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    placeholder="9845012345"
                    className="w-full px-2.5 py-1.5 border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Doctor</label>
                  <select
                    value={walkinDoctorId}
                    onChange={(e) => setWalkinDoctorId(e.target.value)}
                    className="w-full px-2.5 py-1.5 border rounded bg-white"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Service</label>
                  <select
                    value={walkinServiceId}
                    onChange={(e) => setWalkinServiceId(e.target.value)}
                    className="w-full px-2.5 py-1.5 border rounded bg-white"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={walkinDate}
                    onChange={(e) => setWalkinDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Time Slot</label>
                  <select
                    value={walkinTime}
                    onChange={(e) => setWalkinTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 border rounded bg-white"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="06:30 PM">06:30 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes</label>
                <input
                  type="text"
                  value={walkinNotes}
                  onChange={(e) => setWalkinNotes(e.target.value)}
                  placeholder="Reason for visit or symptoms..."
                  className="w-full px-2.5 py-1.5 border rounded"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWalkinModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-[#0D6969] rounded hover:bg-[#094F4F]"
                >
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Edit / Create Modal */}
      {doctorModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E6DF] shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#15222E]">
              {editingDoctor ? 'Edit Doctor Details' : 'Add New Doctor'}
            </h3>
            <form onSubmit={handleSaveDoctor} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Dr. Name"
                  className="w-full px-2.5 py-1.5 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Qualification *</label>
                <input
                  type="text"
                  required
                  value={docQual}
                  onChange={(e) => setDocQual(e.target.value)}
                  placeholder="e.g. MDS - Orthodontics"
                  className="w-full px-2.5 py-1.5 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Role / Designation *</label>
                <input
                  type="text"
                  required
                  value={docRole}
                  onChange={(e) => setDocRole(e.target.value)}
                  placeholder="e.g. Consultant Orthodontist"
                  className="w-full px-2.5 py-1.5 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Specialization</label>
                <input
                  type="text"
                  value={docSpec}
                  onChange={(e) => setDocSpec(e.target.value)}
                  placeholder="e.g. Braces & Clear Aligners"
                  className="w-full px-2.5 py-1.5 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Biography</label>
                <textarea
                  rows={3}
                  value={docBio}
                  onChange={(e) => setDocBio(e.target.value)}
                  placeholder="Professional background and expertise..."
                  className="w-full px-2.5 py-1.5 border rounded"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDoctorModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-[#0D6969] rounded hover:bg-[#094F4F]"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Edit / Create Modal */}
      {serviceModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E6DF] shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#15222E]">
              {editingService ? 'Edit Treatment Service' : 'Add New Service'}
            </h3>
            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={srvName}
                  onChange={(e) => setSrvName(e.target.value)}
                  placeholder="e.g. Dental Check-up"
                  className="w-full px-2.5 py-1.5 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category *</label>
                <select
                  value={srvCategory}
                  onChange={(e) => setSrvCategory(e.target.value as ServiceCategory)}
                  className="w-full px-2.5 py-1.5 border rounded bg-white"
                >
                  <option value="General Dentistry">General Dentistry</option>
                  <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                  <option value="Oral & Maxillofacial">Oral & Maxillofacial</option>
                  <option value="Endodontics">Endodontics</option>
                  <option value="Implantology">Implantology</option>
                  <option value="Orthodontics">Orthodontics</option>
                  <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
                  <option value="Prosthodontics">Prosthodontics</option>
                  <option value="Periodontics">Periodontics</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={srvDesc}
                  onChange={(e) => setSrvDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Est. Duration (Mins)</label>
                  <input
                    type="number"
                    value={srvDuration}
                    onChange={(e) => setSrvDuration(e.target.value)}
                    className="w-full px-2.5 py-1.5 border rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Custom Price (₹, optional)</label>
                  <input
                    type="number"
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(e.target.value)}
                    placeholder="Leave empty if variable"
                    className="w-full px-2.5 py-1.5 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Price Note Display</label>
                <input
                  type="text"
                  value={srvPriceNote}
                  onChange={(e) => setSrvPriceNote(e.target.value)}
                  placeholder="Price available after consultation"
                  className="w-full px-2.5 py-1.5 border rounded"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-[#0D6969] rounded hover:bg-[#094F4F]"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Add Modal */}
      {galleryModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-[#E8E6DF] shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#15222E]">Add Photo to Gallery</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={galTitle}
                  onChange={(e) => setGalTitle(e.target.value)}
                  placeholder="e.g. Modern Dental Suite"
                  className="w-full px-2.5 py-1.5 border rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category</label>
                <select
                  value={galCategory}
                  onChange={(e) => setGalCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded bg-white"
                >
                  <option value="Clinic">Clinic</option>
                  <option value="Treatment Room">Treatment Room</option>
                  <option value="Dental Equipment">Dental Equipment</option>
                  <option value="Waiting Area">Waiting Area</option>
                  <option value="Team">Team</option>
                  <option value="Branding">Branding</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  value={galDesc}
                  onChange={(e) => setGalDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 border rounded"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (galTitle) {
                      addGalleryItem({
                        title: galTitle,
                        category: galCategory,
                        description: galDesc,
                        imageTag: 'operatory'
                      });
                      setGalleryModalOpen(false);
                    }
                  }}
                  className="px-4 py-1.5 font-semibold text-white bg-[#0D6969] rounded hover:bg-[#094F4F]"
                >
                  Add Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW APPOINTMENT MODAL ================= */}
      {viewApt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 border border-[#E8E6DF] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E8E6DF]">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-base font-bold text-[#0D6969] bg-[#EEF8F7] px-2.5 py-0.5 rounded-lg border border-[#D1EAE7]">
                    {viewApt.bookingRef}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      viewApt.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : viewApt.status === 'Completed'
                        ? 'bg-slate-100 text-slate-800'
                        : viewApt.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {viewApt.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#15222E]">{viewApt.patientName}</h3>
              </div>

              <button
                type="button"
                onClick={() => setViewApt(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] space-y-1">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Patient Contact</span>
                <p className="font-bold text-sm text-[#15222E]">{viewApt.patientPhone}</p>
                <p className="text-[#64748B]">{viewApt.patientEmail}</p>
                <div className="flex items-center gap-2 pt-2">
                  <a
                    href={`tel:${viewApt.patientPhone.replace(/[^0-9]/g, '')}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#E8E6DF] hover:bg-[#EEF8F7] text-[#0D6969] rounded-md font-medium text-[11px]"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${viewApt.patientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${viewApt.patientName}, this is Smile Architect Dental Clinic regarding your booking ${viewApt.bookingRef}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#25D366] border border-emerald-200 rounded-md font-medium text-[11px]"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] space-y-1">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Patient Details</span>
                <p className="font-medium text-[#15222E]">
                  Age: <span className="font-bold">{viewApt.patientAge ? `${viewApt.patientAge} years` : 'Not specified'}</span>
                </p>
                <p className="font-medium text-[#15222E]">
                  Status: <span className="font-bold">{viewApt.isNewPatient ? 'First-time Patient' : 'Returning Patient'}</span>
                </p>
                <p className="font-medium text-[#15222E]">
                  Preferred Channel: <span className="font-bold">{viewApt.preferredContact}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] space-y-1">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Appointment Schedule</span>
                <div className="flex items-center gap-2 font-bold text-sm text-[#15222E]">
                  <CalendarDays className="w-4 h-4 text-[#0D6969]" />
                  <span>{formatReadableDate(viewApt.appointmentDate)}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-[#0D6969]">
                  <Clock className="w-4 h-4" />
                  <span>{viewApt.startTime}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] space-y-1">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Treatment & Specialist</span>
                <p className="font-bold text-[#15222E]">{viewApt.serviceName}</p>
                <p className="text-[#64748B]">Assigned to: {viewApt.doctorName}</p>
              </div>
            </div>

            {/* Notes Section */}
            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] space-y-1 text-xs">
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Patient Notes / Chief Complaint</span>
              <p className="text-[#15222E] leading-relaxed whitespace-pre-wrap">
                {viewApt.notes ? viewApt.notes : 'No specific patient notes provided during online booking.'}
              </p>
            </div>

            {/* Database Sync Information */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-[#64748B] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#0D6969]" />
                <span>Supabase record synced on table: <code className="font-mono text-slate-700">appointments</code></span>
              </div>
              <span>Created: {new Date(viewApt.createdAt).toLocaleString()}</span>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#E8E6DF]">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-[#E8E6DF] rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Slip</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const apt = viewApt;
                    setViewApt(null);
                    handleOpenEdit(apt);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#15222E] hover:bg-[#0D6969] rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Appointment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewApt(null)}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT APPOINTMENT MODAL ================= */}
      {editApt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 border border-[#E8E6DF] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DF]">
              <div>
                <h3 className="text-lg font-bold text-[#15222E]">
                  Edit Appointment ({editApt.bookingRef})
                </h3>
                <p className="text-xs text-[#64748B]">Changes will update both this dashboard and your Supabase database.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditApt(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#15222E] mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF9F5] focus:outline-none focus:border-[#0D6969]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#15222E] mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF9F5] focus:outline-none focus:border-[#0D6969]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#15222E] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF9F5] focus:outline-none focus:border-[#0D6969]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-[#15222E] mb-1">Age</label>
                    <input
                      type="number"
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value)}
                      placeholder="e.g. 32"
                      className="w-full px-3 py-2 border rounded-xl bg-[#FAF9F5] focus:outline-none focus:border-[#0D6969]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#15222E] mb-1">Contact Via</label>
                    <select
                      value={editContact}
                      onChange={(e) => setEditContact(e.target.value as any)}
                      className="w-full px-2.5 py-2 border rounded-xl bg-white focus:outline-none focus:border-[#0D6969]"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Phone">Phone</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#15222E] mb-1">Treatment Service *</label>
                  <select
                    value={editServiceId}
                    onChange={(e) => setEditServiceId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white focus:outline-none focus:border-[#0D6969]"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#15222E] mb-1">Assigned Specialist *</label>
                  <select
                    value={editDoctorId}
                    onChange={(e) => setEditDoctorId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white focus:outline-none focus:border-[#0D6969]"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#15222E] mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-[#FAF9F5] focus:outline-none focus:border-[#0D6969]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#15222E] mb-1">Time Slot *</label>
                  <select
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white focus:outline-none focus:border-[#0D6969]"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="06:30 PM">06:30 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                    <option value="07:30 PM">07:30 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#15222E] mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as AppointmentStatus)}
                    className="w-full px-3 py-2 border rounded-xl bg-white focus:outline-none focus:border-[#0D6969]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="No-show">No-show</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#15222E] mb-1">Clinical Notes / Reason</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Patient complaint, symptoms, or internal notes..."
                  className="w-full px-3 py-2 border rounded-xl bg-[#FAF9F5] focus:outline-none focus:border-[#0D6969]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E8E6DF]">
                <button
                  type="button"
                  onClick={() => setEditApt(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Save Changes to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CANCEL CONFIRMATION MODAL ================= */}
      {cancelConfirmApt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-[#E8E6DF] shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#15222E]">
                Cancel Appointment {cancelConfirmApt.bookingRef}?
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                This will set status to "Cancelled" for <strong>{cancelConfirmApt.patientName}</strong> on {formatReadableDate(cancelConfirmApt.appointmentDate)}.
              </p>
            </div>

            <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8E6DF] text-xs">
              <p className="font-semibold text-[#15222E] mb-1">Notify Patient:</p>
              <a
                href={`https://wa.me/${cancelConfirmApt.patientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Dear ${cancelConfirmApt.patientName}, your appointment (${cancelConfirmApt.bookingRef}) at Smile Architect Dental Clinic on ${formatReadableDate(cancelConfirmApt.appointmentDate)} has been cancelled. Please contact us to reschedule.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#25D366] hover:underline font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send Cancellation WhatsApp</span>
              </a>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelConfirmApt(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Keep Active
              </button>
              <button
                type="button"
                onClick={async () => {
                  await updateAppointmentStatus(cancelConfirmApt.id, 'Cancelled');
                  setCancelConfirmApt(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteConfirmApt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-[#E8E6DF] shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#15222E]">
                Delete Appointment Record?
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Permanently delete appointment <strong>{deleteConfirmApt.bookingRef}</strong> ({deleteConfirmApt.patientName}) from both this website and your Supabase database table.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmApt(null)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteAppointment(deleteConfirmApt.id);
                  setDeleteConfirmApt(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                Delete from Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
