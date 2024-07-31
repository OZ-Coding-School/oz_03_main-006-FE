import React from 'react';
import { Link } from 'react-router-dom';
import { IoMdHeart } from 'react-icons/io';
import { Post } from '../../config/types';
import TagItem from './TagItem';
import dompurify from 'dompurify';

const sanitizer = dompurify.sanitize;

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const postImg =
    post.thumbnail && post.thumbnail !== '' ? post.thumbnail : '/logo.svg';

  const errorLogoWidth = postImg === '/logo.svg' ? 'w-20' : 'w-full';
  const errorLogoHeight = postImg === '/logo.svg' ? 'h-20' : 'h-full';
  const errorLogoMargin = postImg === '/logo.svg' ? 'm-11' : '';

  const bodyLength = (str: string, n: number): string => {
    const postBodyImg = str.toLowerCase().indexOf('<img');
    if (postBodyImg !== -1 && postBodyImg < n) {
      console.log(post.body);
      console.log('hihi');
      return str.substring(0, postBodyImg).trim();
    }
    return str?.length > n ? str.substring(0, n) + '...' : str;
  };

  console.log(post);

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
                {/* flex-wrap 로 높이 8로 넘어가면 숨기기 -> overflow-hidden  */}
                {/* {어차피 flex-wrap으로 다음줄로 넘어가면 } */}
                <div className='flex'>
                  <div className='mr-2 flex h-[30px] origin-left scale-90 transform flex-wrap gap-2 overflow-hidden'>
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
                className='mb-4 text-gray-600'
                dangerouslySetInnerHTML={{
                  __html: sanitizer(bodyLength(post.body, 50)),
                }}
              />
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
