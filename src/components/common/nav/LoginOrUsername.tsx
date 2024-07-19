import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../../../config/types';
//import userData from '../../../data/user.json';

interface LoginOrUsernameProps {
  textColor: string;
}

const LoginOrUsername: React.FC<LoginOrUsernameProps> = ({ textColor }) => {
  const [userData, setUserData] = useState<User | null>(null);

  return userData ? (
    <Link to='/mypage'>
      <p
        className={`mx-4 text-lg ${textColor} font-chosun`}
      >{`${userData.nickname ? userData.nickname : userData.username} 님`}</p>
    </Link>
  ) : (
    <Link to='/login'>
      <p className={`mx-4 text-lg ${textColor} font-chosun`}>로그인</p>
    </Link>
  );
};

export default LoginOrUsername;
