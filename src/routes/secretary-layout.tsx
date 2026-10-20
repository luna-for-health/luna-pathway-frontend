import { Outlet } from 'react-router-dom';

import { SecretarySidebar } from '@/components/layout';

export default function SecretaryLayout() {
  return (
    <div className="bg-neutral-05 flex h-screen w-full gap-4 overflow-hidden p-4">
      <SecretarySidebar />
      <Outlet />
    </div>
  );
}
