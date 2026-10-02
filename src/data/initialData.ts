import { Doctor, Service, ClinicSchedule, PatientReview, GalleryItem, ClinicSettings, Appointment } from '../types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Nisarga Kansar',
    qualification: 'MDS - Pediatric & Preventive Dentistry',
    role: 'Pediatric & Preventive Dentist',
    specialization: 'Pediatric & Preventive Dentistry',
    shortBio: 'Specialist in pediatric oral healthcare, gentle early-stage intervention, preventive tooth conservation, and child-friendly dental visits.',
    fullBio: 'Dr. Nisarga Kansar holds an MDS in Pediatric and Preventive Dentistry. She focuses on positive, anxiety-free dental experiences for infants, children, and adolescents, emphasizing preventive oral habits, space maintenance, and pain-free restorative care.',
    specialties: [
      'Child-Friendly Dental Care',
      'Painful Teething Care',
      'Preventive Sealants & Fluoride',
      'Early Cavity Intervention',
      'Habit Breaking Appliances'
    ],
    daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    isActive: true,
    avatarColor: 'from-[#0D6969] to-[#0A4D4D]'
  },
  {
    id: 'doc-2',
    name: 'Dr. Anushree N',
    qualification: 'MDS, FCCS',
    role: 'Oral & Maxillofacial Surgeon & Implantologist',
    specialization: 'Oral & Maxillofacial Surgery & Implantology',
    shortBio: 'Specialist in surgical extractions, wisdom teeth surgery, advanced dental implants, and corrective maxillofacial treatments.',
    fullBio: 'Dr. Anushree N (MDS, FCCS) brings specialized surgical training in oral and maxillofacial procedures and dental implantology. She provides precise, minimally invasive surgical solutions, complex impactions, bone grafting, and immediate implant restorations with modern diagnostic planning.',
    specialties: [
      'Wisdom Tooth Extractions',
      'Surgical Tooth Extractions',
      'Dental Implant Restorations',
      'Maxillofacial Trauma & Consultations',
      'Pre-prosthetic Surgery'
    ],
    daysAvailable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    isActive: true,
    avatarColor: 'from-[#15222E] to-[#2C3E50]'
  }
];

export const INITIAL_SERVICES: Service[] = [
  // General Dentistry
  {
    id: 'srv-1',
    slug: 'dental-check-up',
    name: 'Dental Check-up & Comprehensive Exam',
    category: 'General Dentistry',
    description: 'Thorough clinical examination of teeth, gums, and oral tissues with personalized oral health reporting.',
    durationMinutes: 30,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-1',
    isActive: true,
    whatItIs: 'A complete clinical assessment of your oral cavity using high-clarity intraoral inspection to detect early signs of decay, gum inflammation, or structural wear before discomfort develops.',
    whenNeeded: [
      'Routine 6-month preventive check-up',
      'Sensitivity to hot or cold foods',
      'Food impaction between teeth',
      'Baseline dental check before orthodontic or restorative work'
    ],
    whatToExpect: [
      'Detailed visual examination of teeth and gum tissue',
      'Digital diagnostic review when indicated',
      'Explanation of clinical findings and custom care plan',
      'Preventive home hygiene recommendations'
    ],
    faqs: [
      {
        question: 'How often should I schedule a dental check-up?',
        answer: 'For most children and adults, a comprehensive check-up every six months helps catch developing issues early and maintain healthy gums.'
      },
      {
        question: 'Will the examination cause any discomfort?',
        answer: 'No. A standard check-up is gentle, non-invasive, and designed to evaluate your oral health comfortably.'
      }
    ]
  },
  {
    id: 'srv-2',
    slug: 'toothache-treatment',
    name: 'Toothache Treatment & Relief',
    category: 'General Dentistry',
    description: 'Targeted diagnosis and prompt clinical care to identify the underlying cause of acute dental pain and provide lasting relief.',
    durationMinutes: 45,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-1',
    isActive: true,
    whatItIs: 'Emergency and diagnostic intervention focused on pinpointing whether your toothache is caused by deep decay, pulp inflammation, cracked tooth structure, or gum infection.',
    whenNeeded: [
      'Sharp, throbbing, or continuous tooth pain',
      'Pain when chewing or biting down',
      'Lingering sensitivity to cold or hot liquids',
      'Swelling around the gum line or jaw'
    ],
    whatToExpect: [
      'Immediate symptom assessment and pain relief measures',
      'Identification of the root cause',
      'Clear discussion of long-term restorative options'
    ],
    faqs: [
      {
        question: 'What should I do before reaching the clinic for a toothache?',
        answer: 'Rinse gently with warm water, avoid chewing on the affected side, and avoid applying aspirin directly on the gums. Contact our clinic promptly.'
      }
    ]
  },
  {
    id: 'srv-3',
    slug: 'cavity-treatment',
    name: 'Cavity Treatment & Tooth-Colored Fillings',
    category: 'General Dentistry',
    description: 'Conservative removal of tooth decay followed by seamless aesthetic composite restoration.',
    durationMinutes: 45,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-1',
    isActive: true,
    whatItIs: 'Gentle, tooth-preserving restoration that replaces damaged tooth enamel with high-strength, tooth-colored composite resin matched to your natural shade.',
    whenNeeded: [
      'Visible dark spots or crevices on tooth surface',
      'Mild sensitivity to sweets or temperature',
      'Chipped or worn enamel edges'
    ],
    whatToExpect: [
      'Gentle tooth preparation preserving healthy tooth structure',
      'Precise bonding with shade-matched composite material',
      'Polishing for a smooth, natural bite contour'
    ],
    faqs: [
      {
        question: 'How long do composite tooth-colored fillings last?',
        answer: 'With good oral hygiene and regular dental check-ups, composite restorations typically last many years.'
      }
    ]
  },
  {
    id: 'srv-4',
    slug: 'dental-hygiene-cleaning',
    name: 'Preventive Dental Care & Dental Hygiene',
    category: 'General Dentistry',
    description: 'Ultrasonic scaling and professional polishing to remove hardened calculus, plaque, and surface stains.',
    durationMinutes: 40,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-1',
    isActive: true,
    whatItIs: 'Professional ultrasonic prophylaxis designed to eliminate tartar build-up above and below the gum margin, preventing gingivitis and freshening breath.',
    whenNeeded: [
      'Bleeding gums during regular brushing',
      'Yellowish or brown tartar buildup along teeth margins',
      'Persistent bad breath despite brushing'
    ],
    whatToExpect: [
      'Gentle ultrasonic scaling to clear calculus',
      'Air-powder or paste polishing for stain removal',
      'Personalized flossing and brushing technique guidance'
    ],
    faqs: [
      {
        question: 'Does teeth cleaning make teeth loose or thin the enamel?',
        answer: 'No, this is a common myth. Professional ultrasonic cleaning only removes harmful tartar and plaque deposits without harming natural tooth enamel.'
      }
    ]
  },

  // Pediatric Dentistry (Dr. Nisarga Kansar)
  {
    id: 'srv-5',
    slug: 'pediatric-dental-care',
    name: 'Pediatric Dental Care & Consultations',
    category: 'Pediatric Dentistry',
    description: 'Child-centered oral care in a comforting, friendly atmosphere designed specifically for young patients.',
    durationMinutes: 30,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-1',
    isActive: true,
    whatItIs: 'Specialized dental care led by Dr. Nisarga Kansar (MDS - Pediatric Dentistry), combining behavioral guidance, child-sized instruments, and gentle techniques to foster lifelong positive dental attitudes.',
    whenNeeded: [
      'First dental visit by child’s first birthday or first tooth',
      'Early childhood decay or bottle caries',
      'Routine pediatric oral monitoring as baby teeth erupt and exfoliate'
    ],
    whatToExpect: [
      'Warm introductory conversation using child-friendly language',
      'Gentle lap or chair exam suited to the child’s comfort',
      'Guidance for parents on diet, nighttime feeding, and brushing'
    ],
    faqs: [
      {
        question: 'When should a child have their first dental visit?',
        answer: 'Pediatric dental guidelines recommend visiting a pediatric dentist within six months of the first tooth erupting or by the child’s first birthday.'
      }
    ]
  },
  {
    id: 'srv-6',
    slug: 'painful-teething-care',
    name: 'Painful Teething Care & Management',
    category: 'Pediatric Dentistry',
    description: 'Relief strategies and clinical evaluation for toddlers and infants experiencing difficult primary tooth eruption.',
    durationMinutes: 30,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-1',
    isActive: true,
    whatItIs: 'Clinical assessment of erupting tooth follicles to alleviate inflamed gum pads, rule out oral ulcers or infection, and guide parents on safe teething comfort.',
    whenNeeded: [
      'Severe gum tenderness, redness, or swelling in infants',
      'Difficulty sleeping or feeding related to erupting molars',
      'Excessive drooling and gum rubbing'
    ],
    whatToExpect: [
      'Inspection of eruption cyst or swollen gum tissue',
      'Safe, age-appropriate topical soothing protocols',
      'Reassurance and dietary advice for soothing the infant'
    ],
    faqs: [
      {
        question: 'Are teething gels safe for infants?',
        answer: 'Certain over-the-counter gels with benzocaine should be avoided in babies. We evaluate your child and provide safe, approved soothing solutions.'
      }
    ]
  },
  {
    id: 'srv-7',
    slug: 'children-dental-checkups',
    name: "Children's Dental Check-ups & Preventive Sealants",
    category: 'Pediatric Dentistry',
    description: 'Pit and fissure sealants, topical fluoride varnish, and cavity-risk assessments for growing smiles.',
    durationMinutes: 35,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-1',
    isActive: true,
    whatItIs: 'Preventive dental treatments that protect deep grooves of newly erupted permanent molars from cavity-causing bacteria before decay can start.',
    whenNeeded: [
      'Eruption of first permanent molars around age 6',
      'Children prone to sugar consumption or deep tooth grooves',
      'Semi-annual pediatric wellness check-up'
    ],
    whatToExpect: [
      'Tooth surface cleaning without drilling',
      'Application of protective clear or white resin sealant',
      'Fluoride varnish treatment to strengthen enamel against acid attack'
    ],
    faqs: [
      {
        question: 'Do dental sealants hurt when applied?',
        answer: 'Not at all. Sealant placement is completely painless, requires no drilling or numbing, and takes only a few minutes per tooth.'
      }
    ]
  },

  // Oral & Maxillofacial (Dr. Anushree N)
  {
    id: 'srv-8',
    slug: 'wisdom-tooth-extraction',
    name: 'Wisdom Tooth Extraction & Surgical Care',
    category: 'Oral & Maxillofacial',
    description: 'Specialist surgical extraction of impacted, angled, or painful third molars under comfortable local anesthesia.',
    durationMinutes: 60,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-2',
    isActive: true,
    whatItIs: 'Precise surgical removal of troublesome third molars led by Dr. Anushree N (MDS, FCCS - Oral & Maxillofacial Surgeon), minimizing tissue trauma and accelerating recovery.',
    whenNeeded: [
      'Impacted wisdom teeth stuck beneath bone or gum tissue',
      'Pericoronitis (swelling and severe pain around the back gums)',
      'Pressure against adjacent second molars causing damage or crowding',
      'Difficulty opening the mouth (trismus) or facial swelling'
    ],
    whatToExpect: [
      'Diagnostic review of root anatomy and nerve proximity',
      'Effective local anesthesia for complete numbness during procedure',
      'Gentle surgical sectioning and sterile suturing',
      'Detailed post-operative medication and recovery instructions'
    ],
    faqs: [
      {
        question: 'Is wisdom tooth extraction painful?',
        answer: 'The procedure itself is performed under comprehensive local anesthesia, so you will feel pressure but no sharp pain. We provide clear pain management medication for post-op healing.'
      },
      {
        question: 'How long is the recovery time?',
        answer: 'Most patients resume normal light activities within 2 to 3 days, with initial tissue healing occurring over 7 to 10 days.'
      }
    ]
  },
  {
    id: 'srv-9',
    slug: 'surgical-tooth-extraction',
    name: 'Surgical Tooth Extraction & Bone Preservation',
    category: 'Oral & Maxillofacial',
    description: 'Safe extraction of severely decayed, broken, or non-restorable teeth with site preservation.',
    durationMinutes: 45,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-2',
    isActive: true,
    whatItIs: 'Careful removal of fractured roots or teeth with complex anatomy where standard extraction is insufficient, preserving the surrounding bone for future replacement.',
    whenNeeded: [
      'Tooth fractured below the gumline',
      'Severely curved or brittle root structures',
      'Preparation for immediate or future dental implant placement'
    ],
    whatToExpect: [
      'Thorough clinical assessment and tissue numbing',
      'Minimally traumatic extraction preserving socket architecture',
      'Clear post-operative guidance'
    ],
    faqs: [
      {
        question: 'Can I replace the extracted tooth right away?',
        answer: 'During consultation, Dr. Anushree will evaluate if immediate implant placement or bone grafting is appropriate for your specific case.'
      }
    ]
  },
  {
    id: 'srv-10',
    slug: 'oral-maxillofacial-consultation',
    name: 'Oral & Maxillofacial Consultation',
    category: 'Oral & Maxillofacial',
    description: 'Comprehensive consultation for facial jaw discrepancies, cyst pathology, temporomandibular joint (TMJ) discomfort, and surgical planning.',
    durationMinutes: 45,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-2',
    isActive: true,
    whatItIs: 'Specialist evaluation of complex oral surgical needs, jaw joint function, soft-tissue lesions, and pre-implant reconstructive requirements.',
    whenNeeded: [
      'Clicking, popping, or jaw joint tenderness',
      'Persistent non-healing oral ulcers or jaw swelling',
      'Surgical evaluation prior to orthodontic corrections'
    ],
    whatToExpect: [
      'Detailed clinical jaw and facial examination',
      'Evaluation of TMJ movement and occlusion',
      'Structured surgical or non-surgical management plan'
    ],
    faqs: [
      {
        question: 'Do I need a prior referral to see the maxillofacial surgeon?',
        answer: 'No referral is needed. You can book an appointment directly with Dr. Anushree N through our website or phone.'
      }
    ]
  },

  // Endodontics
  {
    id: 'srv-11',
    slug: 'root-canal-treatment',
    name: 'Root Canal Treatment (RCT)',
    category: 'Endodontics',
    description: 'Painless removal of infected pulp tissue, thorough canal disinfection, and hermetic sealing to preserve natural tooth structure.',
    durationMinutes: 60,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-2',
    isActive: true,
    whatItIs: 'A restorative endodontic procedure that saves severely infected or traumatized teeth by clearing inflamed nerve pulp, disinfecting microscopic canals, and filling them with biocompatible gutta-percha.',
    whenNeeded: [
      'Severe pain while chewing or spontaneous throbbing at night',
      'Pimple-like bump or abscess on the gums near a tooth',
      'Prolonged sensitivity to hot or cold temperatures',
      'Discoloration or darkening of an injured tooth'
    ],
    whatToExpect: [
      'Complete local numbing for a painless experience',
      'Isolation of the tooth with a clean barrier',
      'Micro-instrumentation to cleanse root canals',
      'Precision filling and placement of a protective restorative seal'
    ],
    faqs: [
      {
        question: 'Is root canal treatment painful?',
        answer: 'Modern root canal therapy is performed under profound local anesthesia and is comparable to getting a standard filling in terms of comfort. It relieves pain rather than causing it.'
      },
      {
        question: 'Does a root canal treated tooth require a crown?',
        answer: 'In most back teeth, placing a protective crown after root canal treatment is recommended to prevent future fracture and restore full chewing strength.'
      }
    ]
  },
  {
    id: 'srv-12',
    slug: 'tooth-pain-evaluation',
    name: 'Tooth Pain Evaluation & Pulp Testing',
    category: 'Endodontics',
    description: 'Precision diagnostic testing to differentiate between reversible pulpitis, nerve necrosis, and periodontal pain.',
    durationMinutes: 30,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-1',
    isActive: true,
    whatItIs: 'Specialized diagnostic evaluation combining thermal response testing, percussion sensitivity checks, and clinical examination to identify the precise origin of unclear facial or dental pain.',
    whenNeeded: [
      'Uncertain location of tooth discomfort',
      'Vague pain radiating towards ear, temple, or neck',
      'Persistent sensitivity following recent dental trauma'
    ],
    whatToExpect: [
      'Gentle vitality testing on adjacent and suspected teeth',
      'Accurate identification of the affected tooth',
      'Targeted treatment plan'
    ],
    faqs: [
      {
        question: 'Why is it sometimes hard to tell which tooth hurts?',
        answer: 'Dental nerves share common sensory pathways in the jaw. Diagnostic pulp testing helps us reliably isolate the exact tooth needing care.'
      }
    ]
  },

  // Implantology
  {
    id: 'srv-13',
    slug: 'dental-implant-consultation',
    name: 'Dental Implant Consultation & 3D Planning',
    category: 'Implantology',
    description: 'Comprehensive bone density assessment, digital smile planning, and treatment roadmap for permanent tooth replacement.',
    durationMinutes: 45,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-2',
    isActive: true,
    whatItIs: 'In-depth consultation with Dr. Anushree N to assess jawbone volume, gingival health, and anatomical landmarks for permanent titanium implant posts.',
    whenNeeded: [
      'One or more missing teeth',
      'Loose or uncomfortable removable dentures',
      'Teeth requiring extraction where immediate replacement is desired'
    ],
    whatToExpect: [
      'Intraoral evaluation of the missing tooth site',
      'Discussion of bone support and potential need for grafting',
      'Clear staged timeline and customized pricing estimate'
    ],
    faqs: [
      {
        question: 'How long do dental implants last?',
        answer: 'With proper oral hygiene and routine maintenance check-ups, dental implants are designed to be a permanent, lifelong tooth replacement option.'
      }
    ]
  },
  {
    id: 'srv-14',
    slug: 'dental-implant-treatment',
    name: 'Dental Implant Treatment & Restoration',
    category: 'Implantology',
    description: 'Biocompatible titanium fixture placement and custom porcelain crown attachment for natural chewing and aesthetics.',
    durationMinutes: 60,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-2',
    isActive: true,
    whatItIs: 'Surgical integration of a medical-grade titanium fixture into the jawbone that acts as an artificial root, followed by the placement of a lifelike ceramic crown.',
    whenNeeded: [
      'Permanent replacement of single or multiple missing teeth',
      'Full arch restoration seeking stable fixed teeth',
      'Prevention of jawbone resorption following tooth loss'
    ],
    whatToExpect: [
      'Precision surgical placement with gentle local anesthesia',
      'Osseointegration healing period for secure bone bonding',
      'Custom abutment and ceramic crown fabrication matched to adjacent teeth'
    ],
    faqs: [
      {
        question: 'Can anyone get a dental implant?',
        answer: 'Most healthy adults with adequate bone volume are excellent candidates. For individuals with reduced bone height, safe bone grafting techniques make implants possible.'
      }
    ]
  },

  // Orthodontics
  {
    id: 'srv-15',
    slug: 'braces-teeth-alignment',
    name: 'Braces & Teeth Alignment Consultation',
    category: 'Orthodontics',
    description: 'Clinical evaluation of tooth alignment, spacing, bite relationship, and modern ceramic or metal bracket options.',
    durationMinutes: 45,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-1',
    isActive: true,
    whatItIs: 'Orthodontic assessment of crowding, overbites, crossbites, and alignment irregularities for teenagers and adults seeking balanced facial aesthetics.',
    whenNeeded: [
      'Crooked, rotated, or overlapping teeth',
      'Gaps or spacing between teeth',
      'Difficulty chewing or biting with front teeth',
      'Jaw clicking caused by uneven bite contacts'
    ],
    whatToExpect: [
      'Photographic and dental cast evaluation',
      'Discussion of bracket types (metal, ceramic aesthetic braces)',
      'Estimated treatment timeline and milestone plan'
    ],
    faqs: [
      {
        question: 'Is it too late for adults to get braces?',
        answer: 'Not at all. Orthodontic movement is effective at any age as long as the supporting gums and jawbone are healthy.'
      }
    ]
  },

  // Cosmetic Dentistry
  {
    id: 'srv-16',
    slug: 'teeth-whitening',
    name: 'Teeth Whitening & Stain Removal',
    category: 'Cosmetic Dentistry',
    description: 'Safe in-office enamel brightening to eliminate extrinsic discoloration from tea, coffee, and age-related yellowing.',
    durationMinutes: 45,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-1',
    isActive: true,
    whatItIs: 'Controlled clinical whitening that applies specialized desensitizing barrier gels and dental whitening agents to visibly brighten tooth shade safely.',
    whenNeeded: [
      'Yellowed or dull enamel from beverages or food stains',
      'Upcoming wedding, celebration, or professional milestone',
      'Uneven surface staining'
    ],
    whatToExpect: [
      'Protective isolation of the gums and lips',
      'Careful application of professional whitening gel',
      'Immediate shade comparison and post-care advice'
    ],
    faqs: [
      {
        question: 'Does teeth whitening damage natural tooth enamel?',
        answer: 'When performed under clinical supervision with professional materials, whitening is safe and does not damage enamel structure.'
      }
    ]
  },
  {
    id: 'srv-17',
    slug: 'smile-enhancement',
    name: 'Smile Enhancement & Aesthetic Veneers',
    category: 'Cosmetic Dentistry',
    description: 'Custom aesthetic planning, composite bonding, and ceramic veneers to harmonize smile symmetry and tooth proportions.',
    durationMinutes: 45,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-1',
    isActive: true,
    whatItIs: 'Artistic dental design tailored to your facial contours, closing minor gaps, evening out irregular edges, and perfecting smile harmony.',
    whenNeeded: [
      'Chipped, worn down, or uneven tooth edges',
      'Persistent intrinsic discoloration resistant to whitening',
      'Minor midline gaps (diastema)'
    ],
    whatToExpect: [
      'Detailed aesthetic analysis and shade selection',
      'Conservative preparation preserving natural tooth structure',
      'Trial smile preview and finalized aesthetic bonding'
    ],
    faqs: [
      {
        question: 'What is composite bonding vs porcelain veneers?',
        answer: 'Composite bonding is performed directly in a single visit with resin, while porcelain veneers are custom-crafted by a dental laboratory for maximum longevity and stain resistance.'
      }
    ]
  },

  // Prosthodontics
  {
    id: 'srv-18',
    slug: 'dental-crowns',
    name: 'Dental Crowns & Bridges',
    category: 'Prosthodontics',
    description: 'Precision-fitted zirconia, ceramic, and metal-free crowns designed to protect weakened teeth and restore biting strength.',
    durationMinutes: 45,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-2',
    isActive: true,
    whatItIs: 'A custom-tailored prosthetic cap that covers the entire visible portion of a damaged or root-canal-treated tooth, providing structural integrity and natural appearance.',
    whenNeeded: [
      'Protection after root canal therapy',
      'Extensively fractured or cracked tooth',
      'Replacing a missing tooth with a fixed dental bridge'
    ],
    whatToExpect: [
      'Gentle tooth preparation and digital impression taking',
      'Placement of a comfortable temporary crown',
      'Final cementation with precision bite verification'
    ],
    faqs: [
      {
        question: 'What material is best for front teeth crowns?',
        answer: 'All-ceramic or high-translucency zirconia crowns are ideal for front teeth because they mimic natural enamel light reflection without dark metal margins.'
      }
    ]
  },

  // Periodontics
  {
    id: 'srv-19',
    slug: 'gum-care-periodontal',
    name: 'Gum Care & Periodontal Evaluation',
    category: 'Periodontics',
    description: 'Deep pocket measurement, root planing, and therapeutic care to halt gum recession and preserve dental bone support.',
    durationMinutes: 45,
    priceNote: 'Price available after consultation',
    assignedDoctorId: 'doc-1',
    isActive: true,
    whatItIs: 'Comprehensive diagnosis and treatment of periodontal conditions, addressing bleeding gums, pocket depths, and loose teeth to preserve bone stability.',
    whenNeeded: [
      'Puffy, swollen, or bleeding gums when brushing or flossing',
      'Receding gum line exposing tooth roots',
      'Teeth feeling mobile or shifting position'
    ],
    whatToExpect: [
      'Gentle periodontal charting measuring pocket depths',
      'Deep root surface debridement (scaling and root planing)',
      'Maintenance schedule tailored to your gum health'
    ],
    faqs: [
      {
        question: 'Can receding gums grow back?',
        answer: 'While gum tissue lost to periodontitis does not regenerate on its own without surgical grafting, prompt treatment halts progression and prevents tooth loss.'
      }
    ]
  }
];

export const INITIAL_SCHEDULE: ClinicSchedule = {
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  morningShift: {
    name: 'Morning Shift',
    start: '10:00',
    end: '13:30',
    label: '10:00 AM - 1:30 PM'
  },
  eveningShift: {
    name: 'Evening Shift',
    start: '17:00',
    end: '20:30',
    label: '5:00 PM - 8:30 PM'
  },
  sundayNotice: 'Prior appointment only',
  slotDurationMinutes: 30,
  bufferMinutes: 0,
  maxDailyAppointments: 24
};

export const INITIAL_SETTINGS: ClinicSettings = {
  name: 'Smile Architect Dental Clinic',
  tagline: 'Comprehensive Dental Health Centre',
  addressLine1: '850/S, 25th Cross Road, Manchegowdana Koppalu',
  addressLine2: 'Sankranthi Circle, Hebbal 2nd Stage, Ilavala Hobli',
  landmark: 'Near Sankranthi Circle',
  city: 'Mysuru',
  state: 'Karnataka',
  postalCode: '570016',
  phone: '+91 90368 27916',
  phoneRaw: '9036827916',
  whatsappNumber: '+919036827916',
  email: 'contact@smilearchitect.in',
  googleMapsUrl: 'https://maps.app.goo.gl/wWeqxCcboBwuFK2d7',
  announcementText: 'Now welcoming new patients for comprehensive pediatric, orthodontic, and implant consultations in Hebbal, Mysuru.',
  showAnnouncement: true
};

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Dental Operatory & Ergonomic Treatment Chair',
    category: 'Treatment Room',
    description: 'Bright, sterile treatment operatory equipped with modern dental chair, silent micromotors, and daylight illumination.',
    imageTag: 'operatory'
  },
  {
    id: 'gal-2',
    title: 'Warm Clinic Waiting Lounge',
    category: 'Waiting Area',
    description: 'Relaxed waiting space designed with dark wood furnishings, comfortable seating, and a calm, quiet atmosphere for families.',
    imageTag: 'waiting'
  },
  {
    id: 'gal-3',
    title: 'Glass-Partitioned Clinical Suites',
    category: 'Clinic',
    description: 'Clean architectural layout with hygienic glass partitions ensuring patient privacy and optimal sterility standards.',
    imageTag: 'clinic-interiors'
  },
  {
    id: 'gal-4',
    title: 'Digital Diagnostic & Intraoral Equipment',
    category: 'Dental Equipment',
    description: 'High-precision diagnostic imaging and low-radiation sensors for clear patient consultations.',
    imageTag: 'equipment'
  },
  {
    id: 'gal-5',
    title: 'Dr. Nisarga Kansar & Dr. Anushree N',
    category: 'Team',
    description: 'Our specialist dental team combining pediatric, preventive, implantology, and maxillofacial surgical expertise.',
    imageTag: 'team'
  },
  {
    id: 'gal-6',
    title: 'Smile Architect Clinic Identity & Signage',
    category: 'Branding',
    description: 'Signature script wordmark with integrated tooth glyph reflecting precision, gentle care, and artistic smile design.',
    imageTag: 'branding'
  }
];

export const INITIAL_REVIEWS: PatientReview[] = [
  {
    id: 'rev-1',
    patientName: 'Kavitha R.',
    rating: 5,
    reviewText: 'Dr. Nisarga was exceptionally patient with my 5-year-old son during his first dental filling. The clinic is clean, child-friendly, and very welcoming. No fear or tears at all!',
    date: 'August 2026',
    source: 'Verified Patient',
    doctorMentioned: 'Dr. Nisarga Kansar',
    isApproved: true
  },
  {
    id: 'rev-2',
    patientName: 'Suresh Kumar B.',
    rating: 5,
    reviewText: 'Consulted Dr. Anushree for an impacted wisdom tooth extraction. Her surgical precision and reassuring communication made what I feared would be painful surprisingly quick and smooth. Excellent clinic in Hebbal.',
    date: 'September 2026',
    source: 'Verified Patient',
    doctorMentioned: 'Dr. Anushree N',
    isApproved: true
  },
  {
    id: 'rev-3',
    patientName: 'Meenakshi Sundaram',
    rating: 5,
    reviewText: 'Professional atmosphere, dark wood clinic aesthetics that feel warm and modern rather than clinical or scary. Doctors explain every step before starting. Highly recommended in Mysuru.',
    date: 'July 2026',
    source: 'Verified Patient',
    doctorMentioned: 'Both Specialists',
    isApproved: true
  },
  {
    id: 'rev-4',
    patientName: 'Prashanth M.',
    rating: 5,
    reviewText: 'Got a thorough dental cleaning and cavity checkup. Transparent guidance with no pushy treatments. The clinic staff is courteous and booking appointments is straightforward.',
    date: 'September 2026',
    source: 'Verified Patient',
    doctorMentioned: 'Dr. Nisarga Kansar',
    isApproved: true
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    bookingRef: 'SA-9014',
    patientName: 'Rohit Sharma',
    patientPhone: '+91 98450 12345',
    patientEmail: 'rohit.s@example.com',
    patientAge: 32,
    isNewPatient: false,
    preferredContact: 'WhatsApp',
    serviceId: 'srv-1',
    serviceName: 'Dental Check-up & Comprehensive Exam',
    doctorId: 'doc-1',
    doctorName: 'Dr. Nisarga Kansar',
    appointmentDate: new Date().toISOString().split('T')[0],
    startTime: '10:30 AM',
    notes: 'Routine 6-month checkup and mild sensitivity evaluation.',
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'apt-2',
    bookingRef: 'SA-9015',
    patientName: 'Ananya Hegde',
    patientPhone: '+91 99001 88421',
    patientEmail: 'ananya.hegde@example.com',
    patientAge: 27,
    isNewPatient: true,
    preferredContact: 'Phone',
    serviceId: 'srv-8',
    serviceName: 'Wisdom Tooth Extraction & Surgical Care',
    doctorId: 'doc-2',
    doctorName: 'Dr. Anushree N',
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '05:30 PM',
    notes: 'Severe pain on lower right jaw, pericoronitis evaluation.',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
