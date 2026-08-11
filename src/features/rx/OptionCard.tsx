import { cn, formatPrice } from '../../lib/utils';

interface OptionCardProps {
  title: string;
  description: string;
  price?: number;
  selected?: boolean;
  onClick: () => void;
  imageSlot?: 'clear' | 'tinted' | 'standard' | 'polarized' | 'fototec' | null;
}

function LensVisual({ kind }: { kind: NonNullable<OptionCardProps['imageSlot']> }) {
  const tint =
    kind === 'clear' || kind === 'standard'
      ? 'from-slate-100 to-slate-200'
      : kind === 'tinted' || kind === 'polarized'
        ? 'from-slate-600 to-slate-800'
        : 'from-slate-700 via-slate-400 to-slate-100';

  return (
    <div className="mb-4 flex h-28 w-full items-center justify-center rounded-lg bg-vikko-canvas">
      <div className="flex gap-3">
        <div className={cn('h-16 w-16 rounded-full bg-gradient-to-br opacity-90 shadow-inner border border-white/40', tint)} />
        <div className={cn('h-16 w-16 rounded-full bg-gradient-to-br opacity-90 shadow-inner border border-white/40', tint)} />
      </div>
    </div>
  );
}

export function OptionCard({
  title,
  description,
  price,
  selected,
  onClick,
  imageSlot = null,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-full flex-col rounded-lg border bg-vikko-white p-6 text-center transition-colors cursor-pointer',
        selected ? 'border-vikko-black ring-1 ring-vikko-black' : 'border-[#b8d4ea] hover:border-vikko-accent'
      )}
    >
      {imageSlot && <LensVisual kind={imageSlot} />}
      <h3 className="font-display text-lg font-bold text-vikko-black mb-2">{title}</h3>
      <p className="text-sm text-vikko-muted flex-1">{description}</p>
      {typeof price === 'number' && (
        <p className="mt-4 font-display text-base font-bold text-vikko-black">
          {price === 0 ? 'FREE' : formatPrice(price)}
        </p>
      )}
    </button>
  );
}
