import axios from '../api/axios';
import {
  useAlertStore,
  useLoadingAlertStore,
  usePromptStore,
} from '../../config/store';
import { LoadingAlert, ResetPasswordAlert } from './common/Alert';
import { AxiosError } from 'axios';
import { useState } from 'react';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const showConfirmPrompt = usePromptStore((state) => state.showConfirmPrompt);
  const clearPrompt = usePromptStore((state) => state.clearPrompt);
  const setAlert = useAlertStore((state) => state.setAlert);
  const showLoadingAlert = useLoadingAlertStore((state) => state.showAlert);
  const setLoadingAlert = useLoadingAlertStore(
    (state) => state.setLoadingAlert
  );

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleResetPassword = async () => {
    const userEmail = await showConfirmPrompt(
      '가입시 입력한 이메일 주소를 입력해 주세요.'
    );
    if (userEmail.trim() !== '') {
      try {
        setIsLoading(true);
        setLoadingAlert('처리중입니다. 잠시만 기다려 주세요.');
        const response = await axios.post('/users/accounts/password-reset/', {
          email: userEmail,
        });
        const url = new URL(response.data.reset_url);
        const token = url.searchParams.get('token');
        setIsLoading(false);
        if (token) {
          const newPassword = await showConfirmPrompt(
            '새롭게 설정할 비밀번호를 입력해 주세요. (8글자 이상이며 영문, 숫자, 특수문자를 모두 포함해야 합니다.)'
          );
          // 비밀번호 유효성 검사
          if (newPassword.trim() !== '') {
            if (!passwordRegex.test(newPassword)) {
              setAlert(
                '8글자 이상이며 영문, 숫자, 특수문자를 모두 포함해야 합니다.'
              );
            } else {
              try {
                await axios.post('/users/accounts/password-reset/confirm', {
                  token,
                  password: newPassword,
                });
                setAlert(
                  '비밀번호가 변경되었습니다. 로그인 후 이용해 주세요. '
                );
              } catch (error) {
                console.error(error);
                setAlert(
                  '사용자 인증 과정에서 문제가 발생했습니다. 다시 시도해 주세요.'
                );
              }
            }
          } else {
            setAlert('유효하지 않은 비밀번호 입니다.');
          }
        } else {
          clearPrompt();
          setAlert('처리중 문제가 발생했습니다. 다시 시도해 주세요.');
        }
      } catch (error) {
        setIsLoading(false);
        console.error('error: ', error);
        if (error instanceof AxiosError && error.response) {
          clearPrompt();
          if (error.response.status === 400 || error.response.status === 404) {
            setAlert('가입되지 않은 사용자 입니다.');
          } else {
            setAlert('처리중 문제가 발생했습니다. 다시 시도해 주세요.');
          }
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      clearPrompt();
    }
  };

  return (
    <div className='mt-2 flex items-center justify-center gap-3 text-sm'>
      <span className='text-[#9aa0a6]'>비밀번호를 잊으셨나요?</span>
      <span
        className='cursor-pointer font-semibold text-[#868e96] underline'
        onClick={handleResetPassword}
      >
        비밀번호 변경하기
      </span>
      <ResetPasswordAlert />
      {isLoading && showLoadingAlert && <LoadingAlert />}
    </div>
  );
};

export default ResetPassword;
