import { useNavigate } from 'react-router-dom';

import { WebHeader } from '@/components/layout';

import { RequestSummary } from '../components';

/**
 * No `centerContent` here — Figma's `DesktopHeader` for this node (7251:12664) is rendered
 * with no children, unlike the "Étape X/4" label on steps 2-6 (the step-5 imaging question and
 * step-6 upload both share "4/4" — they're two sub-steps of the last step, not separate
 * top-level steps).
 */
export default function RequestSummaryScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <WebHeader onBack={() => navigate(-1)} />
      <RequestSummary />
    </div>
  );
}
