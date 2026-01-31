import { Treatment } from '@/types/medical';

export const treatments: Record<string, Treatment> = {
  // Migraine treatments
  ibuprofen: {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    type: 'medication',
    description: 'Non-steroidal anti-inflammatory drug (NSAID) that helps reduce pain and inflammation. Take 200-400mg every 4-6 hours as needed.',
  },
  sumatriptan: {
    id: 'sumatriptan',
    name: 'Sumatriptan (Imitrex)',
    type: 'medication',
    description: 'Prescription medication specifically for migraine treatment. Narrows blood vessels around the brain and blocks pain pathways.',
  },
  darkRoom: {
    id: 'darkRoom',
    name: 'Rest in Dark Room',
    type: 'lifestyle',
    description: 'Find a quiet, dark room to rest. Light and sound sensitivity often accompany migraines. Apply cold compress to forehead.',
  },
  stressManagement: {
    id: 'stressManagement',
    name: 'Stress Management',
    type: 'therapy',
    description: 'Practice relaxation techniques including meditation, yoga, and biofeedback. Regular exercise and adequate sleep can reduce frequency.',
  },

  // Concussion treatments
  rest: {
    id: 'rest',
    name: 'Physical and Cognitive Rest',
    type: 'lifestyle',
    description: 'Limit physical activity and cognitive tasks (screen time, reading, work). Gradually return to normal activities as symptoms improve.',
  },
  acetaminophen: {
    id: 'acetaminophen',
    name: 'Acetaminophen',
    type: 'medication',
    description: 'Pain reliever for headache symptoms. Avoid NSAIDs initially due to bleeding risk. Consult doctor for appropriate dosage.',
  },
  vestibularTherapy: {
    id: 'vestibularTherapy',
    name: 'Vestibular Rehabilitation',
    type: 'therapy',
    description: 'Physical therapy to improve balance and reduce dizziness. Exercises target coordination and visual stability.',
  },

  // Sinusitis treatments
  decongestant: {
    id: 'decongestant',
    name: 'Nasal Decongestant',
    type: 'medication',
    description: 'Reduces nasal congestion and sinus pressure. Available as sprays or oral medications. Use spray for no more than 3 days.',
  },
  salineRinse: {
    id: 'salineRinse',
    name: 'Saline Nasal Irrigation',
    type: 'lifestyle',
    description: 'Use neti pot or saline spray to flush nasal passages. Helps remove mucus and allergens. Use distilled or boiled water.',
  },
  antibiotics: {
    id: 'antibiotics',
    name: 'Antibiotics',
    type: 'medication',
    description: 'Prescribed for bacterial sinusitis. Common options include amoxicillin or doxycycline. Complete full course as directed.',
  },
  sinusSurgery: {
    id: 'sinusSurgery',
    name: 'Endoscopic Sinus Surgery',
    type: 'surgical',
    description: 'For chronic sinusitis not responding to other treatments. Removes blockages and improves drainage pathways.',
  },

  // Herniated disc treatments
  physicalTherapy: {
    id: 'physicalTherapy',
    name: 'Physical Therapy',
    type: 'therapy',
    description: 'Strengthening and flexibility exercises to support the spine. Includes core strengthening and postural training.',
  },
  epiduralInjection: {
    id: 'epiduralInjection',
    name: 'Epidural Steroid Injection',
    type: 'therapy',
    description: 'Corticosteroid injection into epidural space to reduce inflammation and pain. Provides temporary relief.',
  },
  discectomy: {
    id: 'discectomy',
    name: 'Microdiscectomy',
    type: 'surgical',
    description: 'Minimally invasive surgery to remove herniated portion of disc. Performed when conservative treatments fail.',
  },

  // Scoliosis treatments
  bracing: {
    id: 'bracing',
    name: 'Spinal Brace',
    type: 'therapy',
    description: 'Custom-fitted brace worn to prevent curve progression in growing children. Must be worn 16-23 hours daily.',
  },
  schrothTherapy: {
    id: 'schrothTherapy',
    name: 'Schroth Method',
    type: 'therapy',
    description: 'Specialized physical therapy using exercises to improve posture and breathing. Focuses on 3D correction.',
  },
  spinalFusion: {
    id: 'spinalFusion',
    name: 'Spinal Fusion Surgery',
    type: 'surgical',
    description: 'Surgical procedure to fuse vertebrae together to correct severe curves. Uses metal rods and screws for stabilization.',
  },

  // ACL tear treatments
  riceProtocol: {
    id: 'riceProtocol',
    name: 'RICE Protocol',
    type: 'lifestyle',
    description: 'Rest, Ice, Compression, Elevation. Initial treatment to reduce swelling and pain in first 48-72 hours.',
  },
  aclReconstruction: {
    id: 'aclReconstruction',
    name: 'ACL Reconstruction Surgery',
    type: 'surgical',
    description: 'Surgical replacement of torn ACL using graft from hamstring or patellar tendon. Required for athletes and active individuals.',
  },
  rehabProtocol: {
    id: 'rehabProtocol',
    name: 'Post-Surgery Rehabilitation',
    type: 'therapy',
    description: 'Structured 6-9 month program focusing on range of motion, strength, and stability. Gradual return to sports.',
  },

  // Arthritis treatments
  nsaids: {
    id: 'nsaids',
    name: 'NSAIDs',
    type: 'medication',
    description: 'Anti-inflammatory medications like ibuprofen or naproxen to reduce pain and swelling. Long-term use monitored by doctor.',
  },
  corticosteroidInjection: {
    id: 'corticosteroidInjection',
    name: 'Corticosteroid Joint Injection',
    type: 'therapy',
    description: 'Direct injection into affected joint to reduce inflammation. Provides relief for several months.',
  },
  jointReplacement: {
    id: 'jointReplacement',
    name: 'Total Joint Replacement',
    type: 'surgical',
    description: 'Replacement of damaged joint with prosthetic implant. Considered when conservative treatments are ineffective.',
  },

  // Rotator cuff treatments
  rotatorCuffRepair: {
    id: 'rotatorCuffRepair',
    name: 'Arthroscopic Rotator Cuff Repair',
    type: 'surgical',
    description: 'Minimally invasive surgery to reattach torn tendon to bone. Uses small incisions and camera guidance.',
  },
  shoulderTherapy: {
    id: 'shoulderTherapy',
    name: 'Shoulder Strengthening Therapy',
    type: 'therapy',
    description: 'Progressive exercises to strengthen rotator cuff muscles and improve shoulder stability. Essential post-surgery.',
  },

  // Frozen shoulder treatments
  hydrodilatation: {
    id: 'hydrodilatation',
    name: 'Hydrodilatation',
    type: 'therapy',
    description: 'Injection of fluid into shoulder joint to stretch capsule. Combined with physical therapy for better results.',
  },
  manipulationUnderAnesthesia: {
    id: 'manipulationUnderAnesthesia',
    name: 'Manipulation Under Anesthesia',
    type: 'surgical',
    description: 'Controlled movement of shoulder while patient is sedated to break up adhesions and restore range of motion.',
  },
};
