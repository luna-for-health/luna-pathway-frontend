import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Alert, Button, Input } from '@/components/ui';
import { useSecretaryResetPassword } from '@/features/auth-secretary/api';
import {
  resetPasswordSecretarySchema,
  type ResetPasswordSecretaryFormValues,
} from '@/features/auth-secretary/schemas';
import type { ResetPasswordSecretaryFormProps } from '@/features/auth-secretary/types';
import { ArrowForwardIcon } from '@/icons';
import { cn } from '@/lib/utils';
import { ApiError } from '@/services';

function ResetPasswordSecretaryForm({ className, email }: ResetPasswordSecretaryFormProps) {
  const navigate = useNavigate();
  const { mutateAsync: resetPassword, isPending, isSuccess } = useSecretaryResetPassword();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitted },
  } = useForm<ResetPasswordSecretaryFormValues>({
    resolver: zodResolver(resetPasswordSecretarySchema),
    mode: 'onChange',
    defaultValues: { code: '', password: '', passwordConfirmation: '' },
  });

  async function submit(values: ResetPasswordSecretaryFormValues) {
    try {
      await resetPassword({
        email,
        code: values.code,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        const fieldErrors = error.response?.errors;
        if (fieldErrors?.code?.[0]) {
          setError('code', { message: fieldErrors.code[0] });
          return;
        }
        if (fieldErrors?.password?.[0]) {
          setError('password', { message: fieldErrors.password[0] });
          return;
        }
        setError('passwordConfirmation', {
          message:
            fieldErrors?.email?.[0] ??
            error.response?.message ??
            'Le code est invalide ou a expiré.',
        });
        return;
      }
      setError('passwordConfirmation', {
        message: error instanceof Error ? error.message : 'Une erreur est survenue.',
      });
    }
  }

  function goToLogin() {
    navigate('/pro/login', { replace: true });
  }

  if (isSuccess) {
    return (
      <div className={cn('flex w-full flex-col gap-10 lg:w-82.5', className)}>
        <Alert
          type="success"
          title="Mot de passe modifié"
          description="Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."
        />
        <Button type="button" size="xl" className="justify-between" onClick={goToLogin}>
          Se connecter
          <ArrowForwardIcon className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('flex w-full flex-col gap-10 lg:w-82.5', className)}>
      <p className="text-body-primary text-center text-sm">
        Saisissez le code envoyé à {email} et choisissez un nouveau mot de passe.
      </p>

      <form onSubmit={handleSubmit(submit)} className="flex w-full flex-col gap-2">
        <Input
          label="Code de vérification"
          placeholder="123456"
          inputMode="numeric"
          autoComplete="one-time-code"
          error={isSubmitted ? errors.code?.message : undefined}
          {...register('code')}
        />

        <Input
          type="password"
          label="Nouveau mot de passe"
          placeholder="*************"
          autoComplete="new-password"
          error={isSubmitted ? errors.password?.message : undefined}
          {...register('password')}
        />

        <Input
          type="password"
          label="Confirmez le mot de passe"
          placeholder="*************"
          autoComplete="new-password"
          error={isSubmitted ? errors.passwordConfirmation?.message : undefined}
          {...register('passwordConfirmation')}
        />

        <Button
          type="submit"
          size="xl"
          className="mt-4 justify-between"
          disabled={!isValid}
          loading={isPending}
        >
          Réinitialiser
          <ArrowForwardIcon className="size-4" />
        </Button>
      </form>
    </div>
  );
}

export { ResetPasswordSecretaryForm };
