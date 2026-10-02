import React from 'react';

interface ClinicVisualProps {
  type: 'hero' | 'operatory' | 'waiting' | 'clinic-interiors' | 'equipment' | 'team' | 'branding' | 'doctor-pediatric' | 'doctor-surgeon';
  className?: string;
  alt?: string;
}

export const ClinicVisual: React.FC<ClinicVisualProps> = ({ type, className = '', alt }) => {
  if (type === 'hero' || type === 'operatory') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#15222E] via-[#1E2E3D] to-[#0D6969]/40 p-1 flex items-center justify-center border border-[#15222E]/10 shadow-lg ${className}`}
        aria-label={alt || 'Smile Architect Modern Dental Operatory'}
      >
        <svg
          viewBox="0 0 800 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover rounded-xl"
        >
          {/* Room Background */}
          <rect width="800" height="500" fill="#FAF9F5" />

          {/* Warm Dark Wood Accent Feature Wall */}
          <rect x="0" y="0" width="800" height="340" fill="#F4EFEA" />
          <path d="M0 0H320V340H0V0Z" fill="#3D2B1F" />
          {/* Vertical wood slat texture */}
          {[...Array(14)].map((_, i) => (
            <line
              key={i}
              x1={20 + i * 22}
              y1="0"
              x2={20 + i * 22}
              y2="340"
              stroke="#2B1D15"
              strokeWidth="2.5"
              opacity="0.8"
            />
          ))}

          {/* Clean White Clinical Wall Right */}
          <rect x="320" y="0" width="480" height="340" fill="#FFFFFF" />

          {/* Glass Partition Wall */}
          <rect x="320" y="30" width="12" height="310" fill="#D1EAE7" opacity="0.6" />
          <rect x="332" y="30" width="220" height="310" fill="#E8F4F2" opacity="0.35" />
          <line x1="332" y1="30" x2="552" y2="30" stroke="#0D6969" strokeWidth="2" opacity="0.4" />
          <line x1="552" y1="30" x2="552" y2="340" stroke="#0D6969" strokeWidth="2" opacity="0.4" />

          {/* Daylight Window with Gentle Beams */}
          <rect x="600" y="40" width="160" height="240" rx="8" fill="#F0F8FA" stroke="#D1EAE7" strokeWidth="3" />
          <line x1="680" y1="40" x2="680" y2="280" stroke="#D1EAE7" strokeWidth="2" />
          <line x1="600" y1="160" x2="760" y2="160" stroke="#D1EAE7" strokeWidth="2" />
          {/* Natural Sun glow */}
          <circle cx="760" cy="50" r="120" fill="url(#sunGlow)" opacity="0.25" />

          {/* Clinical Floor - Polished Warm Ivory Epoxy */}
          <path d="M0 340H800V500H0V340Z" fill="#EFECE6" />
          <line x1="0" y1="340" x2="800" y2="340" stroke="#D8D4CA" strokeWidth="3" />
          {/* Soft reflection */}
          <ellipse cx="440" cy="430" rx="220" ry="35" fill="#E0DCD4" opacity="0.4" />

          {/* Modern Ergonomic Dental Chair (Muted Teal & Precision Steel) */}
          {/* Base */}
          <ellipse cx="440" cy="425" rx="90" ry="24" fill="#334155" />
          <rect x="420" y="320" width="40" height="90" rx="6" fill="#64748B" />
          {/* Seat Cushion (Muted Teal) */}
          <path
            d="M380 340C370 330 390 310 440 310C490 310 520 330 510 340C495 348 400 348 380 340Z"
            fill="#0D6969"
          />
          {/* Backrest angled comfortably */}
          <path
            d="M320 230C320 215 340 210 370 230L400 320C385 324 370 320 360 310L320 230Z"
            fill="#094F4F"
          />
          {/* Ergonomic Headrest */}
          <rect x="300" y="195" width="45" height="28" rx="10" fill="#0D6969" />

          {/* Overhead Modern Operating LED Lamp */}
          <path d="M520 340L550 180L450 140" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
          <rect x="420" y="125" width="70" height="26" rx="10" fill="#1E293B" />
          <polygon points="410,155 500,155 530,280 380,280" fill="url(#lampLight)" opacity="0.4" />

          {/* Digital Intraoral Screen on Swivel Arm */}
          <path d="M540 260H610V180" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />
          <rect x="580" y="130" width="110" height="75" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="3" />
          <rect x="586" y="136" width="98" height="63" rx="3" fill="#1E293B" />
          {/* Dental chart representation on monitor */}
          <path d="M600 165Q635 150 670 165" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
          <circle cx="620" cy="160" r="3" fill="#4ADE80" />
          <circle cx="640" cy="158" r="3" fill="#38BDF8" />
          <circle cx="660" cy="162" r="3" fill="#4ADE80" />

          {/* Sleek Dark Wood Side Cabinet with Stainless Steel Top */}
          <rect x="60" y="270" width="180" height="150" rx="4" fill="#503728" />
          <rect x="56" y="262" width="188" height="10" rx="2" fill="#E2E8F0" />
          <line x1="75" y1="315" x2="225" y2="315" stroke="#38251A" strokeWidth="2" />
          <line x1="75" y1="365" x2="225" y2="365" stroke="#38251A" strokeWidth="2" />
          <rect x="135" y="285" width="30" height="4" rx="2" fill="#CBD5E1" />
          <rect x="135" y="335" width="30" height="4" rx="2" fill="#CBD5E1" />

          {/* Green Calming Indoor Plant */}
          <ellipse cx="100" cy="258" rx="16" ry="6" fill="#94A3B8" />
          <path d="M92 258L95 240H105L108 258H92Z" fill="#CBD5E1" />
          <path d="M100 240Q90 210 75 205Q85 225 98 238" fill="#15803D" />
          <path d="M100 240Q110 205 125 200Q115 225 102 238" fill="#16A34A" />

          <defs>
            <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="lampLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (type === 'waiting') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-[#F6EDE8] border border-[#E8E6DF] ${className}`}>
        <svg viewBox="0 0 600 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <rect width="600" height="450" fill="#FAF9F5" />
          {/* Dark Wood Wall Behind Reception */}
          <rect x="40" y="30" width="520" height="260" rx="8" fill="#3E2723" />
          {[...Array(24)].map((_, i) => (
            <line key={i} x1={55 + i * 21} y1="30" x2={55 + i * 21} y2="290" stroke="#2D1B18" strokeWidth="2" />
          ))}
          {/* Subtle Backlit Warm Glow */}
          <rect x="180" y="90" width="240" height="80" rx="10" fill="#FAF9F5" opacity="0.95" />
          <text x="300" y="132" textAnchor="middle" fill="#15222E" fontFamily="'Caveat', cursive" fontSize="28" fontWeight="bold">
            Smile Architect
          </text>
          <text x="300" y="152" textAnchor="middle" fill="#6D4C41" fontSize="9" letterSpacing="2" fontWeight="600">
            COMPREHENSIVE DENTAL HEALTH CENTRE
          </text>

          {/* Comfortable Waiting Lounge Chairs */}
          <rect x="0" y="290" width="600" height="160" fill="#EFECE6" />
          {/* Chair 1 */}
          <rect x="100" y="280" width="110" height="90" rx="16" fill="#0D6969" />
          <rect x="110" y="300" width="90" height="70" rx="10" fill="#094F4F" />
          {/* Chair 2 */}
          <rect x="245" y="280" width="110" height="90" rx="16" fill="#5D4037" />
          <rect x="255" y="300" width="90" height="70" rx="10" fill="#4E342E" />
          {/* Chair 3 */}
          <rect x="390" y="280" width="110" height="90" rx="16" fill="#0D6969" />
          <rect x="400" y="300" width="90" height="70" rx="10" fill="#094F4F" />

          {/* Wood Center Coffee Table with Clean Magazines */}
          <ellipse cx="300" cy="400" rx="160" ry="25" fill="#3E2723" />
          <ellipse cx="300" cy="396" rx="155" ry="22" fill="#5D4037" />
        </svg>
      </div>
    );
  }

  if (type === 'equipment') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-[#E8F4F2] border border-[#D1EAE7] ${className}`}>
        <svg viewBox="0 0 600 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
          <rect width="600" height="450" fill="#F4F9F8" />
          {/* High-tech intraoral scanner wand & digital display */}
          <rect x="100" y="60" width="400" height="260" rx="14" fill="#15222E" stroke="#334155" strokeWidth="4" />
          <rect x="120" y="80" width="360" height="220" rx="8" fill="#0A1118" />
          {/* 3D Dental Arch render on screen */}
          <path
            d="M180 240C180 140 240 120 300 120C360 120 420 140 420 240"
            stroke="#2DD4BF"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Individual Teeth highlights */}
          {[...Array(12)].map((_, i) => (
            <circle key={i} cx={195 + i * 19} cy={140 + Math.sin((i / 11) * Math.PI) * -20 + 35} r="7" fill="#FFFFFF" />
          ))}
          {/* Medical Wand Holder */}
          <rect x="250" y="340" width="100" height="80" rx="8" fill="#475569" />
          <path d="M300 340V300" stroke="#94A3B8" strokeWidth="12" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Doctor Portraits
  if (type === 'doctor-pediatric') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#E0F2F1] via-[#FAF9F5] to-[#F4ECE7] flex items-center justify-center border border-[#D1EAE7] ${className}`}>
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Background warm aesthetic circle */}
          <circle cx="200" cy="200" r="160" fill="#E6F4F1" />
          {/* Stethoscope around neck */}
          <path d="M140 240C140 310 260 310 260 240" stroke="#0D6969" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="200" cy="305" r="10" fill="#15222E" />
          {/* White Clinical Coat */}
          <path d="M90 380C100 280 140 250 200 250C260 250 300 280 310 380H90Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
          <path d="M165 250L175 380" stroke="#E2E8F0" strokeWidth="2" />
          <path d="M235 250L225 380" stroke="#E2E8F0" strokeWidth="2" />
          {/* Teal Scrub Inner */}
          <polygon points="175,250 225,250 200,300" fill="#0D6969" />
          {/* Neck */}
          <rect x="180" y="190" width="40" height="70" rx="8" fill="#F3D1B5" />
          {/* Head & Hair */}
          <path d="M130 140C130 85 160 65 200 65C240 65 270 85 270 140C270 200 260 220 200 220C140 220 130 200 130 140Z" fill="#261C14" />
          <ellipse cx="200" cy="150" rx="55" ry="65" fill="#FADBC0" />
          {/* Hair Front Parting & Style */}
          <path d="M145 140C155 105 180 90 200 90C225 90 250 110 255 140C240 110 215 105 200 105C185 105 160 115 145 140Z" fill="#1C140E" />
          {/* Gentle Smile */}
          <path d="M185 180C190 190 210 190 215 180" stroke="#7A3E26" strokeWidth="3.5" strokeLinecap="round" />
          {/* Eyes & Eyebrows */}
          <ellipse cx="178" cy="145" rx="5" ry="6" fill="#1C140E" />
          <ellipse cx="222" cy="145" rx="5" ry="6" fill="#1C140E" />
          <path d="M170 135C175 130 185 130 190 134" stroke="#1C140E" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M210 134C215 130 225 130 230 135" stroke="#1C140E" strokeWidth="2.5" strokeLinecap="round" />
          {/* Pediatric Care Badge */}
          <rect x="235" y="310" width="42" height="18" rx="4" fill="#0D6969" />
          <text x="256" y="322" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">MDS PED</text>
        </svg>
      </div>
    );
  }

  if (type === 'doctor-surgeon') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#F4ECE7] via-[#FAF9F5] to-[#E0F2F1] flex items-center justify-center border border-[#E8E6DF] ${className}`}>
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Background warm aesthetic circle */}
          <circle cx="200" cy="200" r="160" fill="#EAE2DC" />
          {/* Surgical scrub coat (Navy) */}
          <path d="M90 380C100 275 140 245 200 245C260 245 300 275 310 380H90Z" fill="#15222E" />
          {/* Scrub V-Neck */}
          <polygon points="170,245 230,245 200,310" fill="#0D6969" />
          {/* Neck */}
          <rect x="180" y="185" width="40" height="70" rx="8" fill="#ECC3A4" />
          {/* Head & Hair */}
          <path d="M135 140C135 80 165 60 200 60C235 60 265 80 265 140C265 200 255 220 200 220C145 220 135 200 135 140Z" fill="#1A1512" />
          <ellipse cx="200" cy="150" rx="54" ry="64" fill="#F4CDAF" />
          {/* Hair Silhouette - elegant medical tie back */}
          <path d="M142 135C155 100 180 88 200 88C225 88 250 105 258 135C242 108 220 102 200 102C180 102 158 110 142 135Z" fill="#15110E" />
          {/* Confident Smile */}
          <path d="M185 182C192 190 208 190 215 182" stroke="#6E331E" strokeWidth="3.5" strokeLinecap="round" />
          {/* Eyes & Confident Brows */}
          <ellipse cx="178" cy="146" rx="5" ry="6" fill="#1A1512" />
          <ellipse cx="222" cy="146" rx="5" ry="6" fill="#1A1512" />
          <path d="M168 136C174 130 186 130 192 135" stroke="#1A1512" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M208 135C214 130 226 130 232 136" stroke="#1A1512" strokeWidth="2.5" strokeLinecap="round" />
          {/* Maxillofacial Surgical Badge */}
          <rect x="120" y="310" width="46" height="18" rx="4" fill="#6D4C41" />
          <text x="143" y="322" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">MDS SURG</text>
        </svg>
      </div>
    );
  }

  // Fallback / Clinic Generic
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#F6EDE8] border border-[#E8E6DF] flex items-center justify-center p-6 ${className}`}>
      <div className="text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#E0F2F1] text-[#0D6969] flex items-center justify-center mb-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <p className="text-xs font-semibold text-[#15222E]">Smile Architect Dental Clinic</p>
        <p className="text-[10px] text-[#6D4C41]">Mysuru, Karnataka</p>
      </div>
    </div>
  );
};
