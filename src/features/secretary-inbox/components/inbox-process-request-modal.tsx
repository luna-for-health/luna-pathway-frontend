import * as React from 'react';

import { Dialog as RadixDialog } from 'radix-ui';

import { Button, Select } from '@/components/ui';
import { INBOX_PROCESS_REASONS } from '@/features/secretary-inbox/lib/process-reasons';
import type { InboxProcessRequestModalProps } from '@/features/secretary-inbox/types';
import { CrossIcon } from '@/icons';

/**
 * Figma node 7481:5018 ("sheet" instance, Luna-App file) — the confirmation modal
 * shown when marking an inbox request as processed. Visually a centered dialog,
 * not the DS `Sheet` (which anchors to the bottom edge) — built directly on
 * radix-ui's Dialog primitives instead of forking the shared `Dialog` (fixed
 * 384px width, no close button) or `Sheet` components. Header spacing/close
 * button mirror `Sheet`'s `close-button` variant; corner radius reuses
 * `--radius-xl` (16px, matches the Figma frame's `--xl` token) on all corners.
 */
export function InboxProcessRequestModal({
  open,
  onOpenChange,
  onConfirm,
}: InboxProcessRequestModalProps) {
  const [reason, setReason] = React.useState('');

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setReason('');
    onOpenChange(nextOpen);
  }

  function handleConfirm() {
    if (!reason) return;
    onConfirm(reason as Parameters<typeof onConfirm>[0]);
    setReason('');
  }

  return (
    <RadixDialog.Root open={open} onOpenChange={handleOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="bg-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-[2px]" />
        <RadixDialog.Content className="bg-neutral-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 flex w-full max-w-[500px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl pb-6 outline-none">
          <div className="flex w-full items-center gap-2 px-8 py-6">
            <RadixDialog.Title className="text-body-primary font-heading flex-1 text-2xl font-medium tracking-[-0.24px]">
              Marquer comme traitée
            </RadixDialog.Title>
            <RadixDialog.Close
              aria-label="Fermer"
              className="bg-button-neutral-bg text-heading-primary flex size-10 shrink-0 items-center justify-center rounded-full"
            >
              <CrossIcon className="size-6" />
            </RadixDialog.Close>
          </div>
          <div className="flex w-full flex-col gap-6 px-8">
            <RadixDialog.Description className="text-body-primary text-sm leading-5">
              Pour marquer cette demande comme traitée, merci d’indiquer une raison. Cette demande
              ne sera plus modifiable.
            </RadixDialog.Description>
            <div className="flex w-full flex-col gap-4">
              <Select
                placeholder="Choisir une raison"
                value={reason}
                onChange={event => setReason(event.target.value)}
              >
                {INBOX_PROCESS_REASONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <div className="flex w-full items-center justify-end gap-2">
                <RadixDialog.Close asChild>
                  <Button variant="neutral" size="pill" className="font-bold">
                    Annuler
                  </Button>
                </RadixDialog.Close>
                <Button
                  size="pill"
                  className="font-bold"
                  disabled={!reason}
                  onClick={handleConfirm}
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
