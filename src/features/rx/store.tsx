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

function rxReducer(state: RxWizardState, action: RxWizardAction): RxWizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SET_SCENE':
      return {
        ...state,
        scene: action.scene,
        selectedFrame: null,
        selectedColorId: null,
        step: 2,
      };
    case 'SET_FRAME':
      return {
        ...state,
        selectedFrame: action.frame,
        selectedColorId: action.colorId,
        lensConfig: {
          color: action.frame.lensOptions?.colors[0] ?? 'Clear',
          photochromic: action.frame.lensOptions?.photochromic ?? false,
          polarized: action.frame.lensOptions?.polarized ?? false,
        },
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
