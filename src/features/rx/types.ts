import type { Product, RxInfo } from '../../types/product';

export type RxStep = 1 | 2 | 3 | 4;

export type RxSceneId =
  | 'road-cycling'
  | 'gravel-cycling'
  | 'mountain-bike'
  | 'trail-running'
  | 'running'
  | 'daily';

export interface RxScene {
  id: RxSceneId;
  label: string;
  description: string;
  tags: string[];
}

export interface RxPrescriptionDraft {
  sphereOd: string;
  sphereOs: string;
  cylinderOd: string;
  cylinderOs: string;
  axisOd: string;
  axisOs: string;
  pd: string;
  lensType: RxInfo['lensType'];
  lensMaterial: RxInfo['lensMaterial'];
  uploadName?: string;
}

export interface RxLensConfig {
  color: string;
  photochromic: boolean;
  polarized: boolean;
}

export interface RxWizardState {
  step: RxStep;
  scene: RxSceneId | null;
  selectedFrame: Product | null;
  selectedColorId: string | null;
  prescription: RxPrescriptionDraft | null;
  lensConfig: RxLensConfig | null;
  addedToCart: boolean;
}

export type RxWizardAction =
  | { type: 'SET_STEP'; step: RxStep }
  | { type: 'SET_SCENE'; scene: RxSceneId }
  | { type: 'SET_FRAME'; frame: Product; colorId: string }
  | { type: 'SET_PRESCRIPTION'; prescription: RxPrescriptionDraft }
  | { type: 'SET_LENS_CONFIG'; lensConfig: RxLensConfig }
  | { type: 'MARK_ADDED' }
  | { type: 'RESET' };

export const RX_SCENES: RxScene[] = [
  {
    id: 'road-cycling',
    label: 'Road Cycling',
    description: 'High speed, long miles, interchangeable tints.',
    tags: ['road-cycling', 'cycling'],
  },
  {
    id: 'gravel-cycling',
    label: 'Gravel Cycling',
    description: 'Mixed terrain with dust and variable light.',
    tags: ['gravel-cycling', 'cycling'],
  },
  {
    id: 'mountain-bike',
    label: 'Mountain Bike',
    description: 'Impact protection and strong ventilation.',
    tags: ['mountain-bike'],
  },
  {
    id: 'trail-running',
    label: 'Trail Running',
    description: 'Secure fit for technical trails and climbs.',
    tags: ['trail-running', 'running'],
  },
  {
    id: 'running',
    label: 'Running',
    description: 'Lightweight coverage for road and track.',
    tags: ['running'],
  },
  {
    id: 'daily',
    label: 'Daily / Training',
    description: 'Clear Rx frames for gym and everyday wear.',
    tags: ['cycling', 'running'],
  },
];

export const initialRxPrescription: RxPrescriptionDraft = {
  sphereOd: '',
  sphereOs: '',
  cylinderOd: '',
  cylinderOs: '',
  axisOd: '',
  axisOs: '',
  pd: '',
  lensType: 'single-vision',
  lensMaterial: 'polycarbonate',
};

export const initialRxState: RxWizardState = {
  step: 1,
  scene: null,
  selectedFrame: null,
  selectedColorId: null,
  prescription: null,
  lensConfig: null,
  addedToCart: false,
};

export function estimateLensUpcharge(config: RxLensConfig | null, material: RxInfo['lensMaterial']): number {
  let upcharge = 79;
  if (material === 'trivex') upcharge += 40;
  if (material === 'high-index') upcharge += 70;
  if (config?.polarized) upcharge += 35;
  if (config?.photochromic) upcharge += 45;
  return upcharge;
}

export function toRxInfo(draft: RxPrescriptionDraft): RxInfo {
  return {
    sphereOd: Number(draft.sphereOd) || 0,
    sphereOs: Number(draft.sphereOs) || 0,
    cylinderOd: draft.cylinderOd ? Number(draft.cylinderOd) : undefined,
    cylinderOs: draft.cylinderOs ? Number(draft.cylinderOs) : undefined,
    axisOd: draft.axisOd ? Number(draft.axisOd) : undefined,
    axisOs: draft.axisOs ? Number(draft.axisOs) : undefined,
    pd: Number(draft.pd) || 0,
    lensType: draft.lensType,
    lensMaterial: draft.lensMaterial,
  };
}
