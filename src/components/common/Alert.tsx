import { HiOutlineBellAlert } from 'react-icons/hi2';
import {
  useAlertStore,
  useConfirmAlertStore,
  useLoadingAlertStore,
  usePromptStore,
} from '../../../config/store';
import React, { useRef, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { useCloseAlert } from '../../hooks/useCloseAlert';

const Alert = () => {
  const { showAlert, alertMessage, clearAlert } = useAlertStore();
  const ref = useRef(null);

  if (!showAlert) return;

  useCloseAlert(ref, clearAlert);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/5 shadow-md backdrop-blur-sm'>
      <div
        className='fixed top-40 flex h-[160px] w-[480px] flex-col rounded-md bg-white shadow-md'
        ref={ref}
      >
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
  const { showConfirmAlert, alertMessage, confirmResult, clearConfirmAlert } =
    useConfirmAlertStore();
  const ref = useRef(null);

  if (!showConfirmAlert) return;

  useCloseAlert(ref, clearConfirmAlert);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/5 shadow-md backdrop-blur-sm'>
      <div
        className='fixed top-40 flex h-[160px] w-[480px] flex-col rounded-md bg-white shadow-md'
        ref={ref}
      >
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
  const ref = useRef(null);

  if (!showPrompt) return;

  const submitHandler = () => {
    if (confirmResult) {
      confirmResult(value);
      setValue('');
    }
    return;
  };

  const inputKeyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitHandler();
    } else if (e.key === 'Escape') {
      clearPrompt();
    }
  };

  useCloseAlert(ref, clearPrompt);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/5 shadow-md backdrop-blur-sm'>
      <div
        className='fixed top-40 flex h-[185px] w-[480px] flex-col rounded-md bg-white shadow-md'
        ref={ref}
      >
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
                onKeyDown={inputKeyHandler}
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
              onClick={clearPrompt}
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
  const { showLoadingAlert, alertMessage } = useLoadingAlertStore();

  if (!showLoadingAlert) return;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/5 shadow-md backdrop-blur-sm'>
      <div className='fixed top-40 flex h-[160px] w-[480px] flex-col rounded-md bg-white shadow-md'>
        <div className='flex items-center gap-1 rounded-t-md bg-[#28466A]'>
          <HiOutlineBellAlert className='light-white ml-3 text-[22px]' />
          <p className='light-white my-1.5 grow self-center'>알림</p>
        </div>
        <div className='flex grow flex-col p-3'>
          <div className='flex w-full grow flex-col items-center justify-center gap-3'>
            <p className='text-lg leading-normal'>{alertMessage}</p>
            <BeatLoader className='mx-auto' color='#005CB5' size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};
