import { ScanFace } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ProductImage } from '../../types/product';

interface ProductGalleryProps {
  images: ProductImage[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onTryOn?: () => void;
}

export function ProductGallery({
  images,
  activeIndex,
  onSelect,
  onTryOn,
}: ProductGalleryProps) {
  const active = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      {/* Desktop: vertical thumbs + Try On */}
      <div className="hidden sm:flex flex-col gap-2 w-[72px] flex-shrink-0">
        {images.map((img, idx) => (
          <button
            key={`${img.url}-${idx}`}
            type="button"
            onClick={() => onSelect(idx)}
            className={cn(
              'aspect-square w-full overflow-hidden rounded-md border-2 bg-vikko-canvas cursor-pointer transition-colors',
              activeIndex === idx ? 'border-vikko-black' : 'border-transparent hover:border-vikko-border'
            )}
            aria-label={img.alt}
          >
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
          </button>
        ))}

        <button
          type="button"
          onClick={onTryOn}
          className="mt-1 flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-md border border-vikko-border bg-vikko-white text-vikko-ink hover:border-vikko-black transition-colors cursor-pointer"
          aria-label="Try on"
        >
          <ScanFace className="h-5 w-5" />
          <span className="text-[10px] font-semibold leading-none">Try On</span>
        </button>
      </div>

      {/* Main image */}
      <div className="relative flex-1 min-w-0">
        <div className="aspect-square overflow-hidden rounded-lg bg-vikko-canvas">
          {active ? (
            <img
              src={active.url}
              alt={active.alt}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-vikko-muted text-sm">
              No image
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onTryOn}
          className="absolute top-3 right-3 inline-flex items-center gap-2 rounded-full border border-vikko-border bg-vikko-white/95 px-3 py-1.5 text-xs font-semibold text-vikko-ink shadow-sm hover:border-vikko-black transition-colors cursor-pointer"
        >
          <ScanFace className="h-3.5 w-3.5" />
          Try on virtually
        </button>
      </div>

      {/* Mobile: horizontal thumbs + Try On */}
      <div className="flex sm:hidden gap-2 overflow-x-auto pb-1">
        {images.map((img, idx) => (
          <button
            key={`m-${img.url}-${idx}`}
            type="button"
            onClick={() => onSelect(idx)}
            className={cn(
              'h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 bg-vikko-canvas cursor-pointer',
              activeIndex === idx ? 'border-vikko-black' : 'border-transparent'
            )}
          >
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
          </button>
        ))}
        <button
          type="button"
          onClick={onTryOn}
          className="h-16 w-16 flex-shrink-0 flex flex-col items-center justify-center gap-0.5 rounded-md border border-vikko-border bg-vikko-white cursor-pointer"
        >
          <ScanFace className="h-4 w-4" />
          <span className="text-[9px] font-semibold">Try On</span>
        </button>
      </div>
    </div>
  );
}
