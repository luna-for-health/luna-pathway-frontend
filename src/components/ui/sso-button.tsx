import * as React from 'react';

import { Button } from '@/components/ui/button';
import { AppleIcon, GoogleIcon } from '@/icons';
import { cn } from '@/lib/utils';
import type { SSOButtonProps } from '@/types';

// `variant="neutral"` now carries a Figma-verified hover (`hover:bg-primary-10`, see
// button.tsx), but these SSO buttons override neutral's colors entirely and were never
// meant to have a hover state at all — explicit `hover:bg-*` here (matching each
// provider's own base color) cancels the inherited hover instead of flashing lavender.
const providerConfig = {
  google: {
    label: 'Continuer avec Google',
    icon: <GoogleIcon className="size-4" />,
    className: 'bg-neutral-05 text-neutral-90 hover:bg-neutral-05',
  },
  apple: {
    label: 'Continuer avec Apple',
    icon: <AppleIcon className="h-4 w-3.5" />,
    className: 'bg-neutral-90 text-neutral-white hover:bg-neutral-90',
  },
} as const;

const SSOButton = React.forwardRef<HTMLButtonElement, SSOButtonProps>(function SSOButton(
  { className, provider, ...props },
  ref
) {
  const { label, icon, className: providerClassName } = providerConfig[provider];

  return (
    <Button
      ref={ref}
      variant="neutral"
      size="xl"
      className={cn('justify-center font-bold', providerClassName, className)}
      {...props}
    >
      {icon}
      {label}
    </Button>
  );
});

export { SSOButton };
