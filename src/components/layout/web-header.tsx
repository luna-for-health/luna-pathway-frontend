import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { ArrowBackIcon, MenuIcon } from '@/icons';
import { cn } from '@/lib/utils';
import type { WebHeaderProps } from '@/types';

function WebHeader({ className, onBack, onMenuToggle, centerContent, ...props }: WebHeaderProps) {
  return (
    <header
      data-slot="web-header"
      className={cn(
        'relative flex h-18 w-full items-center justify-center bg-white px-6 lg:justify-between',
        className
      )}
      {...props}
    >
      {onBack ? (
        <Button
          type="button"
          variant="neutral"
          size="icon-lg"
          onClick={onBack}
          aria-label="Retour"
          className="absolute top-1/2 left-6 h-10 w-14 -translate-y-1/2 rounded-full lg:hidden"
        >
          <ArrowBackIcon className="size-6" />
        </Button>
      ) : (
        onMenuToggle && (
          <Button
            type="button"
            variant="neutral"
            size="icon-lg"
            onClick={onMenuToggle}
            aria-label="Ouvrir le menu"
            className="absolute top-1/2 left-6 h-10 w-14 -translate-y-1/2 rounded-full lg:hidden"
          >
            <MenuIcon size={24} color="headingPrimary" />
          </Button>
        )
      )}
      {centerContent ? (
        <>
          {/* Mobile: the step indicator (e.g. "Étape 1/3") takes the logo's place instead of
              sitting alongside it — desktop keeps both, logo on the left and the indicator
              centered in the remaining space, unchanged below. */}
          <div className="lg:hidden">{centerContent}</div>
          <Logo className="hidden h-8 w-23 lg:block" />
          <div className="hidden flex-1 items-center justify-center lg:flex">{centerContent}</div>
          <div className="hidden w-23 shrink-0 lg:block" aria-hidden="true" />
        </>
      ) : (
        <Logo className="h-8 w-23" />
      )}
    </header>
  );
}

export { WebHeader };
