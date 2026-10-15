import * as React from 'react';

import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';
import type { ButtonProps } from '@/types';

import { Loader } from './loader';

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-lg bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[loading=true]:justify-center",
  {
    variants: {
      variant: {
        default:
          'border border-transparent bg-primary text-primary-foreground hover:bg-button-primary-hover-bg disabled:data-[loading=false]:bg-button-disabled-bg disabled:data-[loading=false]:text-button-disabled-text',
        // Figma's hover token for secondary resolves to the same #f7cb45 as the enabled
        // background (confirmed via get_variable_defs), so no separate hover class is needed.
        secondary:
          'border border-transparent bg-button-secondary-bg text-heading-primary disabled:data-[loading=false]:bg-button-disabled-bg disabled:data-[loading=false]:text-button-disabled-text',
        neutral:
          'border border-transparent bg-button-neutral-bg text-heading-primary hover:bg-primary-10 disabled:data-[loading=false]:bg-button-disabled-bg disabled:data-[loading=false]:text-button-disabled-text',
        destructive:
          'border border-transparent bg-button-danger-bg text-button-danger-text hover:bg-button-danger-hover-bg disabled:data-[loading=false]:bg-button-disabled-bg disabled:data-[loading=false]:text-button-disabled-text',
        // Figma: 1px border at rest, thickens to 2px on hover/pressed (state matrix node
        // 11913:2196) — previously always border-2, losing that state distinction.
        outline:
          'border border-heading-primary bg-white text-heading-primary hover:border-2 hover:bg-button-outline-hover-bg disabled:data-[loading=false]:border-button-disabled-text disabled:data-[loading=false]:bg-white disabled:data-[loading=false]:text-button-disabled-text',
        // Figma's "button/filled/white" family (node 6527:4996's Textarea mic button) —
        // white background, heading-primary text/icon. Distinct from `neutral`, whose bg
        // token (#e0e2eb) is a different color from white.
        white:
          'border border-transparent bg-white text-heading-primary hover:bg-primary-10 disabled:data-[loading=false]:bg-button-disabled-bg disabled:data-[loading=false]:text-button-disabled-text',
        ghost:
          'border border-transparent hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 disabled:data-[loading=false]:opacity-50',
        link: 'text-primary underline-offset-4 hover:underline disabled:data-[loading=false]:opacity-50',
      },
      size: {
        default:
          'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xl: 'h-14 gap-2 rounded-2xl px-6 text-sm',
        // Figma's "Common button" (node 6527:4996) — a generic 40px-tall pill CTA,
        // sized by its horizontal padding rather than a fixed width like `icon-pill`.
        pill: 'h-10 gap-2 rounded-full px-4 text-sm font-bold',
        icon: 'size-8',
        'icon-pill': 'h-8 w-12 rounded-full',
        // Figma's "Icon button" (node 6527:4996's mic button) — 40px tall, content-sized
        // via padding (56px wide with a 24px icon), not a fixed square like the other
        // `icon-*` sizes.
        'icon-button': 'h-10 gap-2 rounded-full px-4 py-2',
        'icon-xs':
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        'icon-sm':
          'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
        'icon-lg': 'size-9',
        // Figma's "Icon button" (node 7245:11531) — 72px wide x 56px tall pill (not a
        // square/circle — confirmed via screenshot), pairs with the `xl` (56px) CTA in a
        // footer back/next nav row.
        'icon-xl': 'h-14 w-18 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    loading = false,
    type = 'button',
    disabled,
    children,
    ...props
  },
  ref
) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : type}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          <span className={cn('contents', loading && 'invisible')}>{children}</span>
          {loading && (
            <Loader
              color="currentColor"
              className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2"
            />
          )}
        </>
      )}
    </Comp>
  );
});

export { Button, buttonVariants };
