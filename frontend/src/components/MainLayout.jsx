import './layout.css'; // 👈 import your CSS

const MainLayout = () => {
  return (
    <>
      <div className="sidebar"> <LeftSidebar /> </div>
      <div className="main-content"> <Outlet /> </div>
    </>
  );
};

export default MainLayout