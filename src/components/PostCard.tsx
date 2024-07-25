import React, { useEffect, useState } from 'react';
import { Post } from '../../config/types';
import { Link } from 'react-router-dom';
import { IoMdHeart } from 'react-icons/io';
import TagItem from './TagItem';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [postImg, setPostImg] = useState(
    post.representative_image_id && post.representative_image_id !== ''
      ? post.representative_image_id
      : '/logo.svg'
  );

  const errorLogoWidth = postImg === '/logo.svg' ? 'w-20' : '';
  const errorLogoHeight = postImg === '/logo.svg' ? 'h-20' : '';
  const errorLogoMargin = postImg === '/logo.svg' ? 'm-10' : '';

  const bodyLength = (str: string, n: number): string => {
    return str?.length > n ? str.substring(0, n) + '...' : str;
  };

  return (
    <>
      <Link to={`/post-detail/${post.post_id}`} className='block'>
        <div key={post.post_id} className='flex rounded-lg bg-white py-2'>
          <div className='size-[170px] shrink-0 rounded-xl bg-[#F4F4F4]'>
            <img
              src={postImg}
              alt={post.title}
              className={`rounded-xl ${errorLogoWidth} ${errorLogoHeight} ${errorLogoMargin}`}
            />
          </div>
          <div className='ml-4'>
            <h2 className='mb-2 text-xl font-semibold'>{post.title}</h2>
            <div className='mb-2 flex justify-between'>
              {/* flex-wrap 로 높이 8로 넘어가면 숨기기 -> overflow-hidden  */}
              {/* {어차피 flex-wrap으로 다음줄로 넘어가면 } */}
              <div className='mr-2 flex h-auto flex-wrap gap-2 overflow-hidden'>
                {post.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className='mr-0.3 rounded-md bg-yellow-400 px-2 py-1 text-sm'
                  >
                    {tag.name}
                  </span>
                  // <TagItem ={tag} showDeleteButton={false} key={index} />
                ))}
              </div>
              <div className='mt-1 flex'>
                <span className='mr-1 text-sm'>99</span>
                {/* <img src='/full-heart.svg' alt='Likes' className='w-5 h-5'/> */}
                <IoMdHeart className='mt-0.5 text-red-500' />
              </div>
            </div>
            <p className='mb-4 text-gray-600'>{bodyLength(post.body, 50)}</p>
            <div className='flex justify-between text-sm text-gray-500'>
              <span>{post.created_at}</span>
              <span className='py-1 text-xs'>{post.view_count} 조회수</span>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
};

export default PostCard;
