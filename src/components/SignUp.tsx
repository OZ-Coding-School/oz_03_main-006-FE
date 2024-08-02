import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SignUpUser } from '../../config/types';
import { useAlertStore } from '../../config/store';
import { AxiosError } from 'axios';
import axios from '../api/axios';
import Alert from './common/Alert';

const SignUp = () => {
  const setAlert = useAlertStore((state) => state.setAlert);
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<SignUpUser>({
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const onSubmit: SubmitHandler<SignUpUser> = async (data) => {
    clearValue();
    try {
      const { nickname, email, password } = data;
      await axios.post('/users/accounts/register', {
        nickname,
        email,
        password,
      });
      setAlert('회원가입이 완료되었습니다. 로그인 후 이용해 주세요.');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('회원가입 실패: ', error);
        if (error.response.status === 400) {
          const { nickname, email } = error.response.data;
          if (nickname) {
            setAlert('이미 사용중인 이름입니다.');
          } else if (email) {
            setAlert('이미 사용중인 이메일입니다.');
          } else {
            setAlert('이미 사용중인 사용자 입니다.');
          }
        } else {
          setAlert('회원가입에 실패했습니다. 다시 시도해 주세요.');
        }
      } else {
        console.error('회원가입 실패: ', error);
        setAlert('회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const clearValue = () => {
    reset({
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div className='signUp-active h-full w-full bg-[#28466A]'>
      <div className='h-full w-full px-8 py-4'>
        <div className='flex h-full w-full flex-col'>
          <div className='flex h-[100px] items-center justify-center'>
            <Link to='/'>
              <img src='/logo.svg' />
            </Link>
          </div>
          <form
            className='flex w-full grow flex-col items-center gap-3 py-2'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='flex w-full flex-col gap-2'>
              <input
                className='bg-[#f4f4f4]] light-white h-12 w-full rounded-md border border-[#f9f9f9] bg-[#28466A] p-2 text-sm'
                type='text'
                autoComplete='off'
                placeholder='사용자 이름'
                {...register('nickname', {
                  required: '필수 항목입니다.',
                  minLength: 2,
                  maxLength: 12,
                  pattern: /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+$/i,
                })}
              />
              {errors.nickname && (
                <p className='light-white px-2 text-xs'>
                  * 2~12글자 사이의 한글, 영문, 숫자만 가능합니다
                </p>
              )}
              <input
                className='bg-[#f4f4f4]] light-white h-12 w-full rounded-md border border-[#f9f9f9] bg-[#28466A] p-2 text-sm'
                type='email'
                id='email'
                autoComplete='off'
                placeholder='이메일'
                {...register('email', {
                  required: '필수 항목입니다.',
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                })}
              />
              {errors.email && (
                <p className='light-white px-2 text-xs'>
                  * 유효한 이메일 주소를 입력해주세요
                </p>
              )}
              <input
                className='bg-[#f4f4f4]] light-white h-12 w-full rounded-md border border-[#f9f9f9] bg-[#28466A] p-2 text-sm'
                type='password'
                id='password'
                placeholder='비밀번호'
                {...register('password', {
                  required: '필수 항목입니다.',
                  pattern:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
                })}
              />
              {errors.password && (
                <p className='light-white px-2 text-xs'>
                  * 8글자 이상이며 영문, 숫자, 특수문자를 모두 포함해야 합니다
                </p>
              )}
              <input
                className='bg-[#f4f4f4]] light-white h-12 w-full rounded-md border border-[#f9f9f9] bg-[#28466A] p-2 text-sm'
                type='password'
                id='confirmPassword'
                placeholder='비밀번호 확인'
                {...register('confirmPassword', {
                  required: true,
                  validate: {
                    check: (confirmPassword) => {
                      if (getValues('password') !== confirmPassword) {
                        return '비밀번호가 일치하지 않습니다';
                      }
                    },
                  },
                })}
              />
              {errors.confirmPassword && (
                <p className='light-white px-2 text-xs'>
                  * 비밀번호가 일치하지 않습니다
                </p>
              )}
            </div>
            <button
              className='h-12 w-full rounded-md bg-[#f4f4f4] font-chosun'
              type='submit'
            >
              회원가입
            </button>
          </form>
        </div>
      </div>
      <Alert />
    </div>
  );
};

export default SignUp;
