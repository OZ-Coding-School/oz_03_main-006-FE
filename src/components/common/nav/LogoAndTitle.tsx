import React from 'react';
import { Link } from 'react-router-dom';

interface LogoAndTitleProps {
  textColor: string;
}

const LogoAndTitle: React.FC<LogoAndTitleProps> = ({ textColor }) => {
  return (
    <Link to='/' className='my-3 -ml-3 flex items-center justify-center'>
      <img src='/logo.svg' alt='한바퀴 로고' />
      <span className={`font-okgung text-5xl ${textColor}`}>한바퀴</span>
    </Link>
  );
};

export default LogoAndTitle;
