import { WebHeader } from '@/components/layout';
import { DiagnosticIntro } from '@/features/diagnostic/components';

export default function DiagnosticIntroScreen() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <WebHeader />
      <DiagnosticIntro />
    </div>
  );
}
