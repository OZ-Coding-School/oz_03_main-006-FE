import React from 'react';
import { Link } from 'react-router-dom';

interface LogoAndTitleProps {
  textColor: string;
}

const LogoAndTitle: React.FC<LogoAndTitleProps> = ({ textColor }) => {
  return (
    <Link to='/' className='my-4 -ml-3 flex items-center justify-center'>
      <img src='/logo.svg' alt='한바퀴 로고' />
      <h1 className={`font-okgung text-5xl ${textColor}`}>한바퀴</h1>
    </Link>
  );
};

export default LogoAndTitle;
