import * as React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { LogoMark } from '@/components/layout/logo-mark';
import { Dropdown, Menu, MenuItem } from '@/components/ui';
import { useSecretaryLogout } from '@/features/auth-secretary/api';
import { FolderIcon, InboxIcon, UserCircleIcon } from '@/icons';
import { cn } from '@/lib/utils';
import { analytics, tokenStorage } from '@/services';

const TOP_NAV_ITEMS = [
  {
    to: '/secretary/inbox',
    label: 'Boîte de réception',
    icon: (isActive: boolean) => (
      <InboxIcon size={24} fillColor={isActive ? 'mainnavActivated' : 'mainnavEnabled'} />
    ),
  },
  {
    to: '/secretary/dossiers',
    label: 'Dossiers',
    icon: (isActive: boolean) => (
      <FolderIcon size={24} fillColor={isActive ? 'mainnavActivated' : 'mainnavEnabled'} />
    ),
  },
];

function SecretarySidebarItem({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: (isActive: boolean) => React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      aria-label={label}
      className={({ isActive }) =>
        cn(
          'flex h-10 w-12 shrink-0 items-center justify-center rounded-lg',
          isActive && 'bg-mainnav-sidebar-background-activated'
        )
      }
    >
      {({ isActive }) => icon(isActive)}
    </NavLink>
  );
}

// Figma node 7500:4481 ("MainNavItem", Luna-App file) — pinned to the bottom of the
// sidebar by a flex-grow spacer. Opens an account menu instead of navigating directly.
function SecretaryAccountMenu() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const { mutate: logout, isPending } = useSecretaryLogout();
  const [open, setOpen] = React.useState(false);

  const isActive = open || pathname.startsWith('/secretary/compte');

  function handleLogout() {
    // Clear the local session whether or not the API revoked the token (e.g. already expired → 401).
    logout(undefined, {
      onSettled: () => {
        tokenStorage.remove();
        analytics.reset();
        queryClient.clear();
        navigate('/pro/login', { replace: true });
      },
    });
  }

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      side="right"
      align="end"
      trigger={
        <button
          type="button"
          aria-label="Mon compte"
          className={cn(
            'flex h-10 w-12 shrink-0 items-center justify-center rounded-lg',
            isActive && 'bg-mainnav-sidebar-background-activated'
          )}
        >
          <UserCircleIcon size={24} fillColor={isActive ? 'mainnavActivated' : 'mainnavEnabled'} />
        </button>
      }
    >
      <Menu>
        <MenuItem
          label="Mon compte"
          onClick={() => {
            setOpen(false);
            navigate('/secretary/compte');
          }}
        />
        <MenuItem
          label={isPending ? 'Déconnexion…' : 'Se déconnecter'}
          color="danger"
          disabled={isPending}
          onClick={handleLogout}
        />
      </Menu>
    </Dropdown>
  );
}

function SecretarySidebar({ className }: { className?: string }) {
  return (
    <aside className={cn('flex h-full w-12 shrink-0 flex-col items-center', className)}>
      <div className="flex h-20 w-full shrink-0 items-center justify-center">
        <div className="bg-heading-primary flex size-12 items-center justify-center rounded-lg">
          <LogoMark className="size-6" />
        </div>
      </div>
      <nav className="flex w-full flex-1 flex-col items-center gap-1">
        {TOP_NAV_ITEMS.map(item => (
          <SecretarySidebarItem key={item.to} {...item} />
        ))}
        <div className="flex-1" aria-hidden="true" />
        <SecretaryAccountMenu />
      </nav>
    </aside>
  );
}

export { SecretarySidebar };
