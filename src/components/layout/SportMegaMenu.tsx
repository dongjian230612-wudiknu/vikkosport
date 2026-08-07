import { Link } from 'wouter';
import { SPORTS, FEATURED_SPORTS } from '../../lib/sports';

interface SportMegaMenuProps {
  onNavigate?: () => void;
}

export function SportMegaMenu({ onNavigate }: SportMegaMenuProps) {
  return (
    <div className="border-t border-vikko-gray bg-vikko-black shadow-2xl animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-vikko-white mb-5">
              Sport
            </h3>
            <ul className="space-y-3">
              {SPORTS.map(sport => (
                <li key={sport.id}>
                  <Link
                    href={sport.href}
                    onClick={onNavigate}
                    className="text-base text-vikko-muted hover:text-vikko-accent transition-colors"
                  >
                    {sport.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURED_SPORTS.map(sport => (
              <Link
                key={sport.id}
                href={sport.href}
                onClick={onNavigate}
                className="group block"
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-vikko-dark border border-vikko-gray relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                    style={{ backgroundImage: `url(/images/sports/${sport.id}.jpg)` }}
                  />
                  <div className="absolute inset-0 bg-vikko-black/30 group-hover:bg-vikko-black/10 transition-colors" />
                </div>
                <p className="mt-3 text-center text-sm font-medium text-vikko-muted group-hover:text-vikko-white transition-colors">
                  {sport.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
