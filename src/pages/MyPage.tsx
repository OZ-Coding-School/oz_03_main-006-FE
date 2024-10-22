import { Link, useNavigate } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';
import { FaUserEdit } from 'react-icons/fa';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useConfirmAlertStore, useUserStore } from '../../config/store';
import ProfileImage from '../components/ProfileImage';
import { FaRegUser } from 'react-icons/fa';
import axiosInstance from '../api/axios';
import { FaPersonWalkingLuggage } from 'react-icons/fa6';
import { MyPageConfirmAlert } from '../components/common/Alert';
import { Post } from '../../config/types';
import PostCard from '../components/PostCard';
import Pagination from 'react-js-pagination';
import { RxDoubleArrowLeft, RxDoubleArrowRight } from 'react-icons/rx';

const MyPage = () => {
  const navigate = useNavigate();

  const { user, setUser, updateProfileImage, clearUser } = useUserStore(
    (state) => state
  );

  const [edit, setEdit] = useState(false);
  const [profileEdit, setProfileEdit] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [img, setImg] = useState(user?.profile_image || '');
  const { showConfirmAlert, setConfirmAlert } = useConfirmAlertStore();
  const [userPost, setUserPost] = useState<Post[]>([]);
  const [postClick, setPostClick] = useState('myPosts');
  const [isPagination, setIsPagination] = useState(false);
  const [isOtherPage, setIsOtherPage] = useState(false);
  const [imgFile, setImgFile] = useState<File>();
  const [page, setPage] = useState<number>(1);

  const postPerPage: number = 8;
  const indexOfLastPost: number = page * postPerPage;
  const indexOfFirstPost: number = indexOfLastPost - postPerPage;

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(`/users/accounts/user`, {
        withCredentials: true,
      });
      const userData = response.data;
      setUser(userData);
      setNickname(userData.nickname);
      setImg(userData.profile_image);
      updateProfileImage(userData.profile_image);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleLogout = useCallback(async () => {
    try {
      const confirmed = await setConfirmAlert('로그아웃 하시겠습니까?');
      if (confirmed) {
        await axiosInstance.post(
          `/users/accounts/logout`,
          {},
          { withCredentials: true }
        );
        clearUser();
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed', error);
    }
  }, [setConfirmAlert, clearUser, navigate]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      handleMyPost();
    }
  }, [user, navigate]);

  const handleEdit = useCallback(() => {
    setEdit((edit) => !edit);
    setProfileEdit((edit) => !edit);
  }, []);

  const handleNickname = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setNickname(e.target.value);
    },
    []
  );

  const handleNewNick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (user) {
        try {
          const formData = new FormData();
          formData.append('nickname', nickname);
          if (imgFile) {
            formData.append('profile_image', imgFile);
          }
          await axiosInstance.put(`users/accounts/edit`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          });

          // 수정 후 사용자 정보 다시 가져오기
          await fetchUserData();

          setEdit(false);
          setProfileEdit(false);
        } catch (error) {
          console.error('Profile update failed', error);
        }
      }
    },
    [user, nickname, imgFile]
  );

  const handleCancle = () => {
    if (user) {
      setNickname(user.nickname);
      setImg(user.profile_image || '');
    }
    setEdit(false);
    setProfileEdit(false);
  };

  const handleFileSelect = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setImgFile(file);
    setImg(imageUrl);
  };

  const sortedPosts = useCallback((posts: Post[]) => {
    return [...posts].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, []);

  const handleMyPost = useCallback(() => {
    if (user) {
      setPage(1);

      const fetchUserPost = async () => {
        try {
          const response = await axiosInstance.get(`posts/user/${user.id}`, {
            withCredentials: true,
          });
          const sort: Post[] = sortedPosts(response.data);
          setUserPost(sort);
          setIsPagination(sort.length > 0);
          setIsOtherPage(sort.length === 0);
        } catch (error) {
          console.log(error);
        }
      };
      fetchUserPost();
      setPostClick('myposts');
    }
  }, [user, sortedPosts]);

  const handleHeartPost = useCallback(async () => {
    if (user) {
      setPage(1);
      try {
        const response = await axiosInstance.get(
          `posts/user/${user.id}/liked_posts/`,
          {
            withCredentials: true,
          }
        );
        const sort: Post[] = sortedPosts(response.data);
        setUserPost(sort);
        setIsPagination(sort.length > 0);
        setIsOtherPage(sort.length > 0);
      } catch (error) {
        console.log(error);
      }
      setPostClick('likedPosts');
    }
  }, [user, sortedPosts]);

  const handleDelete = useCallback(async () => {
    const confirmed = await setConfirmAlert('정말 탈퇴를 하시겠습니까?');
    if (confirmed) {
      try {
        await axiosInstance.delete(`/users/accounts/delete`, {
          withCredentials: true,
        });
        clearUser();
        navigate('/login');
      } catch (error) {
        console.log('회원탈퇴 Error: ', error);
      }
    }
  }, [setConfirmAlert, clearUser, navigate]);

  const currentPosts = useMemo(() => {
    return userPost.slice(indexOfFirstPost, indexOfLastPost);
  }, [indexOfFirstPost, indexOfLastPost, userPost]);

  const memoPostCard = useMemo(
    () => currentPosts.map((post) => <PostCard key={post.id} post={post} />),
    [currentPosts]
  );

  return (
    <div className='flex min-h-screen w-screen flex-col'>
      <div className='left-0 top-0 z-10 w-screen bg-white'>
        <Link to='/' className='flex items-center py-[20px] pl-[30px]'>
          <img src='/logo.svg' alt='한바퀴 로고' className='w-9' />
          <h1 className={'font-okgung text-2xl text-black'}>한바퀴</h1>
        </Link>
      </div>

      <main className='flex-grow'>
        {showConfirmAlert && <MyPageConfirmAlert />}
        <div className='mx-auto w-[1200px]'>
          <div className='mt-12 h-full px-8'>
            <div className='flex justify-between'>
              <div className='flex'>
                {profileEdit ? (
                  <ProfileImage
                    setImg={setImg}
                    onFileSelect={handleFileSelect}
                    img={img}
                    setImgFile={setImgFile}
                    // setImgPreString={setImgPreString}
                    // userId={user?.id ?? 0} // user.id가 undefined일 경우 0을 사용
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
              <div className='flex w-[1000px] text-xl'>
                <div className='flex'>
                  <button
                    className={`border-b-2 px-6 pb-3 ${postClick === 'myposts' ? 'border-b-[#28466A]' : 'border-b-2 text-gray-500'}`}
                    onClick={handleMyPost}
                    value={'mypost'}
                  >
                    나의 게시글
                  </button>
                  <button
                    className={`border-b-2 px-6 pb-3 ${postClick === 'likedPosts' ? 'border-b-[#28466A]' : 'border-b-2 text-gray-500'}`}
                    onClick={handleHeartPost}
                    value={'likepost'}
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
              {userPost.length > 0 ? (
                <>
                  <div className='mt-12 grid grid-cols-2 gap-6'>
                    {memoPostCard}
                  </div>
                  <Pagination
                    activePage={page}
                    itemsCountPerPage={postPerPage}
                    totalItemsCount={userPost.length}
                    pageRangeDisplayed={5}
                    prevPageText={'<'}
                    nextPageText={'>'}
                    onChange={handlePageChange}
                    itemClass='pagination-item'
                    linkClass='pagination-link'
                    activeClass='active'
                    activeLinkClass=''
                    firstPageText={<RxDoubleArrowLeft />}
                    lastPageText={<RxDoubleArrowRight />}
                    itemClassFirst='pagination-nav'
                    itemClassLast='pagination-nav'
                    itemClassPrev='pagination-nav'
                    itemClassNext='pagination-nav'
                    disabledClass='disabled'
                  />
                </>
              ) : !isOtherPage && !isPagination ? (
                <>
                  <div className='mx-auto mt-52 flex items-center justify-center text-2xl text-gray-700'>
                    <div className='text-center'>
                      <div className='mb-4 flex'>
                        관심있는 여행 게시물을 찾아보세요!
                        <FaPersonWalkingLuggage className='ml-3 mt-1' />
                      </div>

                      <Link
                        to={'/community/1'}
                        className='cursor-pointer text-blue-700/50 hover:border-b-2'
                      >
                        게시물 보러 가기!
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='mx-auto mt-52 flex items-center justify-center text-2xl text-gray-700'>
                    <span className='font-semibold'>
                      {`${user?.nickname}`}&nbsp;
                    </span>
                    님의 여행이야기를 들려주세요.
                    <FaPersonWalkingLuggage className='ml-3' />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className='w-full p-4 text-right'>
        <p
          className='text-sm text-red-500 hover:cursor-pointer'
          onClick={handleDelete}
        >
          회원탈퇴
        </p>
      </footer>
    </div>
  );
};

export default MyPage;
