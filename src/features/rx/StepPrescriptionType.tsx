import { OptionCard } from './OptionCard';
import { useRxWizard } from './store';
import { PRESCRIPTION_TYPES } from './types';

export function StepPrescriptionType() {
  const { state, dispatch } = useRxWizard();

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-vikko-black text-center mb-8">
        Choose Your Prescription Type
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {PRESCRIPTION_TYPES.map(option => (
          <OptionCard
            key={option.id}
            title={option.label}
            description={option.description}
            price={option.price}
            selected={state.prescriptionType === option.id}
            onClick={() => dispatch({ type: 'SET_PRESCRIPTION_TYPE', prescriptionType: option.id })}
          />
        ))}
      </div>
    </div>
  );
}
