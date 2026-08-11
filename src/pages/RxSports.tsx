import { useEffect } from 'react';
import { useSearch } from 'wouter';
import { getProductBySlug } from '../data/products';
import { RxWizard } from '../features/rx/RxWizard';
import { RxWizardProvider, useRxWizard } from '../features/rx/store';

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
