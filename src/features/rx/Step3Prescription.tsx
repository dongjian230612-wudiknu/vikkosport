import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { useRxWizard } from './store';
import {
  initialRxPrescription,
  type RxLensConfig,
  type RxPrescriptionDraft,
} from './types';
import type { RxInfo } from '../../types/product';

const LENS_TYPES: RxInfo['lensType'][] = ['single-vision', 'progressive', 'bifocal'];
const MATERIALS: RxInfo['lensMaterial'][] = ['polycarbonate', 'trivex', 'high-index'];

export function Step3Prescription() {
  const { state, dispatch } = useRxWizard();
  const [draft, setDraft] = useState<RxPrescriptionDraft>(
    state.prescription ?? initialRxPrescription
  );
  const [lensConfig, setLensConfig] = useState<RxLensConfig>(
    state.lensConfig ?? {
      color: state.selectedFrame?.lensOptions?.colors[0] ?? 'Clear',
      photochromic: false,
      polarized: false,
    }
  );
  const [error, setError] = useState<string | null>(null);

  const colorOptions = state.selectedFrame?.lensOptions?.colors ?? ['Clear', 'Smoke'];

  const updateDraft = (patch: Partial<RxPrescriptionDraft>) => {
    setDraft(prev => ({ ...prev, ...patch }));
  };

  const onUpload = (file: File | undefined) => {
    if (!file) return;
    updateDraft({ uploadName: file.name });
  };

  const continueToSummary = () => {
    if (!draft.sphereOd || !draft.sphereOs || !draft.pd) {
      setError('Sphere (OD/OS) and PD are required.');
      return;
    }
    setError(null);
    dispatch({ type: 'SET_PRESCRIPTION', prescription: draft });
    dispatch({ type: 'SET_LENS_CONFIG', lensConfig });
    dispatch({ type: 'SET_STEP', step: 4 });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h2 className="font-display text-2xl font-bold text-vikko-black">Prescription & lenses</h2>
        <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'SET_STEP', step: state.frameLocked ? 1 : 2 })}>
          {state.frameLocked ? 'Adjust scene' : 'Change frame'}
        </Button>
      </div>
      <p className="text-vikko-muted mb-8">
        Enter values from your Rx, or upload a photo of the prescription. Payment stays offline for now.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="rounded-lg border border-vikko-border bg-vikko-white p-5 space-y-4">
          <h3 className="font-display font-semibold text-vikko-black">Prescription</h3>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ['sphereOd', 'Sphere OD'],
                ['sphereOs', 'Sphere OS'],
                ['cylinderOd', 'Cylinder OD'],
                ['cylinderOs', 'Cylinder OS'],
                ['axisOd', 'Axis OD'],
                ['axisOs', 'Axis OS'],
                ['pd', 'PD'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="text-vikko-muted">{label}</span>
                <input
                  value={draft[key]}
                  onChange={e => updateDraft({ [key]: e.target.value })}
                  className="mt-1 w-full rounded-md border border-vikko-border px-3 py-2 text-vikko-black bg-vikko-white focus:outline-none focus:ring-2 focus:ring-vikko-black/20"
                  placeholder={key === 'pd' ? 'e.g. 63' : '-1.25'}
                />
              </label>
            ))}
          </div>

          <label className="block text-sm">
            <span className="text-vikko-muted">Lens type</span>
            <select
              value={draft.lensType}
              onChange={e => updateDraft({ lensType: e.target.value as RxInfo['lensType'] })}
              className="mt-1 w-full rounded-md border border-vikko-border px-3 py-2 bg-vikko-white"
            >
              {LENS_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-vikko-muted">Lens material</span>
            <select
              value={draft.lensMaterial}
              onChange={e => updateDraft({ lensMaterial: e.target.value as RxInfo['lensMaterial'] })}
              className="mt-1 w-full rounded-md border border-vikko-border px-3 py-2 bg-vikko-white"
            >
              {MATERIALS.map(material => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-vikko-muted">Upload Rx photo (optional)</span>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={e => onUpload(e.target.files?.[0])}
              className="mt-1 block w-full text-sm text-vikko-muted"
            />
            {draft.uploadName && (
              <span className="mt-1 inline-block text-xs text-vikko-accent">{draft.uploadName}</span>
            )}
          </label>
        </section>

        <section className="rounded-lg border border-vikko-border bg-vikko-white p-5 space-y-4">
          <h3 className="font-display font-semibold text-vikko-black">Lens options</h3>
          <div>
            <p className="text-sm text-vikko-muted mb-2">Tint / color</p>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setLensConfig(prev => ({ ...prev, color }))}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-md border cursor-pointer',
                    lensConfig.color === color
                      ? 'border-vikko-black bg-vikko-black text-vikko-white'
                      : 'border-vikko-border text-vikko-ink'
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-vikko-ink cursor-pointer">
            <input
              type="checkbox"
              checked={lensConfig.polarized}
              onChange={e => setLensConfig(prev => ({ ...prev, polarized: e.target.checked }))}
              className="size-4"
            />
            Polarized (+$35)
          </label>
          <label className="flex items-center gap-3 text-sm text-vikko-ink cursor-pointer">
            <input
              type="checkbox"
              checked={lensConfig.photochromic}
              onChange={e => setLensConfig(prev => ({ ...prev, photochromic: e.target.checked }))}
              className="size-4"
            />
            Photochromic (+$45)
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button size="lg" className="w-full" onClick={continueToSummary}>
            Review summary
          </Button>
        </section>
      </div>
    </div>
  );
}
