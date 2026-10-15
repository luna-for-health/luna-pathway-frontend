import * as React from 'react';

import { Dialog as RadixDialog } from 'radix-ui';

import { cn } from '@/lib/utils';
import type { DialogProps } from '@/types';

import { Button } from './button';

/**
 * Luna DS "Dialog" (node 12167:5177 validation / 12167:5186 danger, DS file).
 * Overlay/portal/focus-trap/escape-key handling delegated to radix-ui's Dialog
 * primitives (already a project dependency) — the DS task explicitly calls out
 * shared overlay/portal logic across Dialog/Sheet/Dropdown. The card itself needs
 * zero new tokens: title reuses `--color-heading-primary`, body text reuses
 * `--color-body-primary`, the card surface reuses `--color-neutral-white`, and the
 * footer buttons reuse the existing `Button` component (`outline` for Annuler,
 * `default`/`destructive` for Valider/Supprimer — both match Figma's button token
 * values exactly). Figma's CTA text is bold (`Poppins:Bold`); `Button`'s shared base
 * styling is `font-medium` for every variant, so `font-bold` is applied via
 * `className` here rather than forking the shared component.
 */
const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  {
    open,
    defaultOpen,
    onOpenChange,
    trigger,
    title,
    description,
    type = 'validation',
    cancelLabel = 'Annuler',
    confirmLabel,
    onCancel,
    onConfirm,
    className,
    children,
  },
  ref
) {
  const isDanger = type === 'danger';
  const resolvedConfirmLabel = confirmLabel ?? (isDanger ? 'Supprimer' : 'Valider');
  // Figma's "danger" dialog instance (e.g. node 6773:4161, delete-document confirm) swaps
  // the cancel button to the filled `neutral` style instead of `outline` — confirmed via its
  // rendered fill (#e0e2eb bg / #2d00b3 text, no border), not just the DS master default.
  const cancelVariant = isDanger ? 'neutral' : 'outline';

  function handleCancel() {
    onCancel?.();
    onOpenChange?.(false);
  }

  function handleConfirm() {
    onConfirm?.();
    onOpenChange?.(false);
  }

  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-overlay fixed inset-0 z-50" />
        <RadixDialog.Content
          ref={ref}
          className={cn(
            'bg-neutral-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 flex w-96 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg outline-none',
            className
          )}
        >
          <div className="flex w-full items-center justify-center px-6 pt-6">
            <RadixDialog.Title className="text-heading-primary flex-1 text-lg leading-6 font-medium tracking-[-0.4px]">
              {title}
            </RadixDialog.Title>
          </div>
          <div className="flex w-full flex-col gap-2 p-6">
            {description && (
              <RadixDialog.Description className="text-body-primary w-full text-sm leading-5">
                {description}
              </RadixDialog.Description>
            )}
            {children}
          </div>
          <div className="flex w-full items-center gap-2 px-6 pb-6">
            <Button
              variant={cancelVariant}
              size="xl"
              className="flex-1 font-bold"
              onClick={handleCancel}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={isDanger ? 'destructive' : 'default'}
              size="xl"
              className="flex-1 font-bold"
              onClick={handleConfirm}
            >
              {resolvedConfirmLabel}
            </Button>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
});

export { Dialog };
