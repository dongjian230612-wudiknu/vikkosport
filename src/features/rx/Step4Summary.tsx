import { Link } from 'wouter';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../hooks/useCart';
import { useRxWizard } from './store';
import { estimateLensUpcharge, RX_SCENES, toRxInfo } from './types';

export function Step4Summary() {
  const { state, dispatch } = useRxWizard();
  const { addItem } = useCart();

  const scene = RX_SCENES.find(s => s.id === state.scene);
  const frame = state.selectedFrame;
  const prescription = state.prescription;
  const lensConfig = state.lensConfig;

  if (!frame || !prescription || !lensConfig) {
    return (
      <div className="text-center py-12">
        <p className="text-vikko-muted mb-4">Finish the previous steps to see your RX build.</p>
        <Button onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}>Start over</Button>
      </div>
    );
  }

  const lensUpcharge = estimateLensUpcharge(lensConfig, prescription.lensMaterial);
  const total = frame.price + lensUpcharge;
  const colorId = state.selectedColorId ?? frame.colors[0]?.id ?? '';

  const addRxToCart = () => {
    addItem(frame, colorId, {
      rxInfo: toRxInfo(prescription),
      lensUpcharge,
      lensColor: lensConfig.color,
      photochromic: lensConfig.photochromic,
      polarized: lensConfig.polarized,
      scene: state.scene ?? undefined,
      uploadName: prescription.uploadName,
    });
    dispatch({ type: 'MARK_ADDED' });
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-vikko-black mb-2">Your RX build</h2>
      <p className="text-vikko-muted mb-8">
        Review the configuration. Checkout stays manual for now — add to cart, then contact us to finish payment.
      </p>

      <div className="rounded-lg border border-vikko-border bg-vikko-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-0">
          <div className="aspect-square md:aspect-auto bg-vikko-canvas border-b md:border-b-0 md:border-r border-vikko-border">
            <img
              src={frame.images[0]?.url}
              alt={frame.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-vikko-muted mb-1">Scene</p>
              <p className="font-semibold text-vikko-black">{scene?.label}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-vikko-muted mb-1">Frame</p>
              <p className="font-semibold text-vikko-black">
                {frame.name} · RX {frame.rxType}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-vikko-muted">OD / OS sphere</p>
                <p className="text-vikko-black font-medium">
                  {prescription.sphereOd} / {prescription.sphereOs}
                </p>
              </div>
              <div>
                <p className="text-vikko-muted">PD</p>
                <p className="text-vikko-black font-medium">{prescription.pd}</p>
              </div>
              <div>
                <p className="text-vikko-muted">Lens</p>
                <p className="text-vikko-black font-medium">
                  {prescription.lensType} · {prescription.lensMaterial}
                </p>
              </div>
              <div>
                <p className="text-vikko-muted">Options</p>
                <p className="text-vikko-black font-medium">
                  {lensConfig.color}
                  {lensConfig.polarized ? ' · Polarized' : ''}
                  {lensConfig.photochromic ? ' · Photochromic' : ''}
                </p>
              </div>
            </div>

            <div className="border-t border-vikko-border pt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-vikko-muted">Frame</span>
                <span>{formatPrice(frame.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-vikko-muted">RX lens package</span>
                <span>{formatPrice(lensUpcharge)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2">
                <span>Estimated total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        {!state.addedToCart ? (
          <Button size="lg" onClick={addRxToCart}>
            Add RX build to cart
          </Button>
        ) : (
          <div className="rounded-lg border border-vikko-border bg-vikko-canvas px-4 py-3 text-sm text-vikko-black">
            Added to cart. Payment is not online yet — use Contact to complete the order.
          </div>
        )}
        <Button variant="outline" size="lg" onClick={() => dispatch({ type: 'RESET' })}>
          Start another build
        </Button>
        <Link href="/shop?type=sunglasses&rx=1">
          <Button variant="ghost" size="lg">Browse RX sunglasses</Button>
        </Link>
      </div>

      <p className="mt-6 text-sm text-vikko-muted">
        Checkout CTA stays disabled pending Stripe. For now this validates the RX flow end-to-end.
      </p>
    </div>
  );
}
