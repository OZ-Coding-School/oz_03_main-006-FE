import { HiOutlineBellAlert } from 'react-icons/hi2';
import {
  useAlertStore,
  useLoadingAlertStore,
  usePromptStore,
} from '../../../config/store';
import { useState } from 'react';
import { BeatLoader } from 'react-spinners';

const Alert = () => {
  const { showAlert, alertMessage, clearAlert } = useAlertStore();

  if (!showAlert) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/5 shadow-md backdrop-blur-sm'>
      <div className='fixed top-40 flex h-[160px] w-[480px] flex-col rounded-md bg-white shadow-md'>
        <div className='flex items-center gap-1 rounded-t-md bg-[#28466A]'>
          <HiOutlineBellAlert className='light-white ml-3 text-[22px]' />
          <p className='light-white my-1.5 grow self-center'>알림</p>
        </div>
        <div className='flex grow flex-col p-4'>
          <div className='flex w-full grow'>
            <p className='text-lg leading-normal'>{alertMessage}</p>
          </div>
          <div className='flex w-full items-center justify-end bg-white'>
            <button
              className='light-white rounded-md bg-[#28466A] px-6 py-1.5'
              onClick={() => clearAlert()}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;

export const MyPageConfirmAlert = () => {
  const { showAlert, alertMessage, confirmResult } = useAlertStore();

  if (!showAlert) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/5 shadow-md backdrop-blur-sm'>
      <div className='fixed top-40 flex h-[160px] w-[480px] flex-col rounded-md bg-white shadow-md'>
        <div className='flex items-center gap-1 rounded-t-md bg-[#28466A]'>
          <HiOutlineBellAlert className='light-white ml-3 text-[22px]' />
          <p className='light-white my-1.5 grow self-center'>알림</p>
        </div>
        <div className='flex grow flex-col p-4'>
          <div className='flex w-full grow'>
            <p className='text-lg leading-normal'>{alertMessage}</p>
          </div>
          <div className='flex w-full items-center justify-end bg-white'>
            <button
              className='light-white rounded-md bg-[#28466A] px-6 py-1.5'
              onClick={() => confirmResult && confirmResult(true)}
            >
              확인
            </button>
            <button
              className='light-white ml-1 rounded-md bg-[#28466A] px-6 py-1.5'
              onClick={() => confirmResult && confirmResult(false)}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResetPasswordAlert = () => {
  const { showPrompt, promptMessage, clearPrompt, confirmResult } =
    usePromptStore();
  const [value, setValue] = useState('');

  if (!showPrompt) return null;

  const submitHandler = () => {
    confirmResult && confirmResult(value);
    setValue('');
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/5 shadow-md backdrop-blur-sm'>
      <div className='fixed top-40 flex h-[180px] w-[480px] flex-col rounded-md bg-white shadow-md'>
        <div className='flex items-center gap-1 rounded-t-md bg-[#28466A]'>
          <HiOutlineBellAlert className='light-white ml-3 text-[22px]' />
          <p className='light-white my-1.5 grow self-center'>알림</p>
        </div>
        <div className='flex grow flex-col p-4'>
          <div className='flex w-full grow flex-col gap-2'>
            <p className='px-1 leading-normal'>{promptMessage}</p>
            <div className='grow'>
              <input
                className='h-8 w-full rounded-md border border-solid border-slate-300 p-2 text-sm'
                type='text'
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>
          <div className='flex w-full items-center justify-end bg-white'>
            <button
              className='light-white rounded-md bg-[#28466A] px-6 py-1.5'
              onClick={submitHandler}
            >
              확인
            </button>
            <button
              className='light-white ml-1 rounded-md bg-[#28466A] px-6 py-1.5'
              onClick={() => clearPrompt()}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoadingAlert = () => {
  const { showAlert, alertMessage } = useLoadingAlertStore();

  if (!showAlert) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/5 shadow-md backdrop-blur-sm'>
      <div className='fixed top-40 flex h-[160px] w-[480px] flex-col rounded-md bg-white shadow-md'>
        <div className='flex items-center gap-1 rounded-t-md bg-[#28466A]'>
          <HiOutlineBellAlert className='light-white ml-3 text-[22px]' />
          <p className='light-white my-1.5 grow self-center'>알림</p>
        </div>
        <div className='flex grow flex-col p-4'>
          <div className='flex w-full grow flex-col items-center justify-center gap-3'>
            <p className='text-lg leading-normal'>{alertMessage}</p>
            <BeatLoader className='mx-auto' color='#005CB5' size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};
