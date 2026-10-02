import React from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileActionBar } from './components/layout/MobileActionBar';
import { Hero } from './components/home/Hero';
import { TrustSection } from './components/home/TrustSection';
import { AboutSection } from './components/about/AboutSection';
import { DoctorList } from './components/doctors/DoctorList';
import { ServiceExplorer } from './components/services/ServiceExplorer';
import { BookingFlow } from './components/booking/BookingFlow';
import { GalleryGrid } from './components/gallery/GalleryGrid';
import { ReviewsSection } from './components/reviews/ReviewsSection';
import { ContactSection } from './components/contact/ContactSection';
import { PrivacyPolicy, TermsConditions } from './components/legal/LegalPages';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activePage, toast } = useClinic();

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <>
            <Hero />
            <TrustSection />
            <AboutSection />
            <DoctorList />
            <ServiceExplorer />
            <GalleryGrid />
            <ReviewsSection />
            <ContactSection />
          </>
        );

      case 'about':
        return (
          <>
            <AboutSection />
            <TrustSection />
            <DoctorList />
            <ContactSection />
          </>
        );

      case 'doctors':
        return (
          <>
            <DoctorList />
            <TrustSection />
            <ContactSection />
          </>
        );

      case 'services':
      case 'service-detail':
        return (
          <>
            <ServiceExplorer />
            <ContactSection />
          </>
        );

      case 'booking':
        return <BookingFlow />;

      case 'gallery':
        return (
          <>
            <GalleryGrid />
            <ContactSection />
          </>
        );

      case 'reviews':
        return (
          <>
            <ReviewsSection />
            <ContactSection />
          </>
        );

      case 'contact':
        return <ContactSection />;

      case 'privacy':
        return <PrivacyPolicy />;

      case 'terms':
        return <TermsConditions />;

      case 'admin':
        return <AdminDashboard />;

      default:
        return <Hero />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1E252B] selection:bg-[#E0F2F1] selection:text-[#004D40]">
      {/* Top Bar Header (omitted on full admin tab for dedicated admin controls or rendered cleanly) */}
      {activePage !== 'admin' && <Header />}

      {/* Main Content */}
      <main className="flex-1">{renderContent()}</main>

      {/* Footer (omitted on admin tab for focused staff work) */}
      {activePage !== 'admin' && <Footer />}

      {/* Bottom Sticky Mobile Action Bar (omitted on admin page or booking confirmation) */}
      {activePage !== 'admin' && <MobileActionBar />}

      {/* Floating System Toast Notifications */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full bg-[#15222E] text-white p-3.5 rounded-xl shadow-2xl border border-white/10 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#80CBC4] shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}

          <p className="text-xs font-medium text-white/90 leading-snug flex-1">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ClinicProvider>
      <AppContent />
    </ClinicProvider>
  );
}
