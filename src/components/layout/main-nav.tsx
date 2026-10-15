import * as React from 'react';

import { NavLink } from 'react-router-dom';

import { Logo } from '@/components/layout/logo';
import { WebHeader } from '@/components/layout/web-header';
import { DirectoryIcon, FolderIcon, HomeIcon, UserCircleIcon } from '@/icons';
import { cn } from '@/lib/utils';
import { AnalyticsEvent, analytics } from '@/services';
import type { MainNavItemProps, MainNavProps } from '@/types';

/** `CLICK_MAIN_SECTION`'s `section_name` — keyed by route so both the desktop pill nav and
 * the mobile burger menu (same items, see `DESKTOP_ITEMS`/`MOBILE_ITEMS` below) track through
 * one place. */
const SECTION_NAME_BY_PATH: Record<string, 'accueil' | 'annuaire' | 'dossier' | 'compte'> = {
  '/home': 'accueil',
  '/annuaire': 'annuaire',
  '/dossier': 'dossier',
  '/compte': 'compte',
};

const MainNavItem = React.forwardRef<HTMLAnchorElement, MainNavItemProps>(function MainNavItem(
  { to, label, icon, mobile = false, className, onClick, ...props },
  ref
) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const sectionName = SECTION_NAME_BY_PATH[to];
    if (sectionName) {
      analytics.track(AnalyticsEvent.ClickMainSection, {
        section_name: sectionName,
        nav_location: mobile ? 'mobile_menu' : 'header',
      });
    }
    onClick?.(event);
  }

  return (
    <NavLink
      ref={ref}
      to={to}
      onClick={handleClick}
      className={({ isActive }) =>
        cn(
          'flex h-12 shrink-0 items-center gap-2 rounded-2xl px-4',
          mobile ? 'w-full' : 'justify-center',
          isActive
            ? 'bg-mainnav-background-activated text-mainnav-activated'
            : 'text-mainnav-enabled bg-white',
          className
        )
      }
      {...props}
    >
      {({ isActive }) => (
        <>
          <span className="size-6 shrink-0">{icon(isActive)}</span>
          <span className="text-sm font-medium whitespace-nowrap">{label}</span>
        </>
      )}
    </NavLink>
  );
});

const DESKTOP_ITEMS = [
  {
    to: '/home',
    label: 'Accueil',
    icon: (isActive: boolean) => (
      <HomeIcon size={24} fillColor={isActive ? 'mainnavActivated' : 'mainnavEnabled'} />
    ),
  },
  {
    to: '/annuaire',
    label: 'Annuaire',
    icon: (isActive: boolean) => (
      <DirectoryIcon size={24} fillColor={isActive ? 'mainnavActivated' : 'mainnavEnabled'} />
    ),
  },
  {
    to: '/dossier',
    label: 'Dossier',
    icon: (isActive: boolean) => (
      <FolderIcon size={24} fillColor={isActive ? 'mainnavActivated' : 'mainnavEnabled'} />
    ),
  },
];

const ACCOUNT_ITEM_DESKTOP = {
  to: '/compte',
  label: 'Mon compte',
  icon: (isActive: boolean) => (
    <UserCircleIcon size={24} fillColor={isActive ? 'mainnavActivated' : 'mainnavEnabled'} />
  ),
};

const MOBILE_ITEMS = [
  ...DESKTOP_ITEMS,
  {
    to: '/compte',
    label: 'Compte',
    icon: (isActive: boolean) => (
      <UserCircleIcon size={24} fillColor={isActive ? 'mainnavActivated' : 'mainnavEnabled'} />
    ),
  },
];

function MainNav({ className, ...props }: MainNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn('relative w-full', className)} {...props}>
      <div className="hidden h-18 w-full items-center justify-between bg-white px-6 lg:flex">
        <div className="flex w-50 shrink-0 items-center">
          <Logo className="h-8 w-23" />
        </div>
        <nav className="flex flex-1 items-center justify-center gap-2">
          {DESKTOP_ITEMS.map(item => (
            <MainNavItem key={item.to} {...item} />
          ))}
        </nav>
        <div className="flex w-50 shrink-0 items-center justify-end">
          <MainNavItem {...ACCOUNT_ITEM_DESKTOP} />
        </div>
      </div>

      <div className="lg:hidden">
        <WebHeader onMenuToggle={() => setIsOpen(open => !open)} />
        {isOpen && (
          <nav
            className="absolute inset-x-4 top-full z-20 flex flex-col gap-2 rounded-2xl bg-white/80 p-2 shadow-[0_0_16px_0_rgba(0,0,0,0.16)] backdrop-blur-sm"
            aria-label="Navigation principale"
          >
            {MOBILE_ITEMS.map(item => (
              <MainNavItem key={item.to} {...item} mobile onClick={() => setIsOpen(false)} />
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

export { MainNav, MainNavItem };
