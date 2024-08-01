import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { LoginUser } from '../../config/types';
import { useAlertStore } from '../../config/store';
import { useUserStore } from '../../config/store';
import { AxiosError } from 'axios';
import axios from '../api/axios';
import Alert from './common/Alert';

const Login = () => {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const { showAlert, setAlert } = useAlertStore();
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
    clearValue();
    try {
      const { nickname, password } = data;
      const response = await axios.post(
        '/users/accounts/login',
        {
          nickname,
          password,
        },
        {
          withCredentials: true,
        }
      );
      setUser(response.data);
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

  const handleChangePassword = async () => {
    const userEmail = prompt(
      '비밀번호 변경 링크를 전달 받을 이메일 주소를 입력해주세요.'
    );
    console.log('userEmail: ', userEmail);
    if (userEmail) {
      try {
        const response = await axios.post(
          '/users/accounts/password-reset/',
          {
            email: userEmail,
          },
          {
            withCredentials: true,
          }
        );
        console.log('response: ', response);
      } catch (error) {
        console.error('error: ', error);
      }
    }
    return;
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
              id='nickname'
              placeholder='사용자 이름'
              {...register('nickname', {
                required: '사용자 이름을 입력해주세요',
                minLength: 2,
                maxLength: 12,
                pattern: /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/i,
              })}
            />
            {errors.nickname && (
              <p className='px-2 text-xs text-red-500'>* 2~12글자 사이입니다</p>
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
              <p className='px-2 text-xs text-red-500'>* 8글자 이상입니다</p>
            )}
            <button
              className='mt-1 h-12 w-full rounded-md bg-[#28466A] font-chosun text-white'
              type='submit'
            >
              로그인
            </button>
            <div className='mt-2 flex items-center justify-center gap-3 text-sm'>
              <span className='text-[#9aa0a6]'>비밀번호를 잊으셨나요?</span>
              <span
                className='cursor-pointer font-semibold text-[#868e96] underline'
                onClick={handleChangePassword}
              >
                비밀번호 변경하기
              </span>
            </div>
          </form>
        </div>
      </div>
      {showAlert && <Alert />}
    </div>
  );
};

export default Login;
