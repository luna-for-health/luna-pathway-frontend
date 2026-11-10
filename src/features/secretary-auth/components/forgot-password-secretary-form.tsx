import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button, Input } from '@/components/ui';
import { useSecretaryForgotPassword } from '@/features/secretary-auth/api';
import {
  forgotPasswordSecretarySchema,
  type ForgotPasswordSecretaryFormValues,
} from '@/features/secretary-auth/schemas';
import type { ForgotPasswordSecretaryFormProps } from '@/features/secretary-auth/types';
import { ArrowForwardIcon, MailIcon } from '@/icons';
import { isTooManyAttempts, TOO_MANY_ATTEMPTS_MESSAGE } from '@/lib/auth-error-message';
import { cn } from '@/lib/utils';
import { ApiError } from '@/services';

function ForgotPasswordSecretaryForm({ className }: ForgotPasswordSecretaryFormProps) {
  const navigate = useNavigate();
  const { mutateAsync: sendResetCode, isPending } = useSecretaryForgotPassword();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitted },
  } = useForm<ForgotPasswordSecretaryFormValues>({
    resolver: zodResolver(forgotPasswordSecretarySchema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  function getErrorMessage(error: unknown) {
    if (isTooManyAttempts(error)) return TOO_MANY_ATTEMPTS_MESSAGE;
    if (error instanceof ApiError) {
      return (
        error.response?.errors?.email?.[0] ?? error.response?.message ?? 'Une erreur est survenue.'
      );
    }
    if (error instanceof Error) return error.message;
    return 'Une erreur est survenue.';
  }

  async function submit(values: ForgotPasswordSecretaryFormValues) {
    try {
      await sendResetCode(values);
      navigate(`/secretary/reset-password?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      setError('email', { message: getErrorMessage(error) });
    }
  }

  const backToLogin = (
    <button
      type="button"
      onClick={() => navigate('/pro/login')}
      className="text-heading-primary self-center text-sm font-medium underline"
    >
      Retour à la connexion
    </button>
  );

  return (
    <div className={cn('flex w-full flex-col gap-10 lg:w-82.5', className)}>
      <p className="text-body-primary text-center text-sm">
        Saisissez votre adresse e-mail. Nous vous enverrons un code pour réinitialiser votre mot de
        passe.
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

        <Button
          type="submit"
          size="xl"
          className="mt-4 justify-between"
          disabled={!isValid}
          loading={isPending}
        >
          Envoyer le code
          <ArrowForwardIcon className="size-4" />
        </Button>
      </form>

      {backToLogin}
    </div>
  );
}

export { ForgotPasswordSecretaryForm };
