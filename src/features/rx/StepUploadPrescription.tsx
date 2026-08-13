import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Paperclip } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useRxWizard } from './store';
import { initialRxPrescription, type RxPrescriptionDraft } from './types';
import { RxStickyBar } from './RxStickyBar';
import { cn } from '../../lib/utils';

const PD_OPTIONS = ['58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68'];

/** Format diopter for display: +1.25 / 0.00 / -1.25 */
function formatDiopter(n: number): string {
  if (Object.is(n, -0) || n === 0) return '0.00';
  const fixed = n.toFixed(2);
  return n > 0 ? `+${fixed}` : fixed;
}

function rangeDiopters(min: number, max: number, step = 0.25): string[] {
  const out: string[] = [];
  for (let v = min; v <= max + 1e-9; v = Math.round((v + step) * 100) / 100) {
    out.push(formatDiopter(v));
  }
  return out;
}

/** SPH natural order: −10.00 … 0.00 … +10.00 — open centered on 0 */
const SPH_OPTIONS = rangeDiopters(-10, 10);
/** CYL: 0.00 at mid-top of negatives… use 0 → −6 for picker; center on 0 */
const CYL_OPTIONS = rangeDiopters(-6, 0).reverse();
/** AXIS: 1 … 180 */
const AXIS_OPTIONS = Array.from({ length: 180 }, (_, i) => String(i + 1));

const fieldClass =
  'w-full rounded-md border border-vikko-border bg-vikko-white px-2 py-2.5 text-sm text-vikko-black outline-none focus:border-vikko-accent';

const triggerClass =
  'flex w-full items-center justify-between gap-1 rounded-md border border-vikko-border bg-vikko-white px-2 py-2.5 text-center text-sm text-vikko-black outline-none hover:border-vikko-muted focus:border-vikko-accent';

function RxScrollSelect({
  label,
  value,
  options,
  placeholder = 'Select',
  centerOn = '0.00',
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  placeholder?: string;
  /** Value to scroll into view when opening (fig.1: SPH opens at 0.00 mid-list) */
  centerOn?: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const targetValue = value || centerOn;
    const el = listRef.current.querySelector<HTMLElement>(`[data-value="${CSS.escape(targetValue)}"]`);
    if (el) {
      el.scrollIntoView({ block: 'center' });
    }
  }, [open, value, centerOn]);

  const display = value || placeholder;

  return (
    <div className="relative block space-y-1.5" ref={rootRef}>
      <span className="text-[11px] font-semibold uppercase tracking-wide text-vikko-muted">
        {label}
      </span>
      <button
        type="button"
        className={triggerClass}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen(o => !o)}
      >
        <span className={cn('flex-1 truncate', !value && 'text-vikko-muted')}>{display}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-vikko-muted" />
      </button>
      {open ? (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-vikko-border bg-vikko-white py-1 shadow-lg"
        >
          {options.map(opt => {
            const selected = value === opt;
            return (
              <li key={opt} role="option" aria-selected={selected} data-value={opt}>
                <button
                  type="button"
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
                    selected
                      ? 'bg-vikko-accent text-vikko-white'
                      : 'text-vikko-ink hover:bg-vikko-canvas'
                  )}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                >
                  <span className="w-4 shrink-0">
                    {selected ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

function EyeCard({
  title,
  badge,
  sphere,
  cylinder,
  axis,
  onSphere,
  onCylinder,
  onAxis,
}: {
  title: string;
  badge: string;
  sphere: string;
  cylinder: string;
  axis: string;
  onSphere: (v: string) => void;
  onCylinder: (v: string) => void;
  onAxis: (v: string) => void;
}) {
  return (
    <div className="rounded-lg border border-vikko-border bg-vikko-white p-4 sm:p-5 overflow-visible">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-vikko-black">{title}</h3>
        <span className="rounded bg-vikko-canvas px-2 py-0.5 text-xs font-medium text-vikko-muted">
          {badge}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <RxScrollSelect
          label="SPH"
          value={sphere}
          options={SPH_OPTIONS}
          centerOn="0.00"
          onChange={onSphere}
        />
        <RxScrollSelect
          label="CYL"
          value={cylinder}
          options={CYL_OPTIONS}
          centerOn="0.00"
          onChange={onCylinder}
        />
        <RxScrollSelect
          label="AXIS"
          value={axis}
          options={AXIS_OPTIONS}
          placeholder="—"
          centerOn="90"
          onChange={onAxis}
        />
      </div>
    </div>
  );
}

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
        <label className="flex items-center gap-3 rounded-lg border border-vikko-border px-4 py-4 cursor-pointer hover:border-vikko-accent bg-vikko-white">
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

        <div className="pt-4">
          <h3 className="font-display text-xl font-bold text-vikko-black mb-1">
            Enter Your Prescription
          </h3>
          <p className="text-sm text-vikko-muted mb-5">
            Use the same numbers as on your written prescription.
            Enter the values from your prescription slip.{' '}
            <a href="/shipping" className="text-vikko-accent underline font-medium">
              How to measure PD
            </a>
          </p>

          <div className="space-y-4">
            <EyeCard
              title="Right eye"
              badge="OD"
              sphere={draft.sphereOd}
              cylinder={draft.cylinderOd}
              axis={draft.axisOd}
              onSphere={v => update({ sphereOd: v })}
              onCylinder={v => update({ cylinderOd: v })}
              onAxis={v => update({ axisOd: v })}
            />
            <EyeCard
              title="Left eye"
              badge="OS"
              sphere={draft.sphereOs}
              cylinder={draft.cylinderOs}
              axis={draft.axisOs}
              onSphere={v => update({ sphereOs: v })}
              onCylinder={v => update({ cylinderOs: v })}
              onAxis={v => update({ axisOs: v })}
            />

            <div className="rounded-lg border border-vikko-border bg-vikko-white p-4 sm:p-5 space-y-3">
              <h3 className="font-semibold text-vikko-black">Pupillary distance (PD)</h3>
              <p className="text-sm text-vikko-muted">
                One number for both eyes, unless your Rx lists two.
              </p>
              {!draft.dualPd ? (
                <select
                  value={draft.pd}
                  onChange={e => update({ pd: e.target.value })}
                  className={`${fieldClass} text-left`}
                >
                  <option value="">Select PD (mm)</option>
                  {PD_OPTIONS.map(v => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={draft.pdRight ?? ''}
                    onChange={e => update({ pdRight: e.target.value, pd: e.target.value })}
                    className={`${fieldClass} text-left`}
                  >
                    <option value="">Right PD</option>
                    {PD_OPTIONS.map(v => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <select
                    value={draft.pdLeft ?? ''}
                    onChange={e => update({ pdLeft: e.target.value })}
                    className={`${fieldClass} text-left`}
                  >
                    <option value="">Left PD</option>
                    {PD_OPTIONS.map(v => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <label className="flex items-center gap-2 text-sm text-vikko-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.dualPd}
                  onChange={e => update({ dualPd: e.target.checked })}
                />
                I have two PD numbers
              </label>
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-vikko-border px-4 py-4 cursor-pointer bg-vikko-white">
          <input
            type="checkbox"
            className="mt-1"
            checked={draft.ackRefund}
            onChange={e => update({ ackRefund: e.target.checked })}
          />
          <span className="text-sm text-vikko-ink">
            I acknowledge that prescription eyewear is non-refundable unless the prescription is
            filled incorrectly.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-lg border border-vikko-border px-4 py-4 cursor-pointer bg-vikko-white">
          <input
            type="checkbox"
            className="mt-1"
            checked={draft.ackPrivacy}
            onChange={e => update({ ackPrivacy: e.target.checked })}
          />
          <span className="text-sm text-vikko-ink">
            I acknowledge that by uploading my prescription information, Vikko Sport may process
            and transmit my prescription in accordance with the{' '}
            <a href="/contact" className="text-vikko-accent underline">
              privacy policy
            </a>
            .
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
