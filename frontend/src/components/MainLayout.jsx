import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';

const MainLayout = () => {
  return (
    <>
      <LeftSidebar />
      <div className="ml-64 p-4">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
