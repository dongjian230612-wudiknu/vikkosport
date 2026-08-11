import { useState } from 'react';
import { Paperclip } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useRxWizard } from './store';
import { initialRxPrescription, type RxPrescriptionDraft } from './types';
import { RxStickyBar } from './RxStickyBar';

const PD_OPTIONS = ['58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68'];

export function StepUploadPrescription() {
  const { state, dispatch } = useRxWizard();
  const [draft, setDraft] = useState<RxPrescriptionDraft>(
    state.prescription ?? initialRxPrescription
  );
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<RxPrescriptionDraft>) => {
    setDraft(prev => ({ ...prev, ...patch }));
  };

  const continueNext = () => {
    if (!draft.pd && !(draft.dualPd && draft.pdLeft && draft.pdRight)) {
      setError('Please choose your PD.');
      return;
    }
    if (!draft.ackRefund || !draft.ackPrivacy) {
      setError('Please acknowledge both statements to continue.');
      return;
    }
    setError(null);
    dispatch({ type: 'SET_PRESCRIPTION', prescription: draft });
  };

  return (
    <div className="pb-24">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-vikko-black text-center mb-3">
        Upload Prescription
      </h2>
      <p className="text-center text-sm text-vikko-muted max-w-2xl mx-auto mb-8">
        Accepted file types: PNG, JPG, PDF. Prescriptions should be less than 2 years old.
        If your prescription requires prism, contact us before ordering.
      </p>

      <div className="space-y-4 max-w-3xl mx-auto">
        <label className="flex items-center gap-3 rounded-lg border border-[#b8d4ea] px-4 py-4 cursor-pointer hover:border-vikko-accent">
          <Paperclip className="w-5 h-5 text-vikko-muted" />
          <span className="text-sm font-semibold text-vikko-accent underline">Choose File</span>
          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={e => update({ uploadName: e.target.files?.[0]?.name })}
          />
          {draft.uploadName && (
            <span className="text-sm text-vikko-muted truncate">{draft.uploadName}</span>
          )}
        </label>

        <div className="rounded-lg border border-[#b8d4ea] px-4 py-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold text-vikko-black">Pupillary Distance (PD)</label>
            {!draft.dualPd ? (
              <select
                value={draft.pd}
                onChange={e => update({ pd: e.target.value })}
                className="rounded-md border border-vikko-border px-3 py-2 text-sm bg-vikko-white"
              >
                <option value="">Choose</option>
                {PD_OPTIONS.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            ) : (
              <div className="flex gap-2">
                <select
                  value={draft.pdRight ?? ''}
                  onChange={e => update({ pdRight: e.target.value, pd: e.target.value })}
                  className="rounded-md border border-vikko-border px-3 py-2 text-sm"
                >
                  <option value="">Right</option>
                  {PD_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
                <select
                  value={draft.pdLeft ?? ''}
                  onChange={e => update({ pdLeft: e.target.value })}
                  className="rounded-md border border-vikko-border px-3 py-2 text-sm"
                >
                  <option value="">Left</option>
                  {PD_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            )}
            <label className="flex items-center gap-2 text-sm text-vikko-ink cursor-pointer">
              <input
                type="checkbox"
                checked={draft.dualPd}
                onChange={e => update({ dualPd: e.target.checked })}
              />
              Have two PDs
            </label>
            <a href="/shipping" className="text-sm text-vikko-accent underline">Find your PD</a>
          </div>
          <p className="text-xs text-vikko-muted leading-relaxed">
            Your PD is the distance between your pupils. We need this to center the optical zone of
            your lenses. If you do not know your PD, ask your optometrist or measure at home.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ['sphereOd', 'Sphere OD'],
              ['sphereOs', 'Sphere OS'],
              ['cylinderOd', 'Cylinder OD'],
              ['cylinderOs', 'Cylinder OS'],
              ['axisOd', 'Axis OD'],
              ['axisOs', 'Axis OS'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm rounded-lg border border-[#b8d4ea] px-3 py-2">
              <span className="text-vikko-muted">{label}</span>
              <input
                value={draft[key]}
                onChange={e => update({ [key]: e.target.value })}
                className="mt-1 w-full bg-transparent outline-none text-vikko-black"
                placeholder="-1.25"
              />
            </label>
          ))}
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-[#b8d4ea] px-4 py-4 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1"
            checked={draft.ackRefund}
            onChange={e => update({ ackRefund: e.target.checked })}
          />
          <span className="text-sm text-vikko-ink">
            I acknowledge that prescription eyewear is non-refundable unless the prescription is filled incorrectly.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-lg border border-[#b8d4ea] px-4 py-4 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1"
            checked={draft.ackPrivacy}
            onChange={e => update({ ackPrivacy: e.target.checked })}
          />
          <span className="text-sm text-vikko-ink">
            I acknowledge that by uploading my prescription information, Vikko Sport may process and
            transmit my prescription in accordance with the{' '}
            <a href="/contact" className="text-vikko-accent underline">privacy policy</a>.
          </span>
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button className="w-full sm:hidden" size="lg" onClick={continueNext}>
          Save and Continue
        </Button>
      </div>

      <RxStickyBar ctaLabel="Save and Continue" onCta={continueNext} />
    </div>
  );
}
