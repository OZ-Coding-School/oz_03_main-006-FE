import React, { useEffect, useState } from 'react'
import { Post } from '../../config/types'
import { Link } from 'react-router-dom'


interface PostCardProps {
    post: Post
}

const PostCard: React.FC<PostCardProps> = ({post}) => {
    const [postImg, setPostImg] = useState(
        post.representative_image_id && post.representative_image_id !== "" ? post.representative_image_id : '/logo.svg'
    )

    const errorLogoWidth = postImg === '/logo.svg' ? 'w-20' : '';
    const errorLogoHeight = postImg === '/logo.svg' ? 'h-20' : '';
    const errorLogoMargin = postImg === '/logo.svg' ? 'm-10' : '';

    const bodyLength = (str: string, n: number): string => {
        return str?.length > n ? str.substring(0, n) + "..." : str ;
    }

  

    return (
        <>
                <Link to={`/post-detail/${post.post_id}`} className='block'>
                    <div key={post.post_id} className='bg-white p-6 rounded-lg shadow-md flex'>
                        <div className='flex justify-center bg-[#F4F4F4] w-[300px] rounded-xl '>
                            <img src={postImg} alt={post.title} className={` rounded-xl ${errorLogoWidth} ${errorLogoHeight} ${errorLogoMargin}`}  />
                        </div>
                        <div className='ml-4'>
                            <h2 className='text-xl font-semibold mb-2'>{post.title}</h2>
                            <div className='flex justify-between mb-2 '>
                                {/* flex-wrap 로 높이 8로 넘어가면 숨기기 -> overflow-hidden  */}
                                {/* {어차피 flex-wrap으로 다음줄로 넘어가면 } */}
                                <div className='flex flex-wrap gap-2 mr-2  overflow-hidden h-8 '>
                                    {post.tags?.map((tag) => (
                                        <span key={tag.tag_id} className='mr-0.3 bg-yellow-400 px-2 py-1 rounded-md text-sm'>{tag.name}</span>
                                    ))}
                                </div>
                                <div className='flex mt-1'>
                                    <span className='mr-1 text-sm '>99</span>
                                    <img src='/full-heart.svg' alt='Likes' className='w-5 h-5'/>
                                </div>
                            </div>
                            <p className='text-gray-600 mb-4'>{bodyLength(post.body, 50)}</p>
                            <div className='flex justify-between text-sm text-gray-500'>
                                <span>{post.created_at}</span>
                                <span className='text-xs py-1'>{post.view_count} 조회수</span>
                            </div>
                        </div>
                    </div>
                </Link>
        </>
    )
}

export default PostCard