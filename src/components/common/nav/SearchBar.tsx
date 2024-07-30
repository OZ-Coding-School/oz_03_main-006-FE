import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IoSearchSharp } from 'react-icons/io5';
import { Post } from '../../../../config/types';
import axios from '../../../api/axios';
import SearchResultItem from '../../SearchResultItem';

type Inputs = {
  searchValue: string;
};

interface SearchBarProps {
  textColor: string;
  backgroundColor: string;
  clickedHover: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  textColor,
  backgroundColor,
  clickedHover,
}) => {
  const { pathname } = useLocation();
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [searchError, setSearchError] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.searchValue.trim() === '') {
      setSearchError(true);
    } else {
      clearSearch();
      const { searchValue } = data;
      try {
        const response = await axios.get(`/search/?q=${searchValue}`);
        console.log(response.data.results);
        const { posts } = response.data.results;
        if (posts.length > 0) {
          setPosts(posts);
        } else {
          setSearchError(true);
        }
      } catch (error) {
        console.error('검색 실패: ', error);
        setSearchError(true);
      }
    }
  };

  const clearSearch = () => {
    reset({ searchValue: '' });
    setSearchError(false);
  };

  const isHomePage = pathname === '/';
  const border = isHomePage ? 'border-2' : 'border-2 border-[#868e96]';
  const iconColor = isHomePage ? 'text-[#727272]' : 'text-[#868e96]';

  return (
    <div className='flex w-full flex-col items-center justify-center gap-5'>
      <form className='w-full px-2' onSubmit={handleSubmit(onSubmit)}>
        <div
          className={`mx-auto flex h-11 w-full items-center justify-center gap-2 rounded-3xl ${border} gap-2`}
        >
          <IoSearchSharp
            className={`text-2xl ${iconColor} ml-3 cursor-pointer`}
          />
          <input
            className={`flex-grow bg-[#f9f9f9] ${textColor} outline-0`}
            style={{ backgroundColor }}
            type='text'
            placeholder='게시글을 검색해 보세요'
            autoComplete='off'
            {...register('searchValue', {
              required: true,
              minLength: 1,
              maxLength: 99,
            })}
          />
          <button
            className={`${iconColor} mr-3`}
            type='button'
            onClick={clearSearch}
          >
            X
          </button>
        </div>
      </form>
      {searchError && (
        <span className={`${textColor}`}>준비된 여행 이야기가 없습니다.</span>
      )}
      {!searchError && (
        <div className='flex w-full flex-col items-center justify-center gap-4 overflow-x-hidden'>
          <div className='search-scroll flex max-h-[calc(100vh-360px)] w-full flex-col scroll-smooth'>
            {posts.map((post) => (
              <SearchResultItem
                key={post.id}
                id={post.id}
                title={post.title}
                body={post.body}
                content={post.content}
                thumbnail={post.thumbnail}
                textColor={textColor}
                clickedHover={clickedHover}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
