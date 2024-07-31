import { Link, useNavigate } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';
import { FaUserEdit } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useAlertStore, useUserStore } from '../../config/store';
import ProfileImage from '../components/ProfileImage';
import { FaRegUser } from 'react-icons/fa';
import axiosInstance from '../api/axios';
import { FaPersonWalkingLuggage } from 'react-icons/fa6';
import { MyPageConfirmAlert } from '../components/common/Alert';
import { Post } from '../../config/types';
import PostCard from '../components/PostCard';
import Pagination from 'react-js-pagination';

const MyPage = () => {
  const navigate = useNavigate();

  const { user, setUser, updateProfileImage, clearUser } = useUserStore(
    (state) => state
  );

  const [edit, setEdit] = useState(false);
  const [profileEdit, setProfileEdit] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [img, setImg] = useState(user?.profile_image || '');
  const { showConfirmAlert } = useAlertStore((state) => state);
  const [userPostCheck, setUserPostCheck] = useState(false);
  const [userPost, setUserPost] = useState<Post[]>([]);
  const [postClick, setPostClick] = useState('myPosts');
  // const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      // const { showConfirmAlert } = useAlertStore.getState();
      const confirmed = await showConfirmAlert('로그아웃 하시겠습니까?');
      if (confirmed) {
        await axiosInstance.post(
          `/users/accounts/logout`,
          {},
          { withCredentials: true }
        );
        clearUser();
        console.log('logout');
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user) {
      // user.id = 1;
      handleMyPost();
    }
  }, [user, navigate]);

  const handleEdit = () => {
    setEdit((edit) => !edit);
    setProfileEdit((edit) => !edit);
  };

  const handleNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNickname(e.target.value);
  };

  const handleNewNick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEdit((edit) => !edit);
    setProfileEdit((edit) => !edit);
    if (user) {
      setUser({ ...user, nickname: nickname });
      updateProfileImage(img);
      try {
        const response = await axiosInstance.post(
          `/users/accounts/profile/edit`,
          {
            // id: user.id,
            nickname: nickname,
            profile_image: img,
            // password: user.
            email: user.email,
            password: 'asdfasdf1!',
          },
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
      } catch (error) {
        console.error('Profile update failed', error);
      }
    }
  };

  const handleCancle = () => {
    if (user && user.nickname) {
      setNickname(user.nickname);
    }
    if (user && user?.profile_image) {
      setImg(user?.profile_image);
    }
    setEdit((edit) => !edit);
    setProfileEdit((edit) => !edit);
  };

  const handleFileSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    console.log('Selected file:', file);
    console.log('Image URL:', imageUrl);
  };

  const handleMyPost = () => {
    if (user) {
      // user.id = 1;
      const fetchUserPost = async () => {
        try {
          const response = await axiosInstance.get(`posts/user/${user.id}`);
          console.log(response);
          console.log(response.data);
          setUserPost(response.data);
          if (response.data.length === 0) {
            setUserPostCheck(false);
            console.log('check: false');
          } else {
            setUserPostCheck(true);
            console.log('check: true');
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchUserPost();
      setPostClick('myposts');
    }
  };

  const handleHeartPost = () => {
    return setUserPost([]), setUserPostCheck(true), setPostClick('likedPosts');
  };

  useEffect(() => {
    console.log('Current img state:', img);
  }, [img]);

  return (
    <div className='flex min-h-screen w-screen flex-col'>
      <div className='left-0 top-0 z-10 w-screen bg-white'>
        <Link to='/' className='flex items-center py-[20px] pl-[30px]'>
          <img src='/logo.svg' alt='한바퀴 로고' className='w-9' />
          <h1 className={'font-okgung text-2xl text-black'}>한바퀴</h1>
        </Link>
      </div>

      <main className='flex-grow'>
        <MyPageConfirmAlert></MyPageConfirmAlert>
        <div className='mx-auto w-[1200px]'>
          <div className='mt-12 h-full px-8'>
            <div className='flex justify-between'>
              <div className='flex'>
                {profileEdit ? (
                  <ProfileImage
                    setImg={setImg}
                    onFileSelect={handleFileSelect}
                    img={img}
                    // profile_img={user?.profile_image}
                    // updateProfileImage={updateProfileImage}
                  />
                ) : (
                  <div>
                    {user?.profile_image ? (
                      <img
                        src={user.profile_image}
                        className='size-28 rounded-full text-3xl'
                        alt='프로필 이미지'
                      />
                    ) : (
                      <div className='flex size-28 items-center justify-center overflow-hidden rounded-full bg-[#28466A]'>
                        <FaRegUser className='light-white bg-[#28466A] text-[60px]' />
                      </div>
                    )}
                  </div>
                )}

                {edit ? (
                  <div className='my-auto ml-8'>
                    <div className='mb-2 pl-1 text-sm font-semibold'>
                      닉네임
                    </div>
                    <input
                      placeholder='닉네임을 수정해주세요.'
                      className='rounded-md border border-gray-300 py-1 pl-3 text-lg focus:border-[#28466A] focus:outline-none'
                      onChange={handleNickname}
                      value={nickname}
                    />
                  </div>
                ) : (
                  <span className='ml-8 mt-12 text-xl font-bold'>
                    {user?.nickname}
                  </span>
                )}
              </div>
              <div className='my-auto mr-4 flex text-xl'>
                {edit ? (
                  <>
                    <button
                      onClick={handleCancle}
                      className='mr-2 rounded-lg px-3 py-1 text-sm text-[#28466A]'
                    >
                      취소
                    </button>
                    <button
                      onClick={handleNewNick}
                      className='mr-5 rounded-lg bg-[#28466A] px-3 py-1 text-sm text-white hover:bg-[#1a2e46]'
                    >
                      수정
                    </button>
                  </>
                ) : (
                  <FaUserEdit
                    className='mr-4 cursor-pointer'
                    onClick={handleEdit}
                  />
                )}
                <MdLogout
                  className='my-auto cursor-pointer'
                  onClick={handleLogout}
                />
              </div>
            </div>

            <hr className='mt-8' />

            <div className='mt-8 flex justify-between'>
              <div className='flex w-[1000px] justify-center text-xl'>
                <div className='flex'>
                  <button
                    className={`border-b-2 px-6 pb-3 ${postClick === 'myposts' ? 'border-b-[#28466A] text-2xl' : 'border-b-2'}`}
                    px-4
                    onClick={handleMyPost}
                  >
                    나의 게시글
                  </button>
                  <button
                    className={`border-b-2 px-6 pb-3 ${postClick === 'likedPosts' ? 'border-b-[#28466A] text-2xl' : 'border-b-2'}`}
                    onClick={handleHeartPost}
                  >
                    좋아요 게시글
                  </button>
                </div>
              </div>
              <Link
                to={'/posting'}
                className='my-auto rounded-lg border border-[#28466A] bg-white px-4 py-1 text-sm font-semibold text-[#28466A] hover:bg-[#f9fbff]'
              >
                게시글 작성
              </Link>
            </div>
            <div>
              {userPostCheck && userPost ? (
                <div className='mt-12 grid grid-cols-2 gap-6'>
                  {userPost.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className='mx-auto mt-52 flex items-center justify-center text-2xl text-gray-700'>
                  <span className='font-semibold'>
                    {`${user?.nickname}`}&nbsp;
                  </span>
                  님의 여행이야기를 들려주세요.
                  <FaPersonWalkingLuggage className='ml-3' />
                </div>
              )}
            </div>
            {/* <Pagination /> */}
          </div>
        </div>
      </main>

      <footer className='w-full p-4 text-right'>
        <p className='text-sm text-red-500' onClick={handleLogout}>
          회원탈퇴
        </p>
      </footer>
    </div>
  );
};

export default MyPage;
