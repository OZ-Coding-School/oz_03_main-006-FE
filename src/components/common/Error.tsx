import React from 'react';
import { Link } from 'react-router-dom';

interface ErrorProps {
  status: number;
}

const Error: React.FC<ErrorProps> = ({ status }) => {
  status = 404;
  return (
    <>
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='p-40 text-center'>
          <p className='text-stroke-blue mb-5 text-center font-okgung text-9xl tracking-wider text-blue-500 drop-shadow-[6px_4px_#244C7C]'>
            {status}
          </p>
          <div className='mb-16 text-xl font-bold text-gray-700'>
            페이지를 찾는 데 문제가 생겼어요. &nbsp;지도에서 다른 장소를
            찾아보세요!
          </div>
          <Link to={'/'}>
            <button className='rounded-full bg-slate-900 px-10 py-3 text-lg text-white hover:bg-slate-800'>
              지도로 돌아가기
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Error;
