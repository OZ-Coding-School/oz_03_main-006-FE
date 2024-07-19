import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiMenuFold4Fill } from 'react-icons/ri';
import { FaRegUser } from 'react-icons/fa';
import { useNavToggleStore } from '../../../../config/store';
import PostingIcon from './PostingIcon';
//import userData from '../../data/user.json';
import { User } from '../../../../config/types';

interface CloseMenuIconProps {
  iconColor: string;
  userIconColor: string;
}

const CloseMenuIcon: React.FC<CloseMenuIconProps> = ({
  iconColor,
  userIconColor,
}) => {
  const toggleOpen = useNavToggleStore((state) => state.toggleOpen);
  const [userData, setUserData] = useState<User | null>(null);

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
      {userData && (
        <div className='flex flex-col items-center justify-center gap-4'>
          <Link
            to='mypage'
            className={`flex h-[30px] w-[30px] items-center justify-center rounded-full ${userIconColor}`}
          >
            <FaRegUser className={`text-lg ${userIconColor}`} />
          </Link>
          <PostingIcon iconColor={iconColor} />
        </div>
      )}
    </div>
  );
};

export default CloseMenuIcon;
