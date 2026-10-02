import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Logo } from '../brand/Logo';
import { Phone, Calendar, Menu, X, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  const { activePage, navigateTo, settings, isAdminLoggedIn } = useClinic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', page: 'home' as const },
    { label: 'About', page: 'about' as const },
    { label: 'Doctors', page: 'doctors' as const },
    { label: 'Services', page: 'services' as const },
    { label: 'Gallery', page: 'gallery' as const },
    { label: 'Contact', page: 'contact' as const }
  ];

  const handleNavClick = (page: (typeof navItems)[number]['page']) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar if enabled */}
      {settings.showAnnouncement && settings.announcementText && (
        <aside
          aria-label="Clinic announcement"
          className="bg-[#15222E] text-white/90 text-xs py-2 px-4 text-center border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span className="font-semibold text-[#80CBC4]">Hebbal, Mysuru:</span>
            <span>{settings.announcementText}</span>
          </div>
        </aside>
      )}

      {/* Main Header - Adhering to the Top Bar Contract (Zone 1 - Zone 2 - Zone 3) */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8E6DF] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          {/* Zone 1: Single text element / Brand Wordmark */}
          <div className="flex items-center">
            <Logo
              variant="full"
              onClick={() => navigateTo('home')}
              className="cursor-pointer"
            />
          </div>

          {/* Zone 2: 4-6 nav links, 1-2 word labels, single-line text links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#1E252B]"
          >
            {navItems.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#0D6969] font-semibold'
                      : 'text-[#1E252B]/80 hover:text-[#0D6969]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D6969] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            {/* Quick Call Button (Desktop) */}
            <a
              href={`tel:${settings.phoneRaw}`}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#15222E] bg-white border border-[#E8E6DF] rounded-lg hover:border-[#CBD5E1] hover:bg-[#F6EDE8]/40 transition-colors whitespace-nowrap"
              title={`Call ${settings.phone}`}
            >
              <Phone className="w-3.5 h-3.5 text-[#0D6969]" />
              <span className="tabular-nums">{settings.phone}</span>
            </a>

            {/* Primary Action CTA: Book Appointment */}
            <button
              onClick={() => navigateTo('booking')}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap cursor-pointer active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            {/* Admin Dashboard Link Button */}
            <button
              onClick={() => navigateTo('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                isAdminLoggedIn
                  ? 'bg-[#15222E] text-white border-[#15222E] shadow-sm'
                  : 'bg-white text-[#15222E] border-[#E8E6DF] hover:border-[#0D6969] hover:bg-[#FAF9F5]'
              }`}
              title="Clinic Staff Admin Panel"
              aria-label="Clinic Management Admin Panel"
            >
              <Shield className={`w-3.5 h-3.5 ${isAdminLoggedIn ? 'text-[#80CBC4]' : 'text-[#0D6969]'}`} />
              <span className="hidden sm:inline">Admin Panel</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1E252B] hover:bg-[#E8E6DF]/50 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF9F5] border-b border-[#E8E6DF] px-4 pt-3 pb-6 shadow-lg animate-in fade-in duration-200">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activePage === item.page
                      ? 'bg-[#EEF8F7] text-[#0D6969] font-semibold'
                      : 'text-[#1E252B] hover:bg-[#F4ECE7]'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-3 mt-2 border-t border-[#E8E6DF] flex flex-col gap-2">
                <a
                  href={`tel:${settings.phoneRaw}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#15222E] bg-white border border-[#E8E6DF] rounded-lg"
                >
                  <Phone className="w-4 h-4 text-[#0D6969]" />
                  <span>Call {settings.phone}</span>
                </a>
                <button
                  onClick={() => {
                    navigateTo('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#15222E] rounded-lg shadow-sm"
                >
                  <Shield className="w-4 h-4 text-[#80CBC4]" />
                  <span>Admin Panel (Manage Bookings)</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
