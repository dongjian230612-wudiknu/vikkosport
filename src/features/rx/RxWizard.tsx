import { Link } from 'wouter';
import { Button } from '../../components/ui/Button';
import { RxProgress } from './RxProgress';
import { useRxWizard } from './store';
import { StepPrescriptionType } from './StepPrescriptionType';
import { StepLensGroup } from './StepLensGroup';
import { StepChooseLenses } from './StepChooseLenses';
import { StepLensCoating } from './StepLensCoating';
import { StepUploadPrescription } from './StepUploadPrescription';
import { StepSummary } from './StepSummary';

export function RxWizard() {
  const { state } = useRxWizard();
  const frame = state.selectedFrame;

  if (!frame) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-vikko-black mb-3">Select Lenses</h1>
        <p className="text-vikko-muted mb-8 max-w-lg mx-auto">
          Start from a product page and click <strong>Select Lenses and Purchase</strong> so we can
          configure lenses for that frame.
        </p>
        <Link href="/shop?type=sunglasses&rx=1">
          <Button size="lg">Browse RX frames</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vikko-muted mb-2">
          Select Lenses
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-vikko-black mb-3">
          Configure lenses for {frame.name}
        </h1>
        <p className="text-vikko-muted max-w-2xl mx-auto">
          Frame is already selected. Choose prescription type, lens group, tint, coating, then upload your Rx.
        </p>
      </div>

      <RxProgress current={state.step} />

      {state.step === 1 && <StepPrescriptionType />}
      {state.step === 2 && <StepLensGroup />}
      {state.step === 3 && <StepChooseLenses />}
      {state.step === 4 && <StepLensCoating />}
      {state.step === 5 && <StepUploadPrescription />}
      {state.step === 6 && <StepSummary />}
    </div>
  );
}
