import axios from 'axios';
import TagItem from './TagItem';
import { PiEyesFill } from 'react-icons/pi';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { useUserStore, useAlertStore } from '../../config/store';
import Alert from './common/Alert';
import dompurify from 'dompurify';
import { locationList } from '../data/locationList';
import { Tag, DetailPostArticle } from '../../config/types';

const sanitizer = dompurify.sanitize;

interface ArticleProps {
  article: DetailPostArticle;
}

const Article: React.FC<ArticleProps> = ({ article }) => {
  console.log(article);
  const user = useUserStore((state) => state.user);
  const setAlert = useAlertStore((state) => state.setAlert);

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [postUserId, setPostUserId] = useState<number | null>(article.user_id);
  const [postLikesCount, setPostLikesCount] = useState<number>(
    article.likes_count
  );

  useEffect(() => {
    if (user && postUserId && user.user_id === postUserId) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [user, postUserId]);

  const handleHeartToggle = async () => {
    if (!user) {
      setAlert('로그인 후 이용해주세요.');
      return;
    }
    try {
      const response = await axios.post(
        `http://43.202.53.249:8000/posts/${article.post_id}/like/`,
        {
          likes_count: postLikesCount + (isLiked ? -1 : 1),
        }
      );
      setIsLiked(!isLiked);
      setPostLikesCount(response.data.likes_count);
    } catch (error) {
      console.error(error);
    }
  };

  const getTagsArray = (tags: string): Tag[] => {
    return tags.split(',').map((content, index) => {
      return { tag_id: index + 1, content: content.trim() };
    });
  };

  const matchLocationName = (value: number) => {
    const location = locationList.find((loc) => loc.location_id === value);
    return location ? location.name : '';
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/posts/${article.post_id}`);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className='mx-auto mt-8 flex max-w-[1052px] flex-wrap'>
        <Alert></Alert>
        <div className='mb-8 w-full text-4xl font-bold'>{article.title}</div>
        <div className='mb-2 flex w-full'>
          <span className='w-40 text-xl font-semibold'>지역</span>
          <span className='text-lg'>{matchLocationName(article.region)}</span>
        </div>
        <div className='mb-3 flex w-full'>
          <span className='w-40 text-xl font-semibold'>여행기간</span>
          <span className='text-lg'>
            {article.travel_start_date}~ {article.travel_end_date}
          </span>
        </div>
        <div className='mb-6 flex h-7 w-full'>
          {getTagsArray(article.tag).map((tag, index) => (
            <TagItem tagContent={tag} showDeleteButton={false} key={index} />
          ))}
          <span className='ml-auto flex gap-2'>
            <p className='m-auto text-sm text-[#777777]'>
              {article.view_count} 회
            </p>
            <PiEyesFill className='m-auto text-base text-[#777777]' />
          </span>
        </div>
        <div className='mb-2 flex w-full'>
          <span className='mr-5 font-semibold'>{article.nickname}</span>
          <span className='my-auto text-sm text-[#777777]'>
            {article.created_at.split('T')[0]}
          </span>
          {showButton && (
            <div className='my-auto ml-auto flex justify-center gap-1 align-middle text-sm text-[#777777]'>
              <button className='cursor-pointer hover:text-[#373737]'>
                수정
              </button>
              <p>/</p>
              <button
                className='cursor-pointer hover:text-[#373737]'
                onClick={handleDelete}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        <div className='w-full border-y pb-32 pt-4'>
          <div
            className='ql-editor'
            dangerouslySetInnerHTML={{ __html: sanitizer(article.body) }}
          />
        </div>
        <div className='mb-10 mt-4 flex w-full justify-end gap-2 text-lg'>
          <p>{postLikesCount}</p>
          <button
            onClick={handleHeartToggle}
            className='my-auto cursor-pointer text-red-500'
          >
            {isLiked ? (
              <IoMdHeart className='size-6' />
            ) : (
              <IoMdHeartEmpty className='size-6' />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Article;
