import React from 'react';
import { Link } from 'react-router-dom';
import { RiMenuFold4Fill } from 'react-icons/ri';
import { useNavToggleStore, useUserStore } from '../../../../config/store';
import PostingIcon from './PostingIcon';
import UserProfile from './UserProfile';

interface CloseMenuIconProps {
  iconColor: string;
  userIconColor: string;
}

const CloseMenuIcon: React.FC<CloseMenuIconProps> = ({
  iconColor,
  userIconColor,
}) => {
  const toggleOpen = useNavToggleStore((state) => state.toggleOpen);
  const user = useUserStore((state) => state.user);

  return (
    <div className='flex flex-col items-center justify-center'>
      <RiMenuFold4Fill
        className={`mx-4 my-2 cursor-pointer text-2xl ${iconColor}`}
        onClick={toggleOpen}
      />
      <Link to='/'>
        <img
          src='/logo.svg'
          className='ml-1 h-[44px] w-[44px]'
          alt='한바퀴 로고'
        />
      </Link>
      {user && (
        <div className='my-2.5 flex flex-col items-center justify-center gap-4'>
          <UserProfile userIconColor={userIconColor} />
          <PostingIcon iconColor={iconColor} />
        </div>
      )}
    </div>
  );
};

export default CloseMenuIcon;
