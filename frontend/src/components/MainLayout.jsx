import { Outlet } from 'react-router-dom';
import './layout.css'; // 👈 import your CSS
import LeftSidebar from './LeftSidebar';

const MainLayout = () => {
  return (
    <>
      <div className="sidebar"> <LeftSidebar /> </div>
      <div className="main-content"> <Outlet /> </div>
    </>
  );
};

export default MainLayout