import { Outlet } from 'react-router-dom';

import { MainNav } from '@/components/layout';

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-white">
      <MainNav />
      <Outlet />
    </div>
  );
}
