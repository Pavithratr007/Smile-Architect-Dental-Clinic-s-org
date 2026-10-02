import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { ClinicVisual } from '../common/ClinicVisuals';
import { Calendar, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { navigateTo } = useClinic();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF9F5] via-[#FAF9F5] to-[#F5EFE9]/40 pt-10 pb-16 md:py-20 lg:py-24">
      {/* Subtle organic background warmth accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E0F2F1]/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#F6EDE8]/70 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Small eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF8F7] border border-[#D1EAE7] text-[#0D6969] text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#0D6969]" />
              <span>Comprehensive Dental Health Centre</span>
            </div>

            {/* Large headline with text-wrap: balance */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#15222E] leading-[1.15]" style={{ textWrap: 'balance' }}>
              Confident Smiles Begin With Exceptional Care.
            </h1>

            {/* Supporting copy */}
            <p className="text-base sm:text-lg text-[#1E252B]/80 max-w-2xl leading-relaxed">
              Personalized dental care for children and adults, delivered with experienced specialists,
              modern equipment and a patient-first approach in Hebbal, Mysuru.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateTo('booking')}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-lg shadow-sm hover:shadow transition-all cursor-pointer active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book an Appointment</span>
              </button>

              <button
                onClick={() => navigateTo('services')}
                className="flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#15222E] bg-white border border-[#E8E6DF] hover:bg-[#F6EDE8]/40 hover:border-[#CBD5E1] rounded-lg transition-colors cursor-pointer"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4 text-[#6D4C41]" />
              </button>
            </div>

            {/* Factual Highlights Bar */}
            <div className="pt-6 border-t border-[#E8E6DF]/80 grid grid-cols-3 gap-4">
              <div>
                <p className="text-lg font-bold text-[#15222E] tabular-nums">2 Specialists</p>
                <p className="text-xs text-[#64748B]">MDS Pediatric & Surgeon</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#15222E] tabular-nums">9 Disciplines</p>
                <p className="text-xs text-[#64748B]">Comprehensive Care</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#15222E] tabular-nums">Mysuru</p>
                <p className="text-xs text-[#64748B]">Hebbal 2nd Stage</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Operatory & Floating Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Visual operatory illustration with warm dark wood and clean white walls */}
              <ClinicVisual
                type="operatory"
                className="w-full aspect-[4/3] rounded-2xl shadow-xl border border-[#E8E6DF]"
                alt="Smile Architect modern dental treatment suite with wood finishes"
              />

              {/* Floating Appointment Card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 right-4 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-[#E8E6DF] shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-[#EEF8F7] text-[#0D6969] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#15222E]">
                      Your smile deserves a plan.
                    </p>
                    <p className="text-[11px] text-[#64748B] leading-snug">
                      Book your dental consultation today with our experienced specialists.
                    </p>
                    <button
                      onClick={() => navigateTo('booking')}
                      className="text-xs font-semibold text-[#0D6969] hover:text-[#094F4F] inline-flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <span>Select date & time</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
