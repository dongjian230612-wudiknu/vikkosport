import { RxProgress } from './RxProgress';
import { useRxWizard } from './store';
import { Step1Scene } from './Step1Scene';
import { Step2Frame } from './Step2Frame';
import { Step3Prescription } from './Step3Prescription';
import { Step4Summary } from './Step4Summary';

export function RxWizard() {
  const { state, dispatch } = useRxWizard();
  const lockedFrame = state.frameLocked && state.selectedFrame;

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
          {lockedFrame
            ? `Continuing with ${lockedFrame.name} — enter your prescription next. No need to pick the frame again.`
            : 'Choose your scene, pick an RX-ready frame, enter your prescription, then review the build.'}
        </p>
      </div>

      {lockedFrame && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-vikko-border bg-vikko-canvas px-4 py-3">
          <p className="text-sm text-vikko-black">
            <span className="font-semibold">Selected frame:</span> {lockedFrame.name}
            {state.scene ? ` · ${state.scene.replace(/-/g, ' ')}` : ''}
          </p>
          <button
            type="button"
            className="text-sm font-semibold text-vikko-accent hover:underline cursor-pointer"
            onClick={() => dispatch({ type: 'SET_STEP', step: 2 })}
          >
            Change frame
          </button>
        </div>
      )}

      <RxProgress current={state.step} />

      {state.step === 1 && <Step1Scene />}
      {state.step === 2 && <Step2Frame />}
      {state.step === 3 && <Step3Prescription />}
      {state.step === 4 && <Step4Summary />}
    </div>
  );
}
