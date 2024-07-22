import { useNavToggleStore, useUserStore } from '../../../../config/store';
import { RiMenuUnfold4Fill } from 'react-icons/ri';
import React from 'react';
import PostingIcon from './PostingIcon';
import LoginOrUsername from './LoginOrUsername';
interface OpenMenuIconProps {
  textColor: string;
  iconColor: string;
}

const OpenMenuIcon: React.FC<OpenMenuIconProps> = ({
  textColor,
  iconColor,
}) => {
  const toggleOpen = useNavToggleStore((state) => state.toggleOpen);
  const user = useUserStore((state) => state.user);

  return (
    <div className='flex w-full items-center justify-between'>
      <div className='flex items-center gap-2'>
        <RiMenuUnfold4Fill
          className={`my-2 ml-4 cursor-pointer text-2xl ${iconColor}`}
          onClick={toggleOpen}
        />
        {user && <PostingIcon iconColor={iconColor} />}
      </div>
      {<LoginOrUsername textColor={textColor} />}
    </div>
  );
};

export default OpenMenuIcon;
