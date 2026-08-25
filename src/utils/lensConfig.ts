import { LensInfo } from '../types';

export const LENSES: LensInfo[] = [
  {
    id: 'all',
    name: 'Analyze All',
    shortLabel: 'All Lenses',
    iconName: 'Sparkles',
    description: 'Comprehensive evaluation across physical, sensory, and cognitive dimensions.',
    accentColor: '#F97316',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-orange-900',
  },
  {
    id: 'mobility',
    name: 'Mobility',
    shortLabel: 'Mobility',
    iconName: 'Footprints',
    description: 'Ramps, step-free access, corridor clearances, door thresholds, and elevation changes.',
    accentColor: '#3B82F6',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-900',
  },
  {
    id: 'vision',
    name: 'Low Vision',
    shortLabel: 'Low Vision',
    iconName: 'Eye',
    description: 'Luminance contrast, anti-glare, step edge nosings, tactile pavers, and lighting levels.',
    accentColor: '#8B5CF6',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-900',
  },
  {
    id: 'hearing',
    name: 'Hearing',
    shortLabel: 'Hearing',
    iconName: 'Ear',
    description: 'Acoustic reverberation, assistive hearing loops, visual alarm signals, and visual wayfinding.',
    accentColor: '#10B981',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
  },
  {
    id: 'cognitive',
    name: 'Cognitive',
    shortLabel: 'Cognitive',
    iconName: 'Brain',
    description: 'Intuitive spatial layout, clutter reduction, plain language signage, and universal icons.',
    accentColor: '#EC4899',
    badgeBg: 'bg-pink-100',
    badgeText: 'text-pink-900',
  },
  {
    id: 'elderly',
    name: 'Elderly-Friendly',
    shortLabel: 'Elderly',
    iconName: 'HeartHandshake',
    description: 'Continuous grab rails, non-slip surfaces, resting spots, and high-support seating.',
    accentColor: '#F59E0B',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
  },
  {
    id: 'child',
    name: 'Child-Friendly',
    shortLabel: 'Child',
    iconName: 'Smile',
    description: 'Lowered handle reach, accessible push pads, step heights, and safe sightlines.',
    accentColor: '#14B8A6',
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-900',
  },
];

export function getLensColor(lensName: string): { bg: string; text: string; border: string } {
  const normalized = (lensName || '').toLowerCase();
  if (normalized.includes('mobility')) {
    return { bg: 'bg-[#EBF3FF]', text: 'text-[#1D4ED8]', border: 'border-[#BFDBFE]' };
  }
  if (normalized.includes('vision') || normalized.includes('sight')) {
    return { bg: 'bg-[#F3E8FF]', text: 'text-[#7E22CE]', border: 'border-[#DDD6FE]' };
  }
  if (normalized.includes('hearing') || normalized.includes('audio')) {
    return { bg: 'bg-[#E6FDF4]', text: 'text-[#047857]', border: 'border-[#A7F3D0]' };
  }
  if (normalized.includes('cognitive') || normalized.includes('brain')) {
    return { bg: 'bg-[#FDF2F8]', text: 'text-[#BE185D]', border: 'border-[#FBCFE8]' };
  }
  if (normalized.includes('elderly') || normalized.includes('senior')) {
    return { bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]', border: 'border-[#FDE68A]' };
  }
  if (normalized.includes('child') || normalized.includes('youth')) {
    return { bg: 'bg-[#CCFBF1]', text: 'text-[#0F766E]', border: 'border-[#99F6E4]' };
  }
  return { bg: 'bg-[#F4F4F5]', text: 'text-[#3F3F46]', border: 'border-[#E4E4E7]' };
}

export function getSeverityStyle(severity: string): { bg: string; text: string; dot: string; label: string } {
  const norm = (severity || '').toLowerCase();
  if (norm === 'high') {
    return {
      bg: 'bg-[#FEE2E2]',
      text: 'text-[#991B1B]',
      dot: 'bg-[#DC2626]',
      label: 'High Priority',
    };
  }
  if (norm === 'medium') {
    return {
      bg: 'bg-[#FEF3C7]',
      text: 'text-[#92400E]',
      dot: 'bg-[#F59E0B]',
      label: 'Moderate Priority',
    };
  }
  return {
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#065F46]',
    dot: 'bg-[#10B981]',
    label: 'Low / Advisory',
  };
}
