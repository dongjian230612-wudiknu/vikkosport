import { useEffect } from 'react';
import { useSearch } from 'wouter';
import { getProductBySlug } from '../data/products';
import { useCatalog } from '../lib/catalog';
import { RxWizard } from '../features/rx/RxWizard';
import { RxWizardProvider, useRxWizard } from '../features/rx/store';

function RxFrameBootstrap() {
  const search = useSearch();
  const { products, loading } = useCatalog();
  const { state, dispatch } = useRxWizard();

  useEffect(() => {
    if (loading) return;
    const params = new URLSearchParams(search);
    const frameSlug = params.get('frame');
    if (!frameSlug) return;
    if (state.selectedFrame?.slug === frameSlug && state.frameLocked) return;

    const product = getProductBySlug(frameSlug, products);
    if (!product?.rxCompatible) return;

    const colorId = params.get('color') || product.colors[0]?.id || '';
    dispatch({
      type: 'PRESELECT_FRAME',
      frame: product,
      colorId,
    });
  }, [search, dispatch, state.selectedFrame?.slug, state.frameLocked, products, loading]);

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
