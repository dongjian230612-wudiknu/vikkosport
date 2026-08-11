import { cn } from '../../lib/utils';
import type { RxStep } from './types';

const STEPS: { step: RxStep; label: string }[] = [
  { step: 1, label: 'Scene' },
  { step: 2, label: 'Frame' },
  { step: 3, label: 'Prescription' },
  { step: 4, label: 'Summary' },
];

interface RxProgressProps {
  current: RxStep;
}

export function RxProgress({ current }: RxProgressProps) {
  return (
    <ol className="grid grid-cols-4 gap-2 mb-10">
      {STEPS.map(({ step, label }) => {
        const active = step === current;
        const done = step < current;
        return (
          <li key={step} className="text-center">
            <div
              className={cn(
                'mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold border',
                active && 'bg-vikko-black text-vikko-white border-vikko-black',
                done && 'bg-vikko-accent text-vikko-white border-vikko-accent',
                !active && !done && 'bg-vikko-white text-vikko-muted border-vikko-border'
              )}
            >
              {step}
            </div>
            <p
              className={cn(
                'text-xs font-semibold uppercase tracking-wide',
                active || done ? 'text-vikko-black' : 'text-vikko-muted'
              )}
            >
              {label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
