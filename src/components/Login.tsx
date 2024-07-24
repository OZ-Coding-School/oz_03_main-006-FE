import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoginUser } from '../../config/types';
import { useAlertStore } from '../../config/store';
import Alert from './common/Alert';
import axios, { AxiosError } from 'axios';
import { useUserStore } from '../../config/store';

const Login = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const setAlert = useAlertStore((state) => state.setAlert);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginUser>({
    defaultValues: {
      nickname: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginUser> = async (data) => {
    console.log(data);
    clearValue();
    try {
      const { nickname, password } = data;
      const response = await axios.post(
        'http://43.203.170.167:8000/users/accounts/login',
        {
          nickname,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log('response: ', response);
      // response에 user_id 들어오는지 확인, profile_image null값으로 보내달라할건지?
      setUser({ nickname });
      setAlert('로그인 되었습니다. 홈페이지로 이동합니다.');
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('로그인 실패: ', error);
        if (error.response.status === 403) {
          setAlert('가입되지 않은 사용자입니다. 다시 시도해 주세요.');
        } else {
          setAlert('로그인에 실패했습니다. 다시 시도해 주세요.');
        }
      } else {
        console.error('로그인 실패: ', error);
        setAlert('로그인 중 문제가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const clearValue = () => {
    reset({
      nickname: '',
      password: '',
    });
  };

  return (
    <div className='login-active h-full w-full bg-[#f9f9f9]'>
      <div className='h-full w-full px-6 py-4'>
        <div className='flex h-full w-full flex-col'>
          <div className='flex h-[100px] items-center justify-center'>
            <Link to='/'>
              <img src='/logo.svg' />
            </Link>
          </div>
          <form
            className='flex grow flex-col gap-2 py-2'
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              className='h-12 w-full rounded-md border border-solid border-slate-300 p-2 text-sm'
              type='text'
              id='username'
              placeholder='닉네임'
              {...register('nickname', {
                required: '닉네임을 입력해주세요',
                minLength: 2,
                maxLength: 12,
                pattern: /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/i,
              })}
            />
            {errors.nickname && (
              <p className='px-2 text-xs text-red-500'>
                * 닉네임은 2~12글자 사이입니다
              </p>
            )}
            <input
              className='h-12 w-full rounded-md border border-solid border-slate-300 p-2 text-sm'
              type='password'
              id='password'
              placeholder='비밀번호'
              {...register('password', {
                required: '비밀번호를 입력해주세요',
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
              })}
            />
            {errors.password && (
              <p className='px-2 text-xs text-red-500'>
                * 비밀번호는 8글자 이상입니다
              </p>
            )}
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
          <div className='flex h-[100px] items-center justify-center gap-10'>
            <Link to='https://kauth.kakao.com/oauth/authorize'>
              <img src='/kakao-logo.svg' />
            </Link>
            <Link
              to='https://accounts.google.com/o/oauth2/v2/auth'
              className='flex h-[49px] w-[49px] items-center justify-center rounded-full bg-white'
            >
              <img src='/google-logo.svg' className='h-8 w-8' />
            </Link>
          </div>
        </div>
      </div>
      {<Alert />}
    </div>
  );
};

export default Login;
