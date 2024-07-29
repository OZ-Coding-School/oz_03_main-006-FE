import { useLocation } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='text-center'>
        <span className='mb-7 block text-2xl font-semibold text-gray-700'>
          여행 이야기를 준비 중이에요! &nbsp;잠시만 기다려 주세요.
        </span>
        <BeatLoader className='mx-auto' color='#005CB5' size={23} />
      </div>
    </div>
  );
};

export default Loading;

export const LoadingRanking = () => {
  const { pathname } = useLocation();

  const textColor = pathname === '/' ? '' : 'light-white';
  const spinnerColor = pathname === '/' ? '#005CB5' : '#fff';

  return (
    <div className='my-10 flex w-full flex-col items-center justify-center gap-6'>
      <div
        className={`text-lg font-semibold ${textColor} flex flex-col items-center justify-center gap-1`}
      >
        <span>여행 이야기를 준비 중이에요!</span>
        <span>잠시만 기다려 주세요.</span>
      </div>
      <BeatLoader className='mx-auto' color={`${spinnerColor}`} size={15} />
    </div>
  );
};
