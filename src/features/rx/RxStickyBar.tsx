import { formatPrice } from '../../lib/utils';
import { useRxWizard } from './store';
import { calcRunningTotal } from './types';

export function RxStickyBar({ ctaLabel, onCta, disabled }: {
  ctaLabel: string;
  onCta?: () => void;
  disabled?: boolean;
}) {
  const { state } = useRxWizard();
  const frame = state.selectedFrame;
  if (!frame) return null;

  return (
    <div className="sticky bottom-0 z-20 border-t border-vikko-border bg-vikko-white/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 rounded bg-vikko-canvas border border-vikko-border overflow-hidden flex-shrink-0">
            <img src={frame.images[0]?.url} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-vikko-black truncate">{frame.name}</p>
            <p className="text-sm text-vikko-accent font-bold">{formatPrice(calcRunningTotal(state))}</p>
          </div>
        </div>
        {onCta && (
          <button
            type="button"
            disabled={disabled}
            onClick={onCta}
            className="flex-shrink-0 rounded-md bg-vikko-black px-5 py-3 text-sm font-bold uppercase tracking-wide text-vikko-white disabled:opacity-40 cursor-pointer"
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}
