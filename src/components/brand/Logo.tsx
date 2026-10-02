import React from 'react';

interface LogoProps {
  variant?: 'full' | 'compact' | 'light';
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '', onClick }) => {
  const isLight = variant === 'light';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 cursor-pointer select-none group transition-opacity hover:opacity-95 ${className}`}
      role="banner"
    >
      {/* Integrated Tooth & Architectural Curve Symbol */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 md:w-9 md:h-9"
        >
          {/* Aesthetic background soft pebble */}
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="12"
            fill={isLight ? 'rgba(255, 255, 255, 0.1)' : '#EEF8F7'}
            stroke={isLight ? 'rgba(255, 255, 255, 0.2)' : '#D1EAE7'}
            strokeWidth="1.5"
          />
          {/* Tooth contour with architectural clean arcs */}
          <path
            d="M17 14C14 14 12 17 12 21C12 26 15 31 18 36C19 37.5 21 37.5 21.5 35.5C22.2 32.5 23 29.5 24 29.5C25 29.5 25.8 32.5 26.5 35.5C27 37.5 29 37.5 30 36C33 31 36 26 36 21C36 17 34 14 31 14C27.5 14 26 17 24 17C22 17 20.5 14 17 14Z"
            stroke={isLight ? '#FFFFFF' : '#0D6969'}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Warm Architect Smile Arc */}
          <path
            d="M19 22C20.5 24 23.5 25 24.5 25C25.5 25 27.5 24 29 22"
            stroke={isLight ? '#E0F2F1' : '#6D4C41'}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Subtle sparkle apex */}
          <circle cx="28.5" cy="17.5" r="1.2" fill={isLight ? '#FFFFFF' : '#0D6969'} />
        </svg>
      </div>

      {/* Typography: Handwritten / Script Style Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span
            className={`font-script text-2xl md:text-[27px] font-bold tracking-wide ${
              isLight ? 'text-white' : 'text-[#15222E]'
            }`}
            style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
          >
            Smile Architect
          </span>
        </div>

        {variant === 'full' && (
          <span
            className={`text-[9.5px] uppercase tracking-[0.14em] font-medium mt-0.5 ${
              isLight ? 'text-white/70' : 'text-[#6D4C41]'
            }`}
          >
            ...Comprehensive Dental Health Centre
          </span>
        )}
      </div>
    </div>
  );
};
