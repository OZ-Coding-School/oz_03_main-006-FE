import axios from 'axios';
import TagItem from './TagItem';
import { PiEyesFill } from 'react-icons/pi';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { useUserStore, useAlertStore } from '../../config/store';
import Alert from './common/Alert';
import dompurify from 'dompurify';
import { locationList } from '../data/locationList';
import { Tag } from '../../config/types';

const sanitizer = dompurify.sanitize;

interface DetailPostArticle {
  post_id: number;
  username: string;
  title: string;
  tag: string;
  region: number;
  body: string;
  created_at: string;
  view_count: number;
  travel_start_date: string | null;
  travel_end_date: string | null;
  user_id: number;
  likes_count: number;
}

interface ArticleProps {
  article: DetailPostArticle;
}

const Article: React.FC<ArticleProps> = ({ article }) => {
  console.log(article);
  const user = useUserStore((state) => state.user);
  const setAlert = useAlertStore((state) => state.setAlert);

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [postUserId, setPostUserId] = useState<number | null>(null);
  const [postContent, setPostContent] = useState<string>('');
  const [postTitle, setPostTitle] = useState<string>('');
  const [postRegion, setPostRegion] = useState<string>('');
  const [postTags, setPostTags] = useState<Tag[]>([]);
  const [postStartDate, setPostStartDate] = useState<string>('');
  const [postEndDate, setPostEndDate] = useState<string>('');
  const [postCreateDate, setPostCreateDate] = useState<string>('');
  const [postView, setPostView] = useState<number>(0);
  const [postUsername, setpostUsername] = useState<string>('');
  const [postLikesCount, setPostLikesCount] = useState<number>(0);

  useEffect(() => {
    if (user && postUserId && user.user_id === postUserId) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [user, postUserId]);

  const handleHeartToggle = () => {
    if (!user) {
      setAlert('로그인 후 이용해주세요.');
      return;
    }
    setIsLiked(!isLiked);
    //count 올리기
  };

  useEffect(() => {
    if (article) {
      setPostUserId(article.user_id);
      setpostUsername(article.username);
      setPostContent(article.body);
      setPostTitle(article.title);
      matchLocationName(article.region);
      setPostStartDate(article.travel_start_date || '');
      setPostEndDate(article.travel_end_date || '');
      const datePart = article.created_at.split('T')[0];
      setPostCreateDate(datePart);
      setPostView(article.view_count);
      setPostLikesCount(article.likes_count);

      const tagsArr = article.tag.split(',').map((content, index) => {
        return { tag_id: index + 1, content: content.trim() };
      });
      setPostTags(tagsArr);
    }
  }, [article]);

  const matchLocationName = (value: number) => {
    const location = locationList.find((loc) => loc.location_id === value);
    location ? setPostRegion(location.name) : setPostRegion('');
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
        <div className='mb-8 w-full text-4xl font-bold'>{postTitle}</div>
        <div className='mb-2 flex w-full'>
          <span className='w-40 text-xl font-semibold'>지역</span>
          <span className='text-lg'>{postRegion}</span>
        </div>
        <div className='mb-3 flex w-full'>
          <span className='w-40 text-xl font-semibold'>여행기간</span>
          <span className='text-lg'>
            {postStartDate}~ {postEndDate}
          </span>
        </div>
        <div className='mb-6 flex h-7 w-full'>
          {postTags.map((tag, index) => (
            <TagItem tagContent={tag} showDeleteButton={false} key={index} />
          ))}
          <span className='ml-auto flex gap-2'>
            <p className='m-auto text-sm text-[#777777]'>{postView} 회</p>
            <PiEyesFill className='m-auto text-base text-[#777777]' />
          </span>
        </div>
        <div className='mb-2 flex w-full'>
          <span className='mr-5 font-semibold'>{postUsername}</span>
          <span className='my-auto text-sm text-[#777777]'>
            {postCreateDate}
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
            dangerouslySetInnerHTML={{ __html: sanitizer(postContent) }}
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
