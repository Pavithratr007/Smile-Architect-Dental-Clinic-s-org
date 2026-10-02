import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Shield, KeyRound, AlertCircle, X, Check } from 'lucide-react';

interface AdminLoginModalProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess, onClose }) => {
  const { adminLogin } = useClinic();
  const [credential, setCredential] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    const success = adminLogin(credential);
    if (success) {
      if (onSuccess) onSuccess();
    } else {
      setError(true);
    }
  };

  const handleQuickDemo = (pass: string) => {
    setCredential(pass);
    const success = adminLogin(pass);
    if (success && onSuccess) onSuccess();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 sm:p-8 border border-[#E8E6DF] shadow-2xl relative space-y-6">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#15222E] text-white flex items-center justify-center shadow">
            <Shield className="w-6 h-6 text-[#80CBC4]" />
          </div>
          <h2 className="text-xl font-bold text-[#15222E]">Clinic Staff Login</h2>
          <p className="text-xs text-[#64748B]">
            Smile Architect Dental Clinic Administration & Booking Management
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Incorrect password. Please try again.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#15222E] mb-1">
              Admin Password or PIN
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={credential}
                onChange={(e) => {
                  setCredential(e.target.value);
                  setError(false);
                }}
                placeholder="Enter password (e.g. smile2026)"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF9F5] border border-[#E8E6DF] rounded-xl text-xs sm:text-sm text-[#15222E] focus:outline-none focus:border-[#0D6969]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs sm:text-sm font-semibold text-white bg-[#15222E] hover:bg-[#0D6969] rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Access Dashboard
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('smile2026')}
            className="w-full py-2 px-4 text-xs font-semibold text-[#0D6969] bg-[#EEF8F7] hover:bg-[#D1EAE7] border border-[#D1EAE7] rounded-xl transition-colors cursor-pointer"
          >
            Instant 1-Click Admin Access (Demo / Owner)
          </button>
        </form>

        {/* Quick Demo Assist */}
        <div className="pt-4 border-t border-[#E8E6DF] space-y-2 text-center">
          <p className="text-[11px] text-[#64748B]">Quick Demo Access Credentials:</p>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('smile2026')}
              className="px-2.5 py-1 text-[11px] font-mono bg-[#FAF9F5] hover:bg-[#EEF8F7] text-[#0D6969] border border-[#E8E6DF] rounded-md transition-colors cursor-pointer"
            >
              smile2026
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('9036')}
              className="px-2.5 py-1 text-[11px] font-mono bg-[#FAF9F5] hover:bg-[#EEF8F7] text-[#0D6969] border border-[#E8E6DF] rounded-md transition-colors cursor-pointer"
            >
              PIN: 9036
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
