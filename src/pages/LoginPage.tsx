import { useEffect, useState } from 'react';
import Login from '../components/Login';
import SignUp from '../components/SignUp';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [activeAnimation, setActiveAnimation] = useState<boolean>(false);

  const handleTabClick = (tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setActiveAnimation(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveAnimation(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [activeAnimation]);

  const handleAnimation = activeAnimation ? 'fade-in' : '';
  const handleLoginShadow = activeTab === 'login' ? 'login-button-shadow' : '';
  const handleSignUpShadow =
    activeTab === 'signUp' ? 'signUp-button-shadow' : '';

  return (
    <div className='] h-screen w-screen'>
      <div className='fixed flex h-full w-full items-center justify-center'>
        <div className='h-[640px] w-[460px] bg-transparent'>
          <div className='flex h-full w-full flex-col p-8'>
            <div className='grid h-[50px] w-full grid-cols-2 items-center gap-0.5 text-center'>
              <div
                className={`login-button-radius ${handleLoginShadow} ${handleAnimation} flex h-full cursor-pointer items-center justify-center bg-[#f9f9f9]`}
                onClick={() => handleTabClick('login')}
              >
                <p className='font-chosun text-lg font-semibold'>로그인</p>
              </div>
              <div
                className={`signUp-button-radius ${handleSignUpShadow} ${handleAnimation} light-white flex h-full cursor-pointer items-center justify-center bg-[#28466A]`}
                onClick={() => handleTabClick('signUp')}
              >
                <p className='font-chosun text-lg font-semibold'>회원가입</p>
              </div>
            </div>
            <div className={`grow ${handleAnimation}`}>
              {activeTab === 'login' ? <Login /> : <SignUp />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;