import { useLocation } from 'react-router-dom';
import { useNavToggleStore } from '../../../config/store';
import LogoAndTitle from './nav/LogoAndTitle';
import Subtitle from './nav/Subtitle';
import OpenMenuIcon from './nav/OpenMenuIcon';
import CloseMenuIcon from './nav/CloseMenuIcon';
import Tab from './nav/Tab';

const NavBar = () => {
  const isOpen = useNavToggleStore((state) => state.isOpen);
  const { pathname } = useLocation();

  const isHomePage = pathname === '/';
  const backgroundColor = isHomePage ? '#f9f9f9' : '#28466A';
  const iconColor = isHomePage ? 'text-[#727272]' : 'light-white';
  const textColor = isHomePage ? 'text-black' : 'light-white';
  const userIconColor = isHomePage
    ? 'light-white bg-[#28466A]'
    : 'text-[#28466A] bg-[#f9f9f9]';

  return (
    <div
      className={`${isOpen ? 'min-w-[392px]' : 'min-w-[60px]'}`}
      style={{ backgroundColor }}
    >
      {isOpen ? (
        <OpenMenuIcon textColor={textColor} iconColor={iconColor} />
      ) : (
        <CloseMenuIcon iconColor={iconColor} userIconColor={userIconColor} />
      )}
      {isOpen && <LogoAndTitle textColor={textColor} />}
      {isOpen && <Subtitle textColor={textColor} />}
      {isOpen && (
        <Tab textColor={textColor} backgroundColor={backgroundColor} />
      )}
    </div>
  );
};

export default NavBar;
