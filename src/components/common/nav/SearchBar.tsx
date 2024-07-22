import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IoSearchSharp } from 'react-icons/io5';
import { Post } from '../../../../config/types';
import postsData from '../../../data/posts.json';
import SearchResultItem from '../../SearchResultItem';

type Inputs = {
  searchValue: string;
};

interface SearchBarProps {
  textColor: string;
  iconColor: string;
  backgroundColor: string;
}

const posts: Post[] = postsData;

const SearchBar: React.FC<SearchBarProps> = ({
  textColor,
  iconColor,
  backgroundColor,
}) => {
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

  const clearSearch = () => {
    reset({ searchValue: '' });
    setSearchError(false);
  };

  return (
    <div className='my-8 flex flex-col items-center justify-center gap-8'>
      <form className='min-w-[328px] px-2' onSubmit={handleSubmit(onSubmit)}>
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
      <div className='mx-auto flex max-w-[360px] flex-col items-center justify-center gap-4 overflow-x-hidden'>
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
    </div>
  );
};

export default SearchBar;
