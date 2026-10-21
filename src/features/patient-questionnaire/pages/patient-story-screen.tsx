import { useNavigate } from 'react-router-dom';

import { WebHeader } from '@/components/layout';

import { PatientStory } from '../components';

export default function PatientStoryScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <WebHeader
        onBack={() => navigate(-1)}
        centerContent={
          <p className="text-body-tertiary text-xs leading-4 font-medium whitespace-nowrap">
            Étape 2/4
          </p>
        }
      />
      <PatientStory />
    </div>
  );
}
