import React from 'react';

interface DrishtiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const DrishtiLogo: React.FC<DrishtiLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: {
      box: 'w-8 h-8',
      svgSize: 20,
      text: 'text-base',
      sub: 'text-[10px]',
      badge: 'text-[9px] px-1.5 py-0.2',
    },
    md: {
      box: 'w-10 h-10',
      svgSize: 24,
      text: 'text-lg sm:text-xl',
      sub: 'text-xs',
      badge: 'text-[10px] px-2 py-0.5',
    },
    lg: {
      box: 'w-12 h-12',
      svgSize: 28,
      text: 'text-2xl',
      sub: 'text-sm',
      badge: 'text-xs px-2.5 py-0.5',
    },
    xl: {
      box: 'w-16 h-16',
      svgSize: 36,
      text: 'text-3xl',
      sub: 'text-base',
      badge: 'text-xs px-3 py-1',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Custom Minimalist Drishti Optical Icon */}
      <div
        className={`${currentSize.box} rounded-2xl bg-[#1A1C20] flex items-center justify-center shadow-sm shrink-0 border border-[#2F333B] transition-transform duration-200 group-hover:scale-105`}
      >
        <svg
          width={currentSize.svgSize}
          height={currentSize.svgSize}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
          aria-hidden="true"
        >
          {/* Subtle outer focus ring arc */}
          <circle
            cx="16"
            cy="16"
            r="13"
            stroke="#FA8F79"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            strokeOpacity="0.4"
          />

          {/* Minimalist eye / lens aperture contours */}
          <path
            d="M 5 16 C 9 9.5, 23 9.5, 27 16 C 23 22.5, 9 22.5, 5 16 Z"
            stroke="#FAF6EE"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Precision inner optical focal iris */}
          <circle
            cx="16"
            cy="16"
            r="4.5"
            stroke="#FA8F79"
            strokeWidth="2"
            fill="#FA8F79"
            fillOpacity="0.25"
          />

          {/* Central pinpoint light beam */}
          <circle cx="16" cy="16" r="1.5" fill="#FAF6EE" />

          {/* Precision alignment ticks */}
          <line x1="16" y1="2" x2="16" y2="4.5" stroke="#FA8F79" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="27.5" x2="16" y2="30" stroke="#FA8F79" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="16" x2="4.5" y2="16" stroke="#FA8F79" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="27.5" y1="16" x2="30" y2="16" stroke="#FA8F79" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span
              className={`font-extrabold font-heading text-[#1A1C20] tracking-tight leading-none ${currentSize.text}`}
            >
              Drishti
            </span>
            <span
              className={`font-semibold uppercase tracking-wider bg-[#F2ECE1] text-[#7A7365] rounded-full border border-[#E3D8C6] ${currentSize.badge}`}
            >
              दृष्टि
            </span>
          </div>
          <span className={`text-[#787163] font-medium leading-tight mt-1 ${currentSize.sub}`}>
            Universal Vision
          </span>
        </div>
      )}
    </div>
  );
};
