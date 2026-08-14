import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { RxInfo } from '../../types/product';
import { formatDiopterNum } from './checkoutUtils';
import { cn } from '../../lib/utils';

const th =
  'border-l border-vikko-border px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-vikko-accent';
const td =
  'border-l border-vikko-border px-3 py-2.5 text-center text-sm font-semibold tabular-nums text-vikko-black';

export function CartRxModal({
  rx,
  onClose,
}: {
  rx: RxInfo;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const cylOd = rx.cylinderOd != null && rx.cylinderOd !== 0;
  const cylOs = rx.cylinderOs != null && rx.cylinderOs !== 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-vikko-black/45 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-rx-title"
        className="w-full max-w-xl rounded-lg border border-vikko-border bg-vikko-white shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <h2 id="cart-rx-title" className="font-display text-xl font-bold text-vikko-black">
            Prescription
          </h2>
          <button
            type="button"
            aria-label="Close"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md text-vikko-muted hover:bg-vikko-canvas"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3 px-6 pb-6">
          <div className="overflow-hidden rounded-md border border-vikko-border">
            <table className="w-full table-fixed border-collapse text-sm">
              <thead>
                <tr className="border-b border-vikko-border bg-vikko-canvas/60">
                  <th className="px-3 py-2" />
                  <th className={th}>SPH</th>
                  <th className={th}>CYL</th>
                  <th className={th}>AXIS</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-vikko-border">
                  <th className="px-3 py-2.5 text-left font-normal text-vikko-muted">
                    Right Eye (OD)
                  </th>
                  <td className={td}>{formatDiopterNum(rx.sphereOd)}</td>
                  <td className={td}>{cylOd ? formatDiopterNum(rx.cylinderOd) : '—'}</td>
                  <td className={td}>{cylOd && rx.axisOd != null ? String(rx.axisOd) : '—'}</td>
                </tr>
                <tr>
                  <th className="px-3 py-2.5 text-left font-normal text-vikko-muted">
                    Left Eye (OS)
                  </th>
                  <td className={td}>{formatDiopterNum(rx.sphereOs)}</td>
                  <td className={td}>{cylOs ? formatDiopterNum(rx.cylinderOs) : '—'}</td>
                  <td className={td}>{cylOs && rx.axisOs != null ? String(rx.axisOs) : '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex overflow-hidden rounded-md border border-vikko-border text-sm">
            <div className="flex flex-1 items-center px-4 py-2.5 text-vikko-muted">
              Pupillary Distance (PD)
            </div>
            <div className="border-l border-vikko-border px-4 py-2.5 font-semibold tabular-nums">
              {Number(rx.pd).toFixed(1)} mm
            </div>
          </div>
          <button
            type="button"
            className={cn(
              'w-full rounded-md bg-vikko-black px-4 py-2.5 text-sm font-bold text-vikko-white cursor-pointer hover:bg-vikko-ink'
            )}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
