import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RiMenuFold4Fill, RiMenuUnfold4Fill } from 'react-icons/ri';
import { PiPencilLine } from 'react-icons/pi';
import { IoSearchSharp } from 'react-icons/io5';
import { useNavToggleStore } from '../../../config/store';
import { useForm, SubmitHandler } from 'react-hook-form';
import postsData from '../../data/posts.json';
import userData from '../../data/user.json';
import SearchResultItem from '../SearchResultItem';
import { Post } from '../../../config/types';

type Inputs = {
  searchValue: string;
};

const posts: Post[] = postsData;

const NavBar = () => {
  const { isOpen, toggleOpen } = useNavToggleStore();
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
  //const [userData, setUserData] = useState(null);
  //console.log(userData);

  const isHomePage = pathname === '/';
  const backgroundColor = isHomePage ? '#f9f9f9' : '#28466A';
  const iconColor = isHomePage ? 'text-[#727272]' : 'light-white';
  const textColor = isHomePage ? 'text-black' : 'light-white';

  const clearSearch = () => {
    reset({ searchValue: '' });
    setSearchError(false);
  };

  const renderLogoAndTitle = (): React.ReactNode => {
    return (
      isOpen && (
        <Link to='/' className='mb-6 flex items-center justify-center'>
          <img src='/logo.svg' alt='한바퀴 로고' />
          <h1 className={`font-okgung text-5xl ${textColor}`}>한바퀴</h1>
        </Link>
      )
    );
  };

  const renderMenuIcon = (): React.ReactNode => {
    return (
      <div className='flex items-center justify-between'>
        {isOpen ? (
          <RiMenuUnfold4Fill
            className={`mx-4 my-2 cursor-pointer text-2xl ${iconColor}`}
            onClick={toggleOpen}
          />
        ) : (
          <RiMenuFold4Fill
            className={`mx-4 my-2 cursor-pointer text-2xl ${iconColor}`}
            onClick={toggleOpen}
          />
        )}
        {isOpen && userData && (
          <Link to='/posting'>
            <PiPencilLine
              className={`mx-4 my-2 cursor-pointer text-2xl ${iconColor}`}
            />
          </Link>
        )}
      </div>
    );
  };

  const renderPostingIcon = () => {
    if (!isOpen) {
      return (
        <div className='flex flex-col items-center justify-center gap-2'>
          <Link to='/'>
            <img src='/logo.svg' className='ml-2' alt='한바퀴 로고' />
          </Link>
          {!isOpen && userData && (
            <div className='flex flex-col items-center justify-center gap-5'>
              <Link to='mypage'>
                <img
                  src='/logo.svg'
                  className='ml-1 h-[52px] w-[52px] rounded-full bg-[#F4F4F4]'
                  alt='프로필 이미지'
                />
              </Link>
              <Link to='/posting'>
                <PiPencilLine
                  className={`cursor-pointer text-4xl ${iconColor}`}
                />
              </Link>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderLoginIcon = (): React.ReactNode => {
    if (isOpen) {
      return userData ? (
        <Link
          to='mypage'
          className='mx-8 my-3 flex w-[328px] items-center gap-3'
        >
          <img
            src='/logo.svg'
            className='ml-1 h-[52px] w-[52px] rounded-full bg-[#F4F4F4]'
            alt='프로필 이미지'
          />
          <p
            className={`flex-grow text-xl ${textColor}`}
          >{`${userData.nickname} 님`}</p>
        </Link>
      ) : (
        <div className='my-3 flex items-center justify-center gap-10'>
          <Link to='/'>
            <img src='/naver-logo.svg' alt='네이버 로그인' />
          </Link>
          <Link to='/'>
            <img src='/kakao-logo.svg' alt='카카오 로그인' />
          </Link>
        </div>
      );
    }
  };

  const renderSearchBar = () => {
    return (
      isOpen && (
        <div className='flex flex-col items-center justify-center'>
          <form
            className='min-w-[328px] px-2'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='mx-auto my-3 flex items-center justify-center gap-1 border-b-2 py-2'>
              <IoSearchSharp className={`text-2xl ${iconColor}`} />
              <input
                className={`flex-grow bg-[#f9f9f9] px-1 text-xl ${textColor} outline-0`}
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
        <div className='mx-auto my-6 flex max-w-[360px] flex-col items-center justify-center gap-4 overflow-x-hidden'>
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
      className={`nav-bar ${isOpen ? 'w-[392px]' : 'w-[100px]'}`}
      style={{ backgroundColor }}
    >
      <div>
        {renderMenuIcon()}
        {renderLogoAndTitle()}
        {renderPostingIcon()}
        {renderLoginIcon()}
        {renderSearchBar()}
        {renderSearchResult()}
      </div>
    </div>
  );
};

export default NavBar;
