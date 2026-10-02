import React from 'react';
import { useClinic } from '../../context/ClinicContext';
import { ClinicVisual } from '../common/ClinicVisuals';
import { ShieldCheck, HeartHandshake, Microscope, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { navigateTo } = useClinic();

  const reasons = [
    {
      title: 'Personalized Care',
      description:
        'Every consultation starts with attentive listening. Treatment plans are tailored to individual clinical requirements, patient comfort, and long-term oral health.',
      icon: HeartHandshake
    },
    {
      title: 'Experienced Specialists',
      description:
        'Direct consultations with qualified MDS practitioners specializing in Pediatric & Preventive Dentistry and Oral & Maxillofacial Surgery and Implantology.',
      icon: ShieldCheck
    },
    {
      title: 'Comprehensive Dentistry',
      description:
        'Full spectrum dental solutions—from preventive cleanings and toothache relief to advanced wisdom teeth impactions, braces, and fixed crowns.',
      icon: Sparkles
    },
    {
      title: 'Comfortable Clinical Environment',
      description:
        'Designed to ease clinical anxiety with warm wood aesthetics, soft ambient lighting, glass-partitioned hygienic operatories, and gentle chairside demeanor.',
      icon: Microscope
    }
  ];

  const highlights = [
    'Specialist-led Pediatric & Preventive Dentistry for young children and teenagers',
    'Expert Oral & Maxillofacial surgical procedures including wisdom teeth removal',
    'Modern diagnostic intraoral equipment and precision endodontic tools',
    'Conservative, tooth-preserving restorative treatments and composite bonding',
    'Strict infection control protocols and sterile clinical armamentarium',
    'Convenient morning and evening clinic consultation hours in Hebbal'
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF9F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0D6969]">
              About Smile Architect
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#15222E] leading-tight" style={{ textWrap: 'balance' }}>
              Your Dental Care, Designed Around You.
            </h2>
            <p className="text-base text-[#1E252B]/85 leading-relaxed">
              Smile Architect Dental Clinic is a comprehensive dental health centre established in Hebbal, Mysuru.
              Our practice is dedicated to delivering personalized, ethical, and high-standard dental treatment in an
              environment that feels calm, dignified, and comfortable rather than intimidating.
            </p>
            <p className="text-sm text-[#64748B] leading-relaxed">
              Whether you are bringing your toddler for their first dental milestone, seeking relief from persistent toothache,
              planning wisdom tooth removal with our maxillofacial surgeon, or restoring missing teeth with dental implants, our
              experienced professionals combine modern clinical equipment with genuine patient-focused care.
            </p>

            {/* Checklist */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#1E252B]/90 font-medium">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0D6969] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => navigateTo('booking')}
                className="px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#0D6969] hover:bg-[#094F4F] rounded-lg transition-colors cursor-pointer"
              >
                Schedule a Visit
              </button>
              <button
                onClick={() => navigateTo('doctors')}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#15222E] hover:text-[#0D6969] transition-colors cursor-pointer"
              >
                <span>Meet our specialists</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <ClinicVisual
                type="waiting"
                className="w-full aspect-[4/3] rounded-2xl shadow-md border border-[#E8E6DF]"
                alt="Smile Architect warm waiting lounge in Mysuru"
              />
              <div className="mt-4 p-4 rounded-xl bg-white border border-[#E8E6DF] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#15222E]">Sankranthi Circle, Hebbal 2nd Stage</p>
                  <p className="text-[11px] text-[#64748B]">850/S, 25th Cross Road, Mysuru</p>
                </div>
                <button
                  onClick={() => navigateTo('contact')}
                  className="text-xs font-semibold text-[#0D6969] hover:underline cursor-pointer"
                >
                  View on Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Why Patients Choose Us Section */}
        <div className="pt-10 border-t border-[#E8E6DF]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6D4C41]">
              Our Clinical Philosophy
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#15222E] mt-1.5">
              Why Patients Choose Us
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2">
              We focus on conservative dentistry, gentle patient communication, and proven clinical excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl border border-[#E8E6DF] hover:border-[#CBD5E1] shadow-sm hover:shadow transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#F6EDE8] text-[#6D4C41] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-semibold text-[#15222E] mb-2">
                    {r.title}
                  </h4>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {r.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
