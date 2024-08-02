import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = () => {
  return (
    <div className='flex min-h-screen w-screen'>
      <NavBar />
      <div className='grow'>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
