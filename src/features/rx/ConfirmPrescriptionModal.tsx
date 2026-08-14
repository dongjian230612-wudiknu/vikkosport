import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import type { RxPrescriptionDraft } from './types';
import { cn } from '../../lib/utils';

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
  'border-l border-vikko-border px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-vikko-accent sm:px-4';
const tdLabel =
  'px-3 py-2.5 text-left text-sm font-normal text-vikko-muted whitespace-nowrap sm:px-4';
const tdVal =
  'border-l border-vikko-border px-3 py-2.5 text-center text-sm font-semibold tabular-nums text-vikko-black sm:px-4 sm:text-base';

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-vikko-accent focus-visible:ring-offset-2';

export function ConfirmPrescriptionModal({
  draft,
  onCancel,
  onConfirm,
}: {
  draft: RxPrescriptionDraft;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-vikko-black/45 p-0 sm:items-center sm:p-6"
      role="presentation"
      onClick={onCancel}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="w-full max-w-2xl rounded-t-lg border border-vikko-border bg-vikko-white shadow-xl sm:rounded-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-2 sm:px-7 sm:pt-6">
          <div className="min-w-0">
            <h2 id={titleId} className="font-display text-xl font-bold text-vikko-black sm:text-2xl">
              Confirm Prescription
            </h2>
            <p id={descId} className="mt-1 text-sm text-vikko-muted">
              Double-check OD / OS values and PD before continuing.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            className={cn(
              'inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-md text-vikko-muted transition-colors duration-200 hover:bg-vikko-canvas hover:text-vikko-black',
              focusRing
            )}
            onClick={onCancel}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="space-y-3 px-5 py-4 sm:px-7 sm:pb-5">
          <div className="overflow-x-auto overflow-hidden rounded-md border border-vikko-border">
            <table className="w-full min-w-[28rem] table-fixed border-collapse">
              <colgroup>
                <col className="w-[32%]" />
                <col className="w-[22.5%]" />
                <col className="w-[22.5%]" />
                <col className="w-[23%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-vikko-border bg-vikko-canvas/60">
                  <th className="px-3 py-2 sm:px-4" scope="col">
                    <span className="sr-only">Eye</span>
                  </th>
                  <th className={thVal} scope="col">
                    SPH
                  </th>
                  <th className={thVal} scope="col">
                    CYL
                  </th>
                  <th className={thVal} scope="col">
                    AXIS
                  </th>
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
            <div className="flex flex-1 items-center px-3 py-2.5 text-vikko-muted sm:px-4">
              Pupillary Distance (PD)
            </div>
            <div className="flex min-w-[7.5rem] items-center justify-end border-l border-vikko-border px-3 py-2.5 text-base font-semibold tabular-nums text-vikko-black sm:min-w-[9rem] sm:px-4">
              {formatPd(draft)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-vikko-border px-5 py-4 sm:gap-4 sm:px-7 sm:py-5">
          <button
            ref={cancelRef}
            type="button"
            className={cn(
              'min-h-11 cursor-pointer rounded-md border border-vikko-black bg-vikko-white px-4 py-2.5 text-sm font-bold text-vikko-black transition-colors duration-200 hover:bg-vikko-canvas',
              focusRing
            )}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={cn(
              'min-h-11 cursor-pointer rounded-md bg-vikko-black px-4 py-2.5 text-sm font-bold text-vikko-white transition-colors duration-200 hover:bg-vikko-ink',
              focusRing
            )}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
