import { Link, useNavigate } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { FaUserEdit } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import userData from '../data/user.json';
import { useUserStore } from '../../config/store';
import ProfileImage from '../components/ProfileImage';
import { FaRegUser } from 'react-icons/fa';

const MyPage = () => {
  const [edit, setEdit] = useState(false);
  const [profileEdit, setProfileEdit] = useState(false);

  const navigate = useNavigate();

  const { user, setUser, updateProfileImage } = useUserStore((state) => state);

  const [nickname, setNickname] = useState(user?.nickname || '');
  const [img, setImg] = useState(user?.profile_image || '');

  const handleLogout = async () => {
    navigate('/');
  };

  useEffect(() => {
    if (!user) {
      // setUser({...userData})
      // updateProfileImage(userData.profile_image)
      navigate('/');
    }
  }, [user]);

  // console.log(userData)

  const handleEdit = () => {
    console.log('edit');
    setEdit((edit) => !edit);
    setProfileEdit((edit) => !edit);
  };
  console.log(edit);

  const handleNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log(e.target.value);
    console.log(user);
    setNickname(e.target.value);
  };
  console.log(user?.nickname);

  const handleNewNick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEdit((edit) => !edit);
    setProfileEdit((edit) => !edit);
    if (user) {
      setUser({ ...user, nickname: nickname });
      updateProfileImage(img);
    }
  };

  console.log(profileEdit);

  const handleCancle = () => {
    if (user && user.nickname) {
      setNickname(user.nickname);
    }
    if (user && user.profile_image) {
      setImg(user.profile_image);
    }
    setEdit((edit) => !edit);
    setProfileEdit((edit) => !edit);
  };

  const handleFileSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    console.log(imageUrl);
    setImg(imageUrl);
    updateProfileImage(imageUrl);
    console.log('Selected file:', file);
    console.log('Image URL:', imageUrl);
  };

  useEffect(() => {
    console.log('Current img state:', img);
  }, [img]);

  console.log(user?.profile_image);
  console.log(img);

  return (
    <>
      <form className='flex justify-center'>
        <div className=''>
          <div className='left-0 top-0 z-10 w-screen bg-white'>
            <Link to='/' className='flex items-center py-[20px] pl-[30px]'>
              <img src='/logo.svg' alt='한바퀴 로고' className='w-9' />
              <h1 className={'font-okgung text-2xl text-black'}>한바퀴</h1>
            </Link>
          </div>

          <div className='mx-auto max-w-[1200px]'>
            <div className='mt-12 px-8'>
              <div className='flex justify-between'>
                <div className='flex'>
                  {/* <img src="/logo.svg" alt="사용자 이미지" className="w-[160px]"/> */}
                  {profileEdit ? (
                    <>
                      <ProfileImage
                        setImg={setImg}
                        updateProfileImage={updateProfileImage}
                        profile_img={user?.profile_image}
                        onFileSelect={handleFileSelect}
                      />
                    </>
                  ) : (
                    <div>
                      {img ? (
                        <img
                          src={img}
                          className='h-32 w-32 rounded-full text-3xl'
                        />
                      ) : (
                        <div className='flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[#28466A]'>
                          <FaRegUser className='light-white bg-[#28466A] text-[100px]' />
                        </div>
                      )}
                    </div>
                  )}

                  {edit ? (
                    <>
                      <input
                        placeholder='닉네임을 수정해주세요.'
                        className='border-gray my-12 ml-8 rounded-md border border-2'
                        onChange={handleNickname}
                        value={nickname}
                      />
                    </>
                  ) : (
                    <span className='ml-8 mt-12 font-bold'>
                      {user?.nickname}
                    </span>
                  )}
                </div>
                <div className='mr-4 mt-12 flex text-xl'>
                  {edit ? (
                    <>
                      <button
                        onClick={handleCancle}
                        className='mr-4 h-[23px] rounded bg-[#28466A] px-2 text-sm text-white'
                      >
                        취소
                      </button>
                      <button
                        onClick={handleNewNick}
                        className='mr-4 h-[23px] rounded bg-[#28466A] px-2 text-sm text-white'
                      >
                        수정
                      </button>
                    </>
                  ) : (
                    <FaUserEdit className='mr-4' onClick={handleEdit} />
                  )}
                  <MdLogout onClick={handleLogout} />
                </div>
              </div>

              <hr className='mt-8' />

              <div className='mt-8 flex justify-between'>
                <p className='text-2xl'>나의 게시글</p>
                <Link
                  to={'/posting'}
                  className='rounded bg-[#28466A] px-2 py-2 text-[10px] text-white'
                >
                  게시글 작성
                </Link>
              </div>

              <div className='mt-12 grid grid-cols-2 gap-6'>
                사용자가 좋아요 누른 포스터들
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default MyPage;
