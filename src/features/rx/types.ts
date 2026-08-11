import type { Product, RxInfo } from '../../types/product';

/** Select Lenses flow (from PDP) — Tifosi-style steps. */
export type LensStep = 1 | 2 | 3 | 4 | 5 | 6;

export type PrescriptionType = 'single-vision' | 'progressive';

export type LensGroupId = 'standard' | 'polarized' | 'fototec';

export type LensTintId = 'clear' | 'tinted';

export type LensCoatingId =
  | 'none'
  | 'antifog'
  | 'antireflective'
  | 'antifog-ar'
  | 'bluelight';

export interface LensOptionCard<T extends string> {
  id: T;
  label: string;
  description: string;
  price: number;
}

export const PRESCRIPTION_TYPES: LensOptionCard<PrescriptionType>[] = [
  {
    id: 'single-vision',
    label: 'Single Vision',
    description:
      'Single-vision lenses offer one correction value throughout the entire lens, typically for distance or close-up.',
    price: 0,
  },
  {
    id: 'progressive',
    label: 'Progressive',
    description:
      'Progressive lenses offer multiple correction values in one lens, so you can have distance and close-up values in one pair.',
    price: 80,
  },
];

export const LENS_GROUPS: LensOptionCard<LensGroupId>[] = [
  {
    id: 'standard',
    label: 'Standard',
    description: 'Clear or tinted classic lens',
    price: 0,
  },
  {
    id: 'polarized',
    label: 'Polarized',
    description: 'Polarizes light to reduce glare, especially from reflective surfaces.',
    price: 50,
  },
  {
    id: 'fototec',
    label: 'Fototec',
    description: 'Tint darkens in sunlight',
    price: 60,
  },
];

export const LENS_TINTS: LensOptionCard<LensTintId>[] = [
  {
    id: 'clear',
    label: 'Clear',
    description: 'Clear polycarbonate lens',
    price: 0,
  },
  {
    id: 'tinted',
    label: 'Tinted',
    description: 'Polycarbonate lens with smoke or brown tint options',
    price: 30,
  },
];

export const LENS_COATINGS: LensOptionCard<LensCoatingId>[] = [
  {
    id: 'antifog',
    label: 'RX Antifog Coating',
    description:
      'Coating that lessens fog due to the temperature difference between your eye and surroundings.',
    price: 50,
  },
  {
    id: 'antireflective',
    label: 'RX Antireflective coating',
    description: 'Coating that mitigates reflections on the back surface of the lens.',
    price: 50,
  },
  {
    id: 'antifog-ar',
    label: 'Antifog & Antireflective Coating',
    description:
      'Coating that mitigates reflections on the back surface of the lens and lessens fog.',
    price: 75,
  },
  {
    id: 'bluelight',
    label: 'RX Bluelight Coating',
    description:
      'Coating that blocks the blue light from screens and digital devices that may cause eye strain.',
    price: 50,
  },
];

export interface RxPrescriptionDraft {
  sphereOd: string;
  sphereOs: string;
  cylinderOd: string;
  cylinderOs: string;
  axisOd: string;
  axisOs: string;
  pd: string;
  pdRight?: string;
  pdLeft?: string;
  dualPd: boolean;
  uploadName?: string;
  ackRefund: boolean;
  ackPrivacy: boolean;
}

export interface RxWizardState {
  step: LensStep;
  selectedFrame: Product | null;
  selectedColorId: string | null;
  frameLocked: boolean;
  prescriptionType: PrescriptionType | null;
  lensGroup: LensGroupId | null;
  lensTint: LensTintId | null;
  coating: LensCoatingId;
  prescription: RxPrescriptionDraft | null;
  addedToCart: boolean;
}

export type RxWizardAction =
  | { type: 'SET_STEP'; step: LensStep }
  | { type: 'PRESELECT_FRAME'; frame: Product; colorId: string }
  | { type: 'SET_PRESCRIPTION_TYPE'; prescriptionType: PrescriptionType }
  | { type: 'SET_LENS_GROUP'; lensGroup: LensGroupId }
  | { type: 'SET_LENS_TINT'; lensTint: LensTintId }
  | { type: 'SET_COATING'; coating: LensCoatingId }
  | { type: 'SET_PRESCRIPTION'; prescription: RxPrescriptionDraft }
  | { type: 'MARK_ADDED' }
  | { type: 'RESET' };

export const initialRxPrescription: RxPrescriptionDraft = {
  sphereOd: '',
  sphereOs: '',
  cylinderOd: '',
  cylinderOs: '',
  axisOd: '',
  axisOs: '',
  pd: '',
  dualPd: false,
  ackRefund: false,
  ackPrivacy: false,
};

export const initialRxState: RxWizardState = {
  step: 1,
  selectedFrame: null,
  selectedColorId: null,
  frameLocked: false,
  prescriptionType: null,
  lensGroup: null,
  lensTint: null,
  coating: 'none',
  prescription: null,
  addedToCart: false,
};

export const LENS_STEPS: { step: LensStep; label: string }[] = [
  { step: 1, label: 'Rx Type' },
  { step: 2, label: 'Group' },
  { step: 3, label: 'Lenses' },
  { step: 4, label: 'Coating' },
  { step: 5, label: 'Upload' },
  { step: 6, label: 'Summary' },
];

export function calcLensUpcharge(state: RxWizardState): number {
  const typePrice = PRESCRIPTION_TYPES.find(t => t.id === state.prescriptionType)?.price ?? 0;
  const groupPrice = LENS_GROUPS.find(g => g.id === state.lensGroup)?.price ?? 0;
  const tintPrice = LENS_TINTS.find(t => t.id === state.lensTint)?.price ?? 0;
  const coatingPrice =
    state.coating === 'none'
      ? 0
      : (LENS_COATINGS.find(c => c.id === state.coating)?.price ?? 0);
  return typePrice + groupPrice + tintPrice + coatingPrice;
}

export function calcRunningTotal(state: RxWizardState): number {
  const framePrice = state.selectedFrame?.price ?? 0;
  return framePrice + calcLensUpcharge(state);
}

export function toRxInfo(draft: RxPrescriptionDraft, type: PrescriptionType): RxInfo {
  return {
    sphereOd: Number(draft.sphereOd) || 0,
    sphereOs: Number(draft.sphereOs) || 0,
    cylinderOd: draft.cylinderOd ? Number(draft.cylinderOd) : undefined,
    cylinderOs: draft.cylinderOs ? Number(draft.cylinderOs) : undefined,
    axisOd: draft.axisOd ? Number(draft.axisOd) : undefined,
    axisOs: draft.axisOs ? Number(draft.axisOs) : undefined,
    pd: Number(draft.pd) || 0,
    lensType: type,
    lensMaterial: 'polycarbonate',
  };
}
