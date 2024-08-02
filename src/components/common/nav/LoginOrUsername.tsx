import React from 'react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../../../config/store';

interface LoginOrUsernameProps {
  textColor: string;
}

const LoginOrUsername: React.FC<LoginOrUsernameProps> = ({ textColor }) => {
  const user = useUserStore((state) => state.user);

  return user ? (
    <Link to='/mypage'>
      <p
        className={`mx-4 text-lg ${textColor} font-chosun`}
      >{`${user.nickname} 님`}</p>
    </Link>
  ) : (
    <Link to='/login'>
      <p className={`mx-4 text-lg ${textColor} font-chosun`}>로그인</p>
    </Link>
  );
};

export default LoginOrUsername;
