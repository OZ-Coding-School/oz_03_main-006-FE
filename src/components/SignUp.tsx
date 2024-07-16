import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <div className='signUp-active h-full w-full bg-[#28466A]'>
      <div className='h-full w-full px-8 py-4'>
        <div className='flex h-full w-full flex-col py-2'>
          <div className='flex h-[70px] items-center justify-center'>
            <Link to='/'>
              <img src='/logo.svg' />
            </Link>
          </div>
          <form className='flex w-full grow flex-col items-center gap-2 py-2'>
            <ul className='flex w-full flex-col gap-2'>
              <li>
                <input
                  className='bg-[#f4f4f4]] light-white h-11 w-full rounded-md border border-[#f9f9f9] bg-[#28466A] p-2 text-sm'
                  type='text'
                  name='name'
                  autoComplete='off'
                  placeholder='이름 혹은 닉네임'
                />
              </li>
              <li>
                <input
                  className='bg-[#f4f4f4]] light-white h-11 w-full rounded-md border border-[#f9f9f9] bg-[#28466A] p-2 text-sm'
                  type='email'
                  name='email'
                  id='email'
                  placeholder='이메일'
                />
              </li>
              <li>
                <input
                  className='bg-[#f4f4f4]] light-white h-11 w-full rounded-md border border-[#f9f9f9] bg-[#28466A] p-2 text-sm'
                  type='password'
                  name='password'
                  id='password'
                  placeholder='비밀번호'
                />
              </li>
              <li>
                <input
                  className='bg-[#f4f4f4]] light-white h-11 w-full rounded-md border border-[#f9f9f9] bg-[#28466A] p-2 text-sm'
                  type='password'
                  name='confirmPassword'
                  id='confirmPassword'
                  placeholder='비밀번호 확인'
                />
              </li>
            </ul>
            <button
              className='h-11 w-full rounded-md bg-[#f4f4f4] font-chosun'
              type='submit'
              name='submit'
            >
              회원가입
            </button>
          </form>
          <div>
            <div className='grid grid-cols-3 items-center justify-center'>
              <div className='h-[1px] bg-[#BFBFBF]'></div>
              <p className='self-stretch text-center font-chosun text-sm text-[#f4f4f4]'>
                소셜 회원가입
              </p>
              <div className='h-[1px] bg-[#BFBFBF]'></div>
            </div>
            <div className='flex h-[90px] items-center justify-center gap-8'>
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
    </div>
  );
};

export default SignUp;
