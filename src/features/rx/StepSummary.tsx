import { Link } from 'wouter';
import { Button } from '../../components/ui/Button';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../hooks/useCart';
import { useRxWizard } from './store';
import {
  LENS_COATINGS,
  LENS_GROUPS,
  LENS_TINTS,
  PRESCRIPTION_TYPES,
  calcLensUpcharge,
  calcRunningTotal,
  toRxInfo,
} from './types';

export function StepSummary() {
  const { state, dispatch } = useRxWizard();
  const { addItem } = useCart();

  const frame = state.selectedFrame;
  const prescription = state.prescription;

  if (!frame || !state.prescriptionType || !state.lensGroup || !state.lensTint || !prescription) {
    return (
      <div className="text-center py-12">
        <p className="text-vikko-muted mb-4">Complete the previous lens steps first.</p>
        <Button onClick={() => dispatch({ type: 'SET_STEP', step: 1 })}>Start Select Lenses</Button>
      </div>
    );
  }

  const lensUpcharge = calcLensUpcharge(state);
  const total = calcRunningTotal(state);
  const colorId = state.selectedColorId ?? frame.colors[0]?.id ?? '';
  const typeLabel = PRESCRIPTION_TYPES.find(t => t.id === state.prescriptionType)?.label;
  const groupLabel = LENS_GROUPS.find(g => g.id === state.lensGroup)?.label;
  const tintLabel = LENS_TINTS.find(t => t.id === state.lensTint)?.label;
  const coatingLabel =
    state.coating === 'none'
      ? 'No coating'
      : LENS_COATINGS.find(c => c.id === state.coating)?.label;

  const addRxToCart = () => {
    addItem(frame, colorId, {
      rxInfo: toRxInfo(prescription, state.prescriptionType!),
      lensUpcharge,
      lensColor: tintLabel,
      photochromic: state.lensGroup === 'fototec',
      polarized: state.lensGroup === 'polarized',
      uploadName: prescription.uploadName,
    });
    dispatch({ type: 'MARK_ADDED' });
  };

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-vikko-black text-center mb-8">
        Review Your Lenses
      </h2>

      <div className="rounded-lg border border-vikko-border bg-vikko-white overflow-hidden max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[160px_1fr]">
          <div className="aspect-square bg-vikko-canvas border-b md:border-b-0 md:border-r border-vikko-border">
            <img src={frame.images[0]?.url} alt={frame.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 space-y-3 text-sm">
            <p className="font-display text-lg font-bold text-vikko-black">{frame.name}</p>
            <p>
              <span className="text-vikko-muted">Prescription:</span> {typeLabel}
            </p>
            <p>
              <span className="text-vikko-muted">Lens group:</span> {groupLabel}
            </p>
            <p>
              <span className="text-vikko-muted">Lenses:</span> {tintLabel}
            </p>
            <p>
              <span className="text-vikko-muted">Coating:</span> {coatingLabel}
            </p>
            <p>
              <span className="text-vikko-muted">PD:</span>{' '}
              {prescription.pd || `${prescription.pdRight}/${prescription.pdLeft}`}
            </p>
            {prescription.uploadName && (
              <p>
                <span className="text-vikko-muted">Rx file:</span> {prescription.uploadName}
              </p>
            )}
            <div className="border-t border-vikko-border pt-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-vikko-muted">Frame</span>
                <span>{formatPrice(frame.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-vikko-muted">Lenses & options</span>
                <span>{formatPrice(lensUpcharge)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        {!state.addedToCart ? (
          <Button size="lg" onClick={addRxToCart}>
            Add to cart
          </Button>
        ) : (
          <Link href="/cart">
            <Button size="lg">View cart</Button>
          </Link>
        )}
        <Button variant="outline" size="lg" onClick={() => dispatch({ type: 'SET_STEP', step: 5 })}>
          Back
        </Button>
      </div>
    </div>
  );
}
