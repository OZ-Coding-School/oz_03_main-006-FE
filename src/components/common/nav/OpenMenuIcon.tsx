import { useNavToggleStore } from '../../../../config/store';
import { RiMenuUnfold4Fill } from 'react-icons/ri';
import { User } from '../../../../config/types';
import React, { useState } from 'react';
import PostingIcon from './PostingIcon';
import LoginOrUsername from './LoginOrUsername';
//import userData from '../../data/user.json';

interface OpenMenuIconProps {
  textColor: string;
  iconColor: string;
}

const OpenMenuIcon: React.FC<OpenMenuIconProps> = ({
  textColor,
  iconColor,
}) => {
  const toggleOpen = useNavToggleStore((state) => state.toggleOpen);
  const [userData, setUserData] = useState<User | null>(null);

  return (
    <div className='flex w-full items-center justify-between'>
      <div className='flex items-center gap-2'>
        <RiMenuUnfold4Fill
          className={`my-2 ml-4 cursor-pointer text-2xl ${iconColor}`}
          onClick={toggleOpen}
        />
        {userData && <PostingIcon iconColor={iconColor} />}
      </div>
      {<LoginOrUsername textColor={textColor} />}
    </div>
  );
};

export default OpenMenuIcon;
