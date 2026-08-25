import React from 'react';

export type GraphicTheme = 'coral' | 'stone' | 'lavender' | 'sage' | 'sky' | 'amber';

interface AbstractCardGraphicProps {
  theme: GraphicTheme;
  className?: string;
}

export const AbstractCardGraphic: React.FC<AbstractCardGraphicProps> = ({
  theme,
  className = 'absolute -right-4 -bottom-4 w-44 h-44 opacity-85 pointer-events-none transition-transform duration-500 group-hover:scale-105',
}) => {
  switch (theme) {
    case 'coral':
      return (
        <svg
          className={className}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g filter="url(#coralBlur)">
            <rect
              x="52"
              y="18"
              width="44"
              height="72"
              rx="22"
              transform="rotate(34 52 18)"
              fill="url(#coralGrad1)"
            />
            <rect
              x="88"
              y="60"
              width="44"
              height="72"
              rx="22"
              transform="rotate(34 88 60)"
              fill="url(#coralGrad2)"
            />
          </g>
          <defs>
            <linearGradient id="coralGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FA8F79" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.25" />
            </linearGradient>
            <linearGradient id="coralGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FDBA74" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'stone':
      return (
        <svg
          className={className}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="108" cy="48" r="38" fill="url(#stoneGrad1)" />
          <path d="M 62 132 A 40 40 0 0 0 142 132 Z" fill="url(#stoneGrad2)" />
          <circle cx="132" cy="116" r="28" fill="url(#stoneGrad3)" />
          <defs>
            <linearGradient id="stoneGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A8A29E" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#E7E5E4" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="stoneGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#78716C" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#D6D3D1" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="stoneGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#57534E" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#E7E5E4" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'lavender':
      return (
        <svg
          className={className}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="135" cy="135" r="90" fill="url(#lavenderGrad1)" />
          <circle cx="135" cy="135" r="60" fill="url(#lavenderGrad2)" />
          <circle cx="135" cy="135" r="34" fill="url(#lavenderGrad3)" />
          <circle cx="135" cy="135" r="14" fill="#7C3AED" fillOpacity="0.7" />
          <defs>
            <radialGradient id="lavenderGrad1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0.05" />
            </radialGradient>
            <radialGradient id="lavenderGrad2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0.1" />
            </radialGradient>
            <radialGradient id="lavenderGrad3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.15" />
            </radialGradient>
          </defs>
        </svg>
      );

    case 'sage':
      return (
        <svg
          className={className}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect x="74" y="20" width="56" height="56" rx="18" fill="url(#sageGrad1)" />
          <rect x="74" y="86" width="56" height="56" rx="18" fill="url(#sageGrad2)" />
          <rect x="120" y="53" width="56" height="56" rx="18" fill="url(#sageGrad3)" />
          <defs>
            <linearGradient id="sageGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#047857" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#34D399" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="sageGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#065F46" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="sageGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'sky':
      return (
        <svg
          className={className}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M 50 30 Q 110 50 140 20 Q 150 70 120 110 Q 70 140 40 95 Z"
            fill="url(#skyGrad1)"
          />
          <circle cx="118" cy="112" r="32" fill="url(#skyGrad2)" />
          <defs>
            <linearGradient id="skyGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="skyGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0369A1" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'amber':
    default:
      return (
        <svg
          className={className}
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M 80 140 L 140 80 A 45 45 0 0 0 60 40 Z"
            fill="url(#amberGrad1)"
          />
          <circle cx="72" cy="72" r="26" fill="url(#amberGrad2)" />
          <defs>
            <linearGradient id="amberGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="amberGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B45309" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
};
