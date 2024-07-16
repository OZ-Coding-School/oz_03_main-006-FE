import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className='login-active h-full w-full bg-[#f9f9f9]'>
      <div className='h-full w-full px-6 py-4'>
        <div className='flex h-full w-full flex-col'>
          <div className='flex h-[100px] items-center justify-center'>
            <Link to='/'>
              <img src='/logo.svg' />
            </Link>
          </div>
          <form className='flex grow flex-col items-center gap-2 py-2'>
            <input
              className='h-12 w-full rounded-md border border-solid border-slate-300 p-2 text-sm'
              type='text'
              name='email'
              id='email'
              placeholder='이메일'
            />
            <input
              className='h-12 w-full rounded-md border border-solid border-slate-300 p-2 text-sm'
              type='password'
              name='password'
              id='password'
              placeholder='비밀번호'
            />
            <button
              className='h-12 w-full rounded-md bg-[#28466A] font-chosun text-white'
              type='submit'
            >
              로그인
            </button>
          </form>
          <div className='grid grid-cols-3 items-center justify-center'>
            <div className='h-[1px] bg-[#BFBFBF]'></div>
            <p className='self-stretch text-center font-chosun text-sm'>
              소셜 로그인
            </p>
            <div className='h-[1px] bg-[#BFBFBF]'></div>
          </div>
          <div className='flex h-[100px] items-center justify-center gap-6'>
            <Link to='/'>
              <img src='/kakao-logo.svg' />
            </Link>
            <Link
              to='/'
              className='flex h-[49px] w-[49px] items-center justify-center rounded-full bg-white'
            >
              <img src='/google-logo.svg' className='h-8 w-8' />
            </Link>
            <Link to='/'>
              <img src='/naver-logo.svg' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
