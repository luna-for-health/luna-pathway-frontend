import * as React from 'react';

import { Dialog as RadixDialog, VisuallyHidden } from 'radix-ui';

import useVisualViewportInsets from '@/hooks/useVisualViewportInsets';
import { CrossIcon } from '@/icons';
import { cn } from '@/lib/utils';
import type { SheetProps } from '@/types';

/**
 * Luna DS "Sheet" (node 13220:969 `bar` / 12909:967 `close button` / 16360:771
 * `sm close button`, DS file) — a bottom sheet. Built on the same radix-ui Dialog
 * primitives as `Dialog` (portal/overlay/focus-trap/escape), just positioned and
 * animated from the bottom edge instead of centered. Zero new tokens: surface
 * reuses `--color-neutral-white`, title text reuses `--color-body-primary`, the
 * close pill reuses `--color-button-neutral-bg`/`--color-heading-primary` (same
 * pairing as `Toast`'s close button), and radii reuse `--radius-2xl`/`--radius-xl`.
 *
 * `title` is always required for accessibility (`Dialog.Title`) even when the
 * `bar`/`sm-close-button` variants don't render it visually — it's visually hidden
 * via radix's `VisuallyHidden` in that case, matching how those Figma variants have
 * no on-screen heading at all.
 */
const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(function Sheet(
  { open, defaultOpen, onOpenChange, trigger, title, variant = 'bar', className, children },
  ref
) {
  const isBar = variant === 'bar';
  const isCloseButton = variant === 'close-button';
  const isSmCloseButton = variant === 'sm-close-button';
  const isModalMd = variant === 'modal-md';
  const showsTitleText = isCloseButton || isModalMd;
  // Keep the sheet inside the visible area when the mobile keyboard is open, so the
  // scrollable body shrinks above the keyboard instead of hiding behind it.
  const [isOpenInternal, setIsOpenInternal] = React.useState(defaultOpen ?? false);
  const isOpen = open ?? isOpenInternal;
  const keyboardInsets = useVisualViewportInsets(isOpen);

  function handleOpenChange(nextOpen: boolean) {
    setIsOpenInternal(nextOpen);
    onOpenChange?.(nextOpen);
  }

  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
      {trigger && <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger>}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="bg-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50" />
        <RadixDialog.Content
          ref={ref}
          style={
            {
              '--keyboard-inset-top': `${keyboardInsets.top}px`,
              '--keyboard-inset-bottom': `${keyboardInsets.bottom}px`,
            } as React.CSSProperties
          }
          className={cn(
            'bg-neutral-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom fixed bottom-(--keyboard-inset-bottom) z-50 flex w-full flex-col pb-6 outline-none',
            isModalMd
              ? 'lg:data-[state=closed]:slide-out-to-bottom-8 lg:data-[state=open]:slide-in-from-bottom-8 inset-x-0 top-[calc(var(--keyboard-inset-top)+0.5rem)] items-start rounded-tl-xl rounded-tr-xl lg:inset-x-auto lg:top-1/2 lg:bottom-auto lg:left-1/2 lg:h-130 lg:w-124.5 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-xl'
              : 'left-1/2 max-w-[376px] -translate-x-1/2',
            !isModalMd &&
              (isBar
                ? 'items-center rounded-tl-2xl rounded-tr-2xl'
                : 'items-start rounded-tl-xl rounded-tr-xl'),
            className
          )}
        >
          {showsTitleText ? (
            <div className="flex min-h-10 w-full items-center gap-2 px-8 py-6">
              <RadixDialog.Title className="text-body-primary font-heading flex-1 text-xl leading-7 font-medium tracking-[-0.24px]">
                {title}
              </RadixDialog.Title>
              <RadixDialog.Close
                aria-label="Fermer"
                className={cn(
                  'bg-button-neutral-bg text-heading-primary flex shrink-0 items-center justify-center rounded-full',
                  isModalMd ? 'h-8 w-12 lg:h-10 lg:w-14' : 'size-10'
                )}
              >
                <CrossIcon className={isModalMd ? 'size-5 lg:size-6' : 'size-6'} />
              </RadixDialog.Close>
            </div>
          ) : (
            <VisuallyHidden.Root asChild>
              <RadixDialog.Title>{title}</RadixDialog.Title>
            </VisuallyHidden.Root>
          )}

          {isBar && (
            <div className="flex w-full flex-col items-center pt-3 pb-4">
              <div className="bg-form-field-icon h-1 w-16 rounded-full" aria-hidden="true" />
            </div>
          )}

          {isSmCloseButton && (
            <div className="flex w-full items-center justify-end px-8 py-6">
              <RadixDialog.Close
                aria-label="Fermer"
                className="bg-button-neutral-bg text-heading-primary flex size-8 shrink-0 items-center justify-center rounded-full"
              >
                <CrossIcon className="size-5" />
              </RadixDialog.Close>
            </div>
          )}

          <div
            className={cn(
              'min-h-12 w-full',
              isModalMd ? 'min-h-0 flex-1 overflow-y-auto px-8' : 'px-6'
            )}
          >
            {children}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
});

export { Sheet };
