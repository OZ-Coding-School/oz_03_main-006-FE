import React from 'react';
import { FaRegUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../../../config/store';

interface UserProfileProps {
  userIconColor: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userIconColor }) => {
  const user = useUserStore((state) => state.user);

  return (
    <Link
      to='mypage'
      className={`flex h-[30px] w-[30px] items-center justify-center rounded-full ${userIconColor}`}
    >
      {user?.profile_image ? (
        <img src={user.profile_image} className='rounded-full' />
      ) : (
        <FaRegUser className={`text-lg ${userIconColor}`} />
      )}
    </Link>
  );
};

export default UserProfile;
