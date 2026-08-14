import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { RxPrescriptionDraft } from './types';

function cell(value: string): string {
  return value || '—';
}

function formatPd(draft: RxPrescriptionDraft): string {
  if (draft.dualPd && draft.pdRight && draft.pdLeft) {
    return `${draft.pdRight} / ${draft.pdLeft} mm`;
  }
  if (!draft.pd) return '—';
  return `${Number(draft.pd).toFixed(1)} mm`;
}

const thVal =
  'border-l border-vikko-border px-4 py-2.5 text-center text-sm font-semibold text-vikko-accent';
const tdLabel = 'px-4 py-3 text-left text-sm font-normal text-vikko-muted whitespace-nowrap';
const tdVal =
  'border-l border-vikko-border px-4 py-3 text-center text-sm font-medium text-vikko-black tabular-nums';

export function ConfirmPrescriptionModal({
  draft,
  onCancel,
  onConfirm,
}: {
  draft: RxPrescriptionDraft;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-vikko-black/40 p-4"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-rx-title"
        className="w-full max-w-xl rounded-lg border border-vikko-border bg-vikko-white shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 id="confirm-rx-title" className="font-display text-xl font-bold text-vikko-black">
            Confirm Prescription
          </h2>
          <button
            type="button"
            aria-label="Close"
            className="rounded p-1 text-vikko-muted hover:bg-vikko-canvas hover:text-vikko-black"
            onClick={onCancel}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 px-6 pb-5">
          <div className="overflow-hidden rounded-md border border-vikko-border">
            <table className="w-full table-fixed border-collapse">
              <colgroup>
                <col className="w-[34%]" />
                <col className="w-[22%]" />
                <col className="w-[22%]" />
                <col className="w-[22%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-vikko-border">
                  <th className="px-4 py-2.5" />
                  <th className={thVal}>SPH</th>
                  <th className={thVal}>CYL</th>
                  <th className={thVal}>AXIS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-vikko-border">
                  <th scope="row" className={tdLabel}>
                    Right Eye (OD)
                  </th>
                  <td className={tdVal}>{cell(draft.sphereOd)}</td>
                  <td className={tdVal}>{cell(draft.cylinderOd)}</td>
                  <td className={tdVal}>{cell(draft.axisOd)}</td>
                </tr>
                <tr>
                  <th scope="row" className={tdLabel}>
                    Left Eye (OS)
                  </th>
                  <td className={tdVal}>{cell(draft.sphereOs)}</td>
                  <td className={tdVal}>{cell(draft.cylinderOs)}</td>
                  <td className={tdVal}>{cell(draft.axisOs)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-stretch overflow-hidden rounded-md border border-vikko-border text-sm">
            <div className="flex flex-1 items-center px-4 py-3 text-vikko-muted">
              Pupillary Distance (PD)
            </div>
            <div className="flex min-w-[8rem] items-center justify-end border-l border-vikko-border px-4 py-3 font-medium tabular-nums text-vikko-black">
              {formatPd(draft)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 px-6 pb-5">
          <button
            type="button"
            className="rounded-md border border-vikko-black bg-vikko-white px-4 py-2.5 text-sm font-semibold text-vikko-black hover:bg-vikko-canvas"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-md bg-vikko-black px-4 py-2.5 text-sm font-semibold text-vikko-white hover:bg-vikko-ink"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
