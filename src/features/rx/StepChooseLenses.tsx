import { OptionCard } from './OptionCard';
import { useRxWizard } from './store';
import { LENS_TINTS } from './types';

export function StepChooseLenses() {
  const { state, dispatch } = useRxWizard();

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-vikko-black text-center mb-8">
        Choose Your Lenses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {LENS_TINTS.map(option => (
          <OptionCard
            key={option.id}
            title={option.label}
            description={option.description}
            price={option.price}
            imageSlot={option.id}
            selected={state.lensTint === option.id}
            onClick={() => dispatch({ type: 'SET_LENS_TINT', lensTint: option.id })}
          />
        ))}
      </div>
    </div>
  );
}
