import { useNavigate, useSearchParams } from 'react-router-dom';

import { WebHeader } from '@/components/layout';
import { Alert } from '@/components/ui';

import { ResetPasswordSecretaryForm } from '@/features/secretary-auth/components';

export default function ResetPasswordSecretaryScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <WebHeader />

      <div className="flex flex-1 flex-col items-center px-8 py-8 lg:px-27">
        <div className="flex w-full max-w-82.5 flex-col items-center">
          <h1 className="text-heading-primary font-heading w-full pb-10 text-center text-3xl font-medium tracking-[-0.16px]">
            Nouveau mot de passe
          </h1>

          {email ? (
            <ResetPasswordSecretaryForm email={email} />
          ) : (
            <div className="flex w-full flex-col gap-10">
              <Alert
                type="danger"
                title="E-mail manquant"
                description="Veuillez saisir votre adresse e-mail pour recevoir un code de réinitialisation."
              />
              <button
                type="button"
                onClick={() => navigate('/secretary/forgot-password', { replace: true })}
                className="text-heading-primary self-center text-sm font-medium underline"
              >
                Demander un code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
