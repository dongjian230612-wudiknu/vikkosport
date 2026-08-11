import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../lib/utils';
import { getRxCompatibleProducts } from '../../data/products';
import { cn } from '../../lib/utils';
import { useRxWizard } from './store';
import { RX_SCENES } from './types';

export function Step2Frame() {
  const { state, dispatch } = useRxWizard();
  const scene = RX_SCENES.find(s => s.id === state.scene);

  const frames = getRxCompatibleProducts().filter(product => {
    if (!scene) return true;
    if (state.scene === 'daily') return product.category === 'eyeglasses' || product.rxCompatible;
    return scene.tags.some(tag => product.tags.includes(tag));
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h2 className="font-display text-2xl font-bold text-vikko-black">Choose an RX-ready frame</h2>
        <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}>
          Change scene
        </Button>
      </div>
      <p className="text-vikko-muted mb-8">
        Showing frames compatible with {scene?.label ?? 'your scene'}.
      </p>

      {frames.length === 0 ? (
        <div className="rounded-lg border border-vikko-border bg-vikko-canvas p-8 text-center">
          <p className="text-vikko-muted mb-4">No RX frames matched this scene yet.</p>
          <Button variant="outline" onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}>
            Pick another scene
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {frames.map(frame => {
            const selected = state.selectedFrame?.id === frame.id;
            const colorId = frame.colors[0]?.id ?? '';
            return (
              <button
                key={frame.id}
                type="button"
                onClick={() => dispatch({ type: 'SET_FRAME', frame, colorId })}
                className={cn(
                  'text-left rounded-lg border overflow-hidden transition-colors cursor-pointer',
                  selected ? 'border-vikko-black' : 'border-vikko-border hover:border-vikko-black'
                )}
              >
                <div className="aspect-[4/3] bg-vikko-canvas border-b border-vikko-border">
                  <img
                    src={frame.images[0]?.url}
                    alt={frame.images[0]?.alt || frame.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display font-semibold text-vikko-black">{frame.name}</h3>
                      <p className="text-xs text-vikko-muted mt-1 uppercase tracking-wide">
                        RX {frame.rxType ?? 'ready'} · {frame.category}
                      </p>
                    </div>
                    <span className="font-bold text-vikko-black">{formatPrice(frame.price)}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
