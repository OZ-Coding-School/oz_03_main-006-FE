import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IoSearchSharp } from 'react-icons/io5';
import { useNavToggleStore } from '../../../config/store';
import { useForm, SubmitHandler } from 'react-hook-form';
import postsData from '../../data/posts.json';
//import userData from '../../data/user.json';
import SearchResultItem from '../SearchResultItem';
import { Post, User } from '../../../config/types';
import LogoAndTitle from './nav/LogoAndTitle';
import Subtitle from './nav/Subtitle';
import OpenMenuIcon from './nav/OpenMenuIcon';
import CloseMenuIcon from './nav/CloseMenuIcon';

type Inputs = {
  searchValue: string;
};

const posts: Post[] = postsData;

const NavBar = () => {
  const isOpen = useNavToggleStore((state) => state.isOpen);
  const { pathname } = useLocation();
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [searchError, setSearchError] = useState(false);
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (data.searchValue.trim() === '') {
      setSearchError(true);
    } else {
      clearSearch();
      // 검색 로직
      console.log(data);
    }
  };
  const [userData, setUserData] = useState<User | null>(null);
  //console.log(userData);

  const isHomePage = pathname === '/';
  const backgroundColor = isHomePage ? '#f9f9f9' : '#28466A';
  const iconColor = isHomePage ? 'text-[#727272]' : 'light-white';
  const textColor = isHomePage ? 'text-black' : 'light-white';
  const userIconColor = isHomePage
    ? 'light-white bg-[#28466A]'
    : 'text-[#28466A] bg-[#f9f9f9]';

  const clearSearch = () => {
    reset({ searchValue: '' });
    setSearchError(false);
  };

  // const renderLogoAndTitle = (): React.ReactNode => {
  //   return (
  //     isOpen && (
  //       <Link to='/' className='my-4 -ml-3 flex items-center justify-center'>
  //         <img src='/logo.svg' alt='한바퀴 로고' />
  //         <h1 className={`font-okgung text-5xl ${textColor}`}>한바퀴</h1>
  //       </Link>
  //     )
  //   );
  // };

  // const renderMenuIcon = (): React.ReactNode => {
  //   return (
  //     <div className='flex items-center justify-between'>
  //       {isOpen ? (
  //         <div className='flex w-full items-center justify-between'>
  //           <div className='flex items-center gap-2'>
  //             <RiMenuUnfold4Fill
  //               className={`my-2 ml-4 cursor-pointer text-2xl ${iconColor}`}
  //               onClick={toggleOpen}
  //             />
  //             {userData && (
  //               <Link to='/posting'>
  //                 <PiPencilLine className={`text-2xl ${iconColor}`} />
  //               </Link>
  //             )}
  //           </div>
  //           {userData ? (
  //             <Link to='/mypage'>
  //               <p
  //                 className={`mx-4 text-lg ${textColor} font-chosun`}
  //               >{`${userData.nickname ? userData.nickname : userData.username} 님`}</p>
  //             </Link>
  //           ) : (
  //             <Link to='/login'>
  //               <p className={`mx-4 text-lg ${textColor} font-chosun`}>
  //                 로그인
  //               </p>
  //             </Link>
  //           )}
  //         </div>
  //       ) : (
  //         <RiMenuFold4Fill
  //           className={`mx-4 my-2 cursor-pointer text-2xl ${iconColor}`}
  //           onClick={toggleOpen}
  //         />
  //       )}
  //     </div>
  //   );
  // };

  // const renderPostingIcon = () => {
  //   if (!isOpen) {
  //     return (
  //       <div className='flex flex-col items-center justify-center gap-2'>
  //         <Link to='/'>
  //           <img
  //             src='/logo.svg'
  //             className='ml-1 h-[44px] w-[44px]'
  //             alt='한바퀴 로고'
  //           />
  //         </Link>
  //         {!isOpen && userData && (
  //           <div className='flex flex-col items-center justify-center gap-4'>
  //             <Link
  //               to='mypage'
  //               className={`flex h-[30px] w-[30px] items-center justify-center rounded-full ${userIconColor}`}
  //             >
  //               <FaRegUser className={`text-lg ${userIconColor}`} />
  //             </Link>
  //             <Link to='/posting'>
  //               <PiPencilLine
  //                 className={`cursor-pointer text-2xl ${iconColor}`}
  //               />
  //             </Link>
  //           </div>
  //         )}
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  // const renderLoginIcon = (): React.ReactNode => {
  //   if (isOpen) {
  //     return (
  //       <p
  //         className={`mx-auto my-6 w-[312px] text-center font-chosun text-xl ${textColor}`}
  //       >
  //         한국을 한(韓)바퀴 돌아보세요
  //       </p>
  //     );
  //   }
  // };

  const renderSearchBar = () => {
    return (
      isOpen && (
        <div className='my-8 flex flex-col items-center justify-center'>
          <form
            className='min-w-[328px] px-2'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='mx-auto flex items-center justify-center gap-2 border-b-2 py-1'>
              <IoSearchSharp className={`text-2xl ${iconColor}`} />
              <input
                className={`flex-grow bg-[#f9f9f9] text-lg ${textColor} outline-0`}
                style={{ backgroundColor }}
                type='text'
                placeholder='전체 게시글 중 검색'
                autoComplete='off'
                {...register('searchValue', {
                  required: true,
                  minLength: 1,
                  maxLength: 99,
                })}
              />
              <button
                className={`${iconColor}`}
                type='button'
                onClick={clearSearch}
              >
                X
              </button>
            </div>
          </form>
          {searchError && (
            <span className={`${textColor}`}>검색 결과가 없습니다.</span>
          )}
        </div>
      )
    );
  };

  const renderSearchResult = () => {
    return (
      isOpen && (
        <div className='mx-auto my-8 flex max-w-[360px] flex-col items-center justify-center gap-4 overflow-x-hidden'>
          <div className='search-scroll flex max-h-[calc(100vh-318px)] max-w-[360px] flex-col gap-4 scroll-smooth px-5'>
            {posts.map((post) => (
              <SearchResultItem
                key={post.post_id}
                title={post.title}
                body={post.body}
                representative_image_id={post.representative_image_id}
                textColor={textColor}
              />
            ))}
          </div>
        </div>
      )
    );
  };

  return (
    <div
      className={`nav-bar ${isOpen ? 'w-[392px]' : 'w-[60px]'}`}
      style={{ backgroundColor }}
    >
      <div>
        {isOpen ? (
          <OpenMenuIcon textColor={textColor} iconColor={iconColor} />
        ) : (
          <CloseMenuIcon iconColor={iconColor} userIconColor={userIconColor} />
        )}
        {isOpen && <LogoAndTitle textColor={textColor} />}
        {isOpen && <Subtitle textColor={textColor} />}
        {renderSearchBar()}
        {renderSearchResult()}
      </div>
    </div>
  );
};

export default NavBar;
