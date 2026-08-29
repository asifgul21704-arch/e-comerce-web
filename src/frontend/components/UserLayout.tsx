import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserNavbar } from './UserNavbar';
import { UserFooter } from './UserFooter';

export const UserLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 font-sans">
      <UserNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <UserFooter />
    </div>
  );
};
