import { RxWizard } from '../features/rx/RxWizard';
import { RxWizardProvider } from '../features/rx/store';

export function RxSports() {
  return (
    <div className="animate-fade-in bg-vikko-white min-h-full">
      <RxWizardProvider>
        <RxWizard />
      </RxWizardProvider>
    </div>
  );
}
