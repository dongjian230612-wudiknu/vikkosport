import { Bike, Footprints, Mountain, PersonStanding, Trees, Route } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useRxWizard } from './store';
import { RX_SCENES, type RxSceneId } from './types';

const ICONS: Record<RxSceneId, typeof Bike> = {
  'road-cycling': Bike,
  'gravel-cycling': Route,
  'mountain-bike': Mountain,
  'trail-running': Trees,
  running: Footprints,
  daily: PersonStanding,
};

export function Step1Scene() {
  const { state, dispatch } = useRxWizard();

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-vikko-black mb-2">Where will you wear them?</h2>
      <p className="text-vikko-muted mb-8">Pick a scene so we can filter RX-compatible frames that fit the sport.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RX_SCENES.map(scene => {
          const Icon = ICONS[scene.id];
          const selected = state.scene === scene.id;
          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => dispatch({ type: 'SET_SCENE', scene: scene.id })}
              className={cn(
                'text-left rounded-lg border p-5 transition-colors cursor-pointer',
                selected
                  ? 'border-vikko-black bg-vikko-canvas'
                  : 'border-vikko-border bg-vikko-white hover:border-vikko-black'
              )}
            >
              <Icon className="w-6 h-6 text-vikko-black mb-3" />
              <h3 className="font-display font-semibold text-vikko-black mb-1">{scene.label}</h3>
              <p className="text-sm text-vikko-muted">{scene.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
