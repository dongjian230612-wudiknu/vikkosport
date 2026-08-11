import { OptionCard } from './OptionCard';
import { useRxWizard } from './store';
import { LENS_COATINGS } from './types';

export function StepLensCoating() {
  const { state, dispatch } = useRxWizard();

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-vikko-black text-center mb-2">
        Lens Coating
      </h2>
      <div className="mx-auto mb-8 h-px max-w-md bg-vikko-border" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {LENS_COATINGS.map(option => (
          <OptionCard
            key={option.id}
            title={option.label}
            description={option.description}
            price={option.price}
            selected={state.coating === option.id}
            onClick={() => dispatch({ type: 'SET_COATING', coating: option.id })}
          />
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          type="button"
          className="text-sm font-semibold text-vikko-black underline underline-offset-4 cursor-pointer"
          onClick={() => dispatch({ type: 'SET_COATING', coating: 'none' })}
        >
          No Coating
        </button>
      </div>
    </div>
  );
}
