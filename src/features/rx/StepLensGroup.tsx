import { OptionCard } from './OptionCard';
import { useRxWizard } from './store';
import { LENS_GROUPS } from './types';

export function StepLensGroup() {
  const { state, dispatch } = useRxWizard();

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-vikko-black text-center mb-2">
        Choose Lens Group
      </h2>
      <p className="text-center text-vikko-muted mb-8">All Lenses Are Polycarbonate</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {LENS_GROUPS.map(option => (
          <OptionCard
            key={option.id}
            title={option.label}
            description={option.description}
            price={option.price}
            imageSlot={option.id}
            selected={state.lensGroup === option.id}
            onClick={() => dispatch({ type: 'SET_LENS_GROUP', lensGroup: option.id })}
          />
        ))}
      </div>
    </div>
  );
}
