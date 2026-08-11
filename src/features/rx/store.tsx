import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import {
  initialRxState,
  type RxWizardAction,
  type RxWizardState,
} from './types';

function lensDefaults(frame: NonNullable<RxWizardState['selectedFrame']>) {
  return {
    color: frame.lensOptions?.colors[0] ?? 'Clear',
    photochromic: frame.lensOptions?.photochromic ?? false,
    polarized: frame.lensOptions?.polarized ?? false,
  };
}

function rxReducer(state: RxWizardState, action: RxWizardAction): RxWizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SET_SCENE':
      // If frame already chosen (from PDP), keep it and jump to prescription.
      if (state.frameLocked && state.selectedFrame) {
        return {
          ...state,
          scene: action.scene,
          step: 3,
        };
      }
      return {
        ...state,
        scene: action.scene,
        selectedFrame: null,
        selectedColorId: null,
        frameLocked: false,
        step: 2,
      };
    case 'SET_FRAME':
      return {
        ...state,
        selectedFrame: action.frame,
        selectedColorId: action.colorId,
        frameLocked: false,
        lensConfig: lensDefaults(action.frame),
        step: 3,
      };
    case 'PRESELECT_FRAME':
      return {
        ...state,
        selectedFrame: action.frame,
        selectedColorId: action.colorId,
        frameLocked: true,
        scene: action.scene ?? state.scene,
        lensConfig: lensDefaults(action.frame),
        // Skip scene + frame re-pick; go straight to prescription.
        step: 3,
      };
    case 'SET_PRESCRIPTION':
      return { ...state, prescription: action.prescription };
    case 'SET_LENS_CONFIG':
      return { ...state, lensConfig: action.lensConfig };
    case 'MARK_ADDED':
      return { ...state, addedToCart: true, step: 4 };
    case 'RESET':
      return initialRxState;
    default:
      return state;
  }
}

interface RxWizardContextValue {
  state: RxWizardState;
  dispatch: Dispatch<RxWizardAction>;
}

const RxWizardContext = createContext<RxWizardContextValue | null>(null);

export function RxWizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(rxReducer, initialRxState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <RxWizardContext.Provider value={value}>{children}</RxWizardContext.Provider>;
}

export function useRxWizard() {
  const ctx = useContext(RxWizardContext);
  if (!ctx) throw new Error('useRxWizard must be used within RxWizardProvider');
  return ctx;
}
