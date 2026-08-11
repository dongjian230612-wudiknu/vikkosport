import { useEffect } from 'react';
import { useSearch } from 'wouter';
import { getProductBySlug } from '../data/products';
import { RxWizard } from '../features/rx/RxWizard';
import { RxWizardProvider, useRxWizard } from '../features/rx/store';
import { RX_SCENES, type RxSceneId } from '../features/rx/types';

function inferSceneFromTags(tags: string[]): RxSceneId | null {
  for (const scene of RX_SCENES) {
    if (scene.tags.some(tag => tags.includes(tag))) return scene.id;
  }
  return null;
}

/** Reads ?frame=&color= from PDP and locks that frame into the wizard. */
function RxFrameBootstrap() {
  const search = useSearch();
  const { state, dispatch } = useRxWizard();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const frameSlug = params.get('frame');
    if (!frameSlug) return;
    if (state.selectedFrame?.slug === frameSlug && state.frameLocked) return;

    const product = getProductBySlug(frameSlug);
    if (!product?.rxCompatible) return;

    const colorId = params.get('color') || product.colors[0]?.id || '';
    dispatch({
      type: 'PRESELECT_FRAME',
      frame: product,
      colorId,
      scene: inferSceneFromTags(product.tags),
    });
  }, [search, dispatch, state.selectedFrame?.slug, state.frameLocked]);

  return null;
}

export function RxSports() {
  return (
    <div className="animate-fade-in bg-vikko-white min-h-full">
      <RxWizardProvider>
        <RxFrameBootstrap />
        <RxWizard />
      </RxWizardProvider>
    </div>
  );
}
