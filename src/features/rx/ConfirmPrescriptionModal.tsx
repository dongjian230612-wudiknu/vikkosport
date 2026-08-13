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
        className="w-full max-w-md rounded-lg border border-vikko-border bg-vikko-white shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-vikko-border px-5 py-4">
          <h2 id="confirm-rx-title" className="font-display text-lg font-bold text-vikko-black">
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

        <div className="space-y-3 px-5 py-5">
          <div className="overflow-hidden rounded-md border border-vikko-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-vikko-border">
                  <th className="w-[28%] px-3 py-2.5 text-left font-medium text-vikko-muted" />
                  <th className="px-3 py-2.5 text-center font-semibold text-vikko-accent">SPH</th>
                  <th className="px-3 py-2.5 text-center font-semibold text-vikko-accent">CYL</th>
                  <th className="px-3 py-2.5 text-center font-semibold text-vikko-accent">AXIS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-vikko-border">
                  <th className="px-3 py-3 text-left font-normal text-vikko-muted">
                    Right Eye (OD)
                  </th>
                  <td className="px-3 py-3 text-center font-medium text-vikko-black">
                    {cell(draft.sphereOd)}
                  </td>
                  <td className="px-3 py-3 text-center font-medium text-vikko-black">
                    {cell(draft.cylinderOd)}
                  </td>
                  <td className="px-3 py-3 text-center font-medium text-vikko-black">
                    {cell(draft.axisOd)}
                  </td>
                </tr>
                <tr>
                  <th className="px-3 py-3 text-left font-normal text-vikko-muted">
                    Left Eye (OS)
                  </th>
                  <td className="px-3 py-3 text-center font-medium text-vikko-black">
                    {cell(draft.sphereOs)}
                  </td>
                  <td className="px-3 py-3 text-center font-medium text-vikko-black">
                    {cell(draft.cylinderOs)}
                  </td>
                  <td className="px-3 py-3 text-center font-medium text-vikko-black">
                    {cell(draft.axisOs)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-stretch overflow-hidden rounded-md border border-vikko-border text-sm">
            <div className="flex flex-1 items-center px-3 py-3 text-vikko-muted">
              Pupillary Distance (PD)
            </div>
            <div className="flex min-w-[7.5rem] items-center justify-end border-l border-vikko-border px-3 py-3 font-medium text-vikko-black">
              {formatPd(draft)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-vikko-border px-5 py-4">
          <button
            type="button"
            className="rounded-md border border-vikko-black bg-vikko-white px-4 py-3 text-sm font-bold text-vikko-black hover:bg-vikko-canvas"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-md bg-vikko-black px-4 py-3 text-sm font-bold text-vikko-white hover:bg-vikko-ink"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
