import { RxProgress } from './RxProgress';
import { useRxWizard } from './store';
import { Step1Scene } from './Step1Scene';
import { Step2Frame } from './Step2Frame';
import { Step3Prescription } from './Step3Prescription';
import { Step4Summary } from './Step4Summary';

export function RxWizard() {
  const { state } = useRxWizard();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vikko-muted mb-2">
          RX Sports
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-vikko-black mb-3">
          Configure prescription lenses
        </h1>
        <p className="text-vikko-muted max-w-2xl">
          Choose your scene, pick an RX-ready frame, enter your prescription, then review the build.
        </p>
      </div>

      <RxProgress current={state.step} />

      {state.step === 1 && <Step1Scene />}
      {state.step === 2 && <Step2Frame />}
      {state.step === 3 && <Step3Prescription />}
      {state.step === 4 && <Step4Summary />}
    </div>
  );
}
