import { Link } from 'wouter';
import type { NavColumn } from '../../lib/nav';
import { cn } from '../../lib/utils';

interface MegaMenuColumnsProps {
  columns: NavColumn[];
  onNavigate?: () => void;
}

export function MegaMenuColumns({ columns, onNavigate }: MegaMenuColumnsProps) {
  return (
    <div className="border-t border-vikko-gray bg-vikko-black shadow-2xl animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={cn(
            'grid gap-10',
            columns.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
          )}
        >
          {columns.map(column => (
            <div key={column.title}>
              <h3 className="text-sm font-bold tracking-widest uppercase text-vikko-white mb-5">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.items.map(item => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className="text-base text-vikko-muted hover:text-vikko-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
