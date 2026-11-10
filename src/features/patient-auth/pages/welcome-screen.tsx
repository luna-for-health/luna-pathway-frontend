import { useNavigate } from 'react-router-dom';

import { WebHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import { BookingStepsCard } from '@/features/patient-auth/components';

// Set per deployment so each centre can reuse this front-end (see .env.example).
const CENTER_NAME = import.meta.env.VITE_CENTER_NAME || 'Centre Luna';

const BOOKING_STEPS = [
  'Indiquer votre adresse e-mail pour créer votre compte ou vous connecter',
  'Faire votre demande de rendez-vous',
  'Être rappelée par le secrétariat sous 2 jours ouvrés pour fixer votre rendez-vous',
];

export default function WelcomeScreen() {
  const navigate = useNavigate();

  function handleContinue() {
    navigate('/login');
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <WebHeader />

      <div className="flex flex-1 flex-col px-8 pt-8 pb-8 lg:items-center lg:justify-center lg:px-27 lg:py-2">
        <div className="flex w-full flex-1 flex-col lg:max-w-201 lg:flex-none">
          <h1 className="font-heading text-heading-primary w-full pb-8 text-3xl font-medium tracking-[-0.16px] lg:pb-10">
            Bienvenue au {CENTER_NAME}
          </h1>

          <div className="flex w-full flex-1 flex-col gap-6 lg:min-h-127 lg:flex-row lg:items-start lg:justify-between lg:gap-21">
            <div className="flex flex-col gap-10 lg:w-80">
              <p className="text-body-primary text-sm lg:text-base lg:leading-5">
                Vous êtes sur l’espace de prise de rendez-vous du Centre de santé des femmes Luna.
              </p>

              <Button size="xl" className="hidden w-full lg:flex" onClick={handleContinue}>
                Continuer
              </Button>
            </div>

            <BookingStepsCard
              title="Comment se passe votre prise de rendez-vous"
              steps={BOOKING_STEPS}
            />

            {/* Mobile: CTA pinned to the bottom of the viewport, below the card. */}
            <Button size="xl" className="mt-auto w-full lg:hidden" onClick={handleContinue}>
              Continuer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
