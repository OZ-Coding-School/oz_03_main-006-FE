import { HiOutlineBellAlert } from 'react-icons/hi2';
import { useAlertStore } from '../../../config/store';
import { useNavigate } from 'react-router-dom';

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

export const ConfirmAlert = () => {
  const { showAlert, alertMessage, clearAlert } = useAlertStore();
  const navigate = useNavigate();

  const handleConfirm = () => {
    clearAlert();
    navigate(-1);
  };

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
              onClick={handleConfirm}
            >
              확인
            </button>
            <button
              className='light-white ml-1 rounded-md bg-[#28466A] px-6 py-1.5'
              onClick={() => clearAlert()}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
