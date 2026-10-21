import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Input } from '@/components/ui';
import { useSecretaryLogin } from '@/features/secretary-auth/api';
import {
  loginSecretarySchema,
  type LoginSecretaryFormValues,
} from '@/features/secretary-auth/schemas';
import type { LoginSecretaryFormProps } from '@/features/secretary-auth/types';
import { ArrowForwardIcon, MailIcon } from '@/icons';
import { cn } from '@/lib/utils';
import { ApiError, analytics, tokenStorage } from '@/services';

function LoginSecretaryForm({ className }: LoginSecretaryFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: login, isPending } = useSecretaryLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitted },
  } = useForm<LoginSecretaryFormValues>({
    resolver: zodResolver(loginSecretarySchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  function getErrorMessage(error: unknown) {
    if (error instanceof ApiError) return error.response?.message ?? 'Identifiants invalides.';
    if (error instanceof Error) return error.message;
    return 'Une erreur est survenue.';
  }

  async function submit(values: LoginSecretaryFormValues) {
    try {
      const { data } = await login(values);
      tokenStorage.set(data.access_token, 'secretary');
      // Lets Amplitude count distinct secretaries using the inbox (plan's adoption criteria).
      // Prefixed so a secretary id never merges with a patient's numeric id in Amplitude.
      if (data.user) analytics.identify(`secretary_${data.user.id}`);

      // Back to the page the auth guard bounced the user from, if it was a secretary page.
      const from = (location.state as { from?: string } | null)?.from;
      const redirectTo = from?.startsWith('/secretary/') ? from : '/secretary/inbox';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setError('password', { message: getErrorMessage(error) });
    }
  }

  return (
    <div className={cn('flex w-full flex-col gap-10 lg:w-82.5', className)}>
      <p className="text-body-primary text-center text-sm">
        Connectez-vous avec votre adresse e-mail et votre mot de passe.
      </p>

      <form onSubmit={handleSubmit(submit)} className="flex w-full flex-col gap-2">
        <Input
          label="Votre e-mail"
          icon={<MailIcon fillColor="formFieldIcon" />}
          placeholder="luna@gmail.com"
          autoComplete="email"
          error={isSubmitted ? errors.email?.message : undefined}
          {...register('email')}
        />

        <Input
          type="password"
          label="Votre mot de passe"
          placeholder="*************"
          autoComplete="current-password"
          error={isSubmitted ? errors.password?.message : undefined}
          {...register('password')}
        />

        <button
          type="button"
          onClick={() => navigate('/secretary/forgot-password')}
          className="text-heading-primary self-end text-sm font-medium underline"
        >
          Mot de passe oublié ?
        </button>

        <Button
          type="submit"
          size="xl"
          className="justify-between"
          disabled={!isValid}
          loading={isPending}
        >
          Se connecter
          <ArrowForwardIcon className="size-4" />
        </Button>
      </form>
    </div>
  );
}

export { LoginSecretaryForm };
