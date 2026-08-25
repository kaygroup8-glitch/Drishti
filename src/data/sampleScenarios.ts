import { SampleScenario } from '../types';

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'school-entrance',
    title: 'School Main Entrance',
    subtitle: 'Primary school exterior entrance with steps and heavy double doors',
    category: 'Educational Facility',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    result: {
      id: 'demo-school-entrance',
      createdAt: 'Demo analysis',
      imageName: 'school_main_entrance.jpg',
      imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
      selectedLenses: ['Mobility', 'Low Vision', 'Child-Friendly', 'Elderly-Friendly'],
      accessibilityScore: 54,
      scoreLabel: 'Areas Needing Attention',
      strongAreas: [
        'Well-lit exterior overhead illumination',
        'Wide entry opening width when fully cleared',
        'Distinct natural daylight visibility'
      ],
      areasNeedingAttention: [
        'Stepped entrance without adjacent ramp access',
        'High door hardware inaccessible to younger children and wheelchair users',
        'Lack of high-contrast tactile step edge markings'
      ],
      highestPriorityImprovement: 'Provide an integrated step-free ramp or level entryway alongside high-contrast step indicators.',
      summary: 'The main entryway presents multiple elevation barriers and elevated handle placements that may obstruct individuals using wheelchairs, young students, or visitors with reduced mobility.',
      isDemo: true,
      disclaimer: 'Drishti provides AI-generated accessibility observations, not a substitute for professional accessibility assessment or lived-experience consultation.',
      findings: [
        {
          id: 1,
          title: 'Stepped Threshold Without Ramp',
          lens: 'Mobility',
          severity: 'High',
          whatDetected: 'Main entrance requires ascending three stone stairs without an adjacent visible ramp or level threshold.',
          whyItMatters: 'Physical stairs present a complete barrier for wheelchair users, stroller pushers, and people with mobility assistive devices.',
          suggestedImprovement: 'Construct a compliant step-free ramp (1:12 slope minimum) with continuous dual handrails or create a level side entrance with clear signage.',
          confidence: 'High',
          location: {
            xPercent: 48,
            yPercent: 78,
            label: 'Entrance Steps'
          },
          evidenceAssessment: 'Clear visual presence of unramped stairs in foreground.'
        },
        {
          id: 2,
          title: 'High Door Handle Placement',
          lens: 'Child-Friendly',
          severity: 'Medium',
          whatDetected: 'Heavy pull-bar handle is mounted approximately 120cm above the step level with no secondary low-reach push pad.',
          whyItMatters: 'Younger school children and seated wheelchair users may struggle to reach and exert enough pulling force to open the door independently.',
          suggestedImprovement: 'Install automatic door push-buttons mounted at 80cm-90cm height or add full-length vertical handles that span down to 40cm above ground.',
          confidence: 'Medium',
          location: {
            xPercent: 52,
            yPercent: 46,
            label: 'Door Handle'
          },
          evidenceAssessment: 'Single high-mounted handle clearly visible on door frame.'
        },
        {
          id: 3,
          title: 'Low Contrast Stair Edges',
          lens: 'Low Vision',
          severity: 'Medium',
          whatDetected: 'Uniform monochromatic stone steps with no distinct yellow or white high-contrast nosing strips.',
          whyItMatters: 'People with low vision or depth perception challenges may misjudge step boundaries, increasing tripping and fall hazards.',
          suggestedImprovement: 'Apply permanent, anti-slip contrast nosing strips (minimum 50mm width, 30% luminance contrast) along the full edge of each step.',
          confidence: 'High',
          location: {
            xPercent: 50,
            yPercent: 88,
            label: 'Stair Nosings'
          },
          evidenceAssessment: 'Step treads and risers show identical tone with minimal edge definition.'
        },
        {
          id: 4,
          title: 'Absence of Resting Handrails',
          lens: 'Elderly-Friendly',
          severity: 'Medium',
          whatDetected: 'The wide stairway has no center handrail or tactile continuous grab surface along the primary approach path.',
          whyItMatters: 'Older adults and individuals with balance instability require continuous bilateral support when ascending or descending steps.',
          suggestedImprovement: 'Install dual sturdy handrails on both sides of the stairway with rounded ends extending past the top and bottom risers.',
          confidence: 'High',
          location: {
            xPercent: 24,
            yPercent: 70,
            label: 'Stair Side Perimeter'
          },
          evidenceAssessment: 'Open perimeter lacks grasping structures.'
        }
      ]
    }
  },
  {
    id: 'public-building',
    title: 'Civic Hall Reception & Atrium',
    subtitle: 'Public municipal lobby with turnstiles, high check-in counter, and glossy floor',
    category: 'Public Services',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    result: {
      id: 'demo-public-building',
      createdAt: 'Demo analysis',
      imageName: 'civic_reception_lobby.jpg',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      selectedLenses: ['Mobility', 'Low Vision', 'Hearing', 'Cognitive'],
      accessibilityScore: 68,
      scoreLabel: 'Moderate Accessibility',
      strongAreas: [
        'Spacious open pathway clearances throughout central atrium',
        'Even ambient ceiling lighting with minimal dark corners',
        'Automated glass entry doors'
      ],
      areasNeedingAttention: [
        'Single-height elevated reception counter lacking wheelchair cut-out',
        'Reflective polished flooring creating glare and sound reverberation',
        'Lack of visible assistive listening system signage'
      ],
      highestPriorityImprovement: 'Provide a lowered reception section (760mm height) equipped with an induction loop and acoustic sound absorption.',
      summary: 'The open atrium offers good physical corridor space, but high counter desks, reflective surfaces, and visual disorientation present barriers across low vision, hearing, and cognitive perspectives.',
      isDemo: true,
      disclaimer: 'Drishti provides AI-generated accessibility observations, not a substitute for professional accessibility assessment or lived-experience consultation.',
      findings: [
        {
          id: 1,
          title: 'High Standing-Only Reception Desk',
          lens: 'Mobility',
          severity: 'High',
          whatDetected: 'Customer service desk stands at uniform bar-height (approx 110cm) with no dropped counter section or knee clearance.',
          whyItMatters: 'Wheelchair users and individuals of short stature cannot interact eye-to-eye or comfortably sign documents at this counter height.',
          suggestedImprovement: 'Add a lowered counter section (maximum 76cm to 86cm high) with 48cm minimum knee clearance beneath the desk surface.',
          confidence: 'High',
          location: {
            xPercent: 68,
            yPercent: 58,
            label: 'Reception Counter'
          },
          evidenceAssessment: 'Single-tier elevated desk structure visible.'
        },
        {
          id: 2,
          title: 'High-Gloss Floor Glare and Reflection',
          lens: 'Low Vision',
          severity: 'Medium',
          whatDetected: 'Highly polished terrazzo floor reflects overhead spotlighting, producing bright glare patches and misleading depth cues.',
          whyItMatters: 'Intense floor reflections confuse visual navigation, simulate false obstacles or water puddles, and reduce contrast for individuals with low vision.',
          suggestedImprovement: 'Apply matte anti-glare floor sealers or install tactile ground surface indicators (TGSI) leading from entrance to information desks.',
          confidence: 'Medium',
          location: {
            xPercent: 42,
            yPercent: 82,
            label: 'Polished Flooring'
          },
          evidenceAssessment: 'Distinct light reflections visible across the walkway.'
        },
        {
          id: 3,
          title: 'Acoustic Echo and Missing Hearing Loop Signs',
          lens: 'Hearing',
          severity: 'Medium',
          whatDetected: 'Hard glass and stone surfaces create reverberant acoustics with no Hearing Loop (T-Coil) or captioning symbols displayed.',
          whyItMatters: 'Echo and background chatter severely impede speech comprehension for hearing aid users and individuals with auditory processing challenges.',
          suggestedImprovement: 'Install a counter hearing loop system, display standard blue ear assistive listening signage, and integrate acoustic baffle panels.',
          confidence: 'Moderate' as any,
          location: {
            xPercent: 78,
            yPercent: 44,
            label: 'Service Window'
          },
          evidenceAssessment: 'No assistive listening symbols seen at transaction desk.'
        },
        {
          id: 4,
          title: 'Sparse Wayfinding and Waypoint Icons',
          lens: 'Cognitive',
          severity: 'Low',
          whatDetected: 'Wayfinding relies on small single-language text placards rather than standardized symbols and intuitive color zoning.',
          whyItMatters: 'Visitors with cognitive differences, non-native speakers, or high-anxiety guests can easily become disoriented in large open spaces.',
          suggestedImprovement: 'Introduce multi-modal signage combining plain language, standardized universal pictograms, and color-coded destination zones.',
          confidence: 'High',
          location: {
            xPercent: 28,
            yPercent: 35,
            label: 'Signage Column'
          },
          evidenceAssessment: 'Signage contains text blocks without universal icons.'
        }
      ]
    }
  },
  {
    id: 'restaurant-dining',
    title: 'Bistro Dining Room',
    subtitle: 'Urban restaurant with tight booth seating, high-top bar tables, and dim ambient lighting',
    category: 'Hospitality & Dining',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    result: {
      id: 'demo-restaurant-dining',
      createdAt: 'Demo analysis',
      imageName: 'bistro_dining_room.jpg',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      selectedLenses: ['Mobility', 'Low Vision', 'Hearing', 'Cognitive', 'Elderly-Friendly'],
      accessibilityScore: 61,
      scoreLabel: 'Areas Needing Attention',
      strongAreas: [
        'Smooth level hardwood floor throughout primary dining area',
        'Movable center chairs allowing adaptable seating positioning',
        'Clear central pathway to emergency exit'
      ],
      areasNeedingAttention: [
        'Tight aisle spacing between adjacent tables restricting wheelchair navigation',
        'Low ambient lighting hindering lip-reading and menu visibility',
        'Fixed booth banquette seating without transfer grab points'
      ],
      highestPriorityImprovement: 'Reconfigure floor layout to maintain minimum 900mm clear accessible paths and provide portable task lamps and large-print menus.',
      summary: 'The dining setting features warm atmosphere but has narrow passages, high stools, and low illumination that may present barriers for guests with mobility devices, low vision, or hearing aids.',
      isDemo: true,
      disclaimer: 'Drishti provides AI-generated accessibility observations, not a substitute for professional accessibility assessment or lived-experience consultation.',
      findings: [
        {
          id: 1,
          title: 'Narrow Aisle Clearance Between Tables',
          lens: 'Mobility',
          severity: 'High',
          whatDetected: 'Aisles between four-top tables measure approximately 60cm to 70cm when chairs are occupied.',
          whyItMatters: 'Standard wheelchairs and walkers require a minimum continuous aisle width of 90cm (preferable 100cm) to navigate comfortably without obstruction.',
          suggestedImprovement: 'Re-space primary aisle tables to provide at least 90cm to 100cm of clear clearance, reserving accessible tables near entryways.',
          confidence: 'High',
          location: {
            xPercent: 45,
            yPercent: 72,
            label: 'Table Aisle'
          },
          evidenceAssessment: 'Chair legs and table corners crowd the central walking lane.'
        },
        {
          id: 2,
          title: 'Dim Lighting and Low Contrast Ambiance',
          lens: 'Low Vision',
          severity: 'Medium',
          whatDetected: 'Warm low-lux hanging filament bulbs produce soft amber lighting with prominent cast shadows.',
          whyItMatters: 'Low light levels make it difficult to read menus, perceive subtle floor level changes, and identify facial cues for speech understanding.',
          suggestedImprovement: 'Offer adjustable table-level task lights, high-contrast large-print menus (18pt+), and digital screen-reader accessible QR menus.',
          confidence: 'High',
          location: {
            xPercent: 55,
            yPercent: 25,
            label: 'Pendant Fixtures'
          },
          evidenceAssessment: 'Pendant fixtures create high-contrast shadows with dim localized illumination.'
        },
        {
          id: 3,
          title: 'Hard Acoustic Reflection Surfaces',
          lens: 'Hearing',
          severity: 'Medium',
          whatDetected: 'Exposed brick walls, wooden floors, and hard ceiling create high acoustic bounce with no visible sound dampening.',
          whyItMatters: 'High ambient noise levels make conversations stressful or unintelligible for people with hearing aids, cochlear implants, or auditory fatigue.',
          suggestedImprovement: 'Incorporate acoustic ceiling baffles, fabric wall art, upholstered booth dividers, or rubber chair leg caps to dampen dining clatter.',
          confidence: 'Medium',
          location: {
            xPercent: 20,
            yPercent: 40,
            label: 'Brick Wall'
          },
          evidenceAssessment: 'Hard reflective surfaces without fabric treatment.'
        },
        {
          id: 4,
          title: 'Fixed Height Bar Stools Without Backrests',
          lens: 'Elderly-Friendly',
          severity: 'Medium',
          whatDetected: 'Perimeter counter uses elevated backless wooden bar stools.',
          whyItMatters: 'Stools without supportive backs or armrests present instability and fatigue risks for older adults or individuals with core balance conditions.',
          suggestedImprovement: 'Provide sturdy seating options with high supportive backrests, footrests, and arm supports at all dining zones.',
          confidence: 'High',
          location: {
            xPercent: 82,
            yPercent: 62,
            label: 'Bar Stools'
          },
          evidenceAssessment: 'Tall backless seating units visible at counter perimeter.'
        }
      ]
    }
  }
];
