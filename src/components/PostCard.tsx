import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoMdHeart } from 'react-icons/io';
import { Post } from '../../config/types';
import TagItem from './TagItem';
import './PostCard.css';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const postImg =
    post.thumbnail && post.thumbnail !== '' ? post.thumbnail : '/logo.svg';

  const errorLogoWidth = postImg === '/logo.svg' ? 'w-20' : 'w-full';
  const errorLogoHeight = postImg === '/logo.svg' ? 'h-20' : 'h-full';
  const errorLogoMargin = postImg === '/logo.svg' ? 'm-11' : '';

  const [isOverflow, setIsOverflow] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const { scrollWidth, clientWidth } = textRef.current;
      console.log(scrollWidth, clientWidth);
      setIsOverflow(scrollWidth > clientWidth);
    }
  }, [post.body]);

  const domParse = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const bodyLength = (str: string, n: number): string => {
    const cleanStr = domParse(str);
    return cleanStr?.length > n ? cleanStr.substring(0, n) + '...' : cleanStr;
  };

  const splitTags = (tagString: string) => {
    return tagString.split(',').map((tag, index) => ({
      tag_id: index,
      content: tag.trim(),
    }));
  };

  const tags = splitTags(post.tag);

  return (
    <>
      <Link to={`/post-detail/${post.id}`} className='block'>
        <div key={post.id} className='flex h-full rounded-lg bg-white py-2'>
          <div className='size-[170px] shrink-0 rounded-xl bg-[#F4F4F4]'>
            <img
              src={postImg}
              alt={post.title}
              className={`rounded-xl ${errorLogoWidth} ${errorLogoHeight} ${errorLogoMargin}`}
            />
          </div>
          <div className='ml-4 mt-1 grid w-full'>
            <div className='h-[130px] overflow-hidden'>
              <h2 className='mb-2 text-xl font-semibold'>{post.title}</h2>
              <div className='mb-2 flex justify-between'>
                <div className='flex'>
                  <div className='mr-2 flex h-[30px] origin-left scale-90 flex-wrap gap-2 overflow-hidden'>
                    {tags.map((t) => (
                      <TagItem
                        tagContent={t}
                        showDeleteButton={false}
                        key={t.tag_id}
                      />
                    ))}
                  </div>
                </div>
                <div className='mt-1 flex'>
                  <span className='mr-1 text-sm'>{post.likes_count}</span>
                  <IoMdHeart className='mt-0.5 text-red-500' />
                </div>
              </div>
              <p
                ref={textRef}
                className={`mb-4 text-gray-600 ${isOverflow ? 'text-truncate' : ''}`}
                title={domParse(post.body)} // 텍스트 전체를 툴팁으로 표시
              >
                {bodyLength(post.body, 50)}
              </p>
            </div>
            <div className='flex justify-between text-sm text-gray-500'>
              <span>{post.created_at.split('T')[0]}</span>
              <span className='py-1 text-xs'>{post.view_count} 조회수</span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default PostCard;
