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
    case 'PRESELECT_FRAME':
      return {
        ...state,
        selectedFrame: action.frame,
        selectedColorId: action.colorId,
        frameLocked: true,
        step: 1,
        prescriptionType: null,
        lensGroup: null,
        lensTint: null,
        coating: 'none',
        prescription: null,
      };
    case 'SET_PRESCRIPTION_TYPE':
      return { ...state, prescriptionType: action.prescriptionType, step: 2 };
    case 'SET_LENS_GROUP':
      return { ...state, lensGroup: action.lensGroup, step: 3 };
    case 'SET_LENS_TINT':
      return { ...state, lensTint: action.lensTint, step: 4 };
    case 'SET_COATING':
      return { ...state, coating: action.coating, step: 5 };
    case 'SET_PRESCRIPTION':
      return { ...state, prescription: action.prescription, step: 6 };
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
