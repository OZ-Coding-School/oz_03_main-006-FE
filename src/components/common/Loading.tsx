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
