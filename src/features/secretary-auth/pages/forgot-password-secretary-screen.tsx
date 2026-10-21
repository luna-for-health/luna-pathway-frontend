import { WebHeader } from '@/components/layout';

import { ForgotPasswordSecretaryForm } from '@/features/secretary-auth/components';

export default function ForgotPasswordSecretaryScreen() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <WebHeader />

      <div className="flex flex-1 flex-col items-center px-8 py-8 lg:px-27">
        <div className="flex w-full max-w-82.5 flex-col items-center">
          <h1 className="text-heading-primary font-heading w-full pb-10 text-center text-3xl font-medium tracking-[-0.16px]">
            Mot de passe oublié
          </h1>

          <ForgotPasswordSecretaryForm />
        </div>
      </div>
    </div>
  );
}
