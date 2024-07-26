import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlertStore, useUserStore } from '../../config/store';
import { AxiosError } from 'axios';
import axios from '../api/axios';
import Alert from '../components/common/Alert';

const AuthCallbackPage = () => {
  const setUser = useUserStore((state) => state.setUser);
  const setAlert = useAlertStore((state) => state.setAlert);
  const navigate = useNavigate();

  const getUserData = async () => {
    const token = Cookies.get('jwt') || null;
    if (!token) {
      console.error('소셜로그인 토큰 확인 실패');
      setAlert('로그인 중 문제가 발생했습니다. 다시 시도해 주세요.');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('/users/accounts/user', {
        withCredentials: true,
      });
      console.log('response: ', response);
      setUser(response.data);
      setAlert('로그인 되었습니다. 홈페이지로 이동합니다.');
      navigate('/');
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        console.error('소셜로그인 유저정보 응답 실패: ', error);
        setAlert('로그인에 실패했습니다. 다시 시도해 주세요.');
        navigate('/login');
      } else {
        console.error('소셜로그인 유저정보 요청 실패: ', error);
        setAlert('로그인 중 문제가 발생했습니다. 다시 시도해 주세요.');
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div>
      <h2>로그인 처리 중...</h2>
      <Alert />
    </div>
  );
};

export default AuthCallbackPage;
