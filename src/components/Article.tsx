import axios from '../api/axios';
import TagItem from './TagItem';
import { PiEyesFill } from 'react-icons/pi';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { useUserStore, useAlertStore } from '../../config/store';
import Alert from './common/Alert';
import dompurify from 'dompurify';
import { Tag, DetailPostArticle } from '../../config/types';
import { useNavigate } from 'react-router-dom';

const sanitizer = dompurify.sanitize;

interface ArticleProps {
  article: DetailPostArticle;
}

const Article: React.FC<ArticleProps> = ({ article }) => {
  const user = useUserStore((state) => state.user);
  const setAlert = useAlertStore((state) => state.setAlert);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [postLikesCount, setPostLikesCount] = useState<number>(
    article.likes_count
  );

  const postUserId = article.user_id;
  const navigate = useNavigate();

  console.log(article.tag);

  useEffect(() => {
    if (user && postUserId && user.id === postUserId) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [user, postUserId]);

  useEffect(() => {
    setIsLiked(null);
    setPostLikesCount(article.likes_count);

    const checkIfLiked = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `/posts/${article.id}/like/?user_id=${user.id}`
          );
          setIsLiked(response.data.result);
        } catch (error) {
          console.error(error);
        }
      }
    };
    checkIfLiked();
  }, [article.id, user, article.likes_count]);

  const handleHeartToggle = async () => {
    if (!user) {
      setAlert('로그인 후 이용해주세요.');
      return;
    }
    try {
      const response = await axios.post(
        `/posts/${article.id}/like/`,
        { user_id: user.id },
        {
          withCredentials: true,
        }
      );
      if (response.status === 201) {
        setPostLikesCount((prev) => prev + 1);
      } else if (response.status === 204) {
        setPostLikesCount((prev) => prev - 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error(error);
    }
  };

  const getTagsArray = (tags: string): Tag[] => {
    return tags
      .split(',')
      .map((content) => content.trim())
      .filter((content) => content !== '')
      .map((content, index) => ({
        tag_id: index + 1,
        content,
      }));
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/posts/${article.id}`);
      console.log(response.data);
      setAlert('게시글이 삭제되었습니다.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    console.log(article.id);
    navigate(`/posting/${article.id}`);
  };

  return (
    <>
      <div className='mx-auto mt-8 flex max-w-[1052px] flex-wrap'>
        <Alert></Alert>
        <div className='mb-10 w-full text-4xl font-bold'>{article.title}</div>
        <div className='mb-2 flex w-full'>
          <span className='w-36 text-xl font-semibold'>지역</span>
          <span className='text-lg'>{article.location}</span>
        </div>
        <div className='mb-3 flex w-full'>
          <span className='w-36 text-xl font-semibold'>여행기간</span>
          <span className='text-lg'>
            {article.travel_start_date} ~ {article.travel_end_date}
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
              <button
                className='cursor-pointer hover:text-[#373737]'
                onClick={handleEdit}
              >
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
