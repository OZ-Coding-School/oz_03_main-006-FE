import React, { useEffect, useState } from 'react';
import SearchResultItem from '../../SearchResultItem';
import { Post } from '../../../../config/types';
import { LoadingRanking } from '../Loading';
import axios from '../../../api/axios';

interface RankingProps {
  textColor: string;
  clickedHover: string;
  activeTab: string;
}

const Ranking: React.FC<RankingProps> = ({
  textColor,
  clickedHover,
  activeTab,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);

  const getTopPosts = async () => {
    try {
      const response = await axios.get('/posts/');
      console.log(response.data);
      const posts: Post[] = response.data;
      if (posts.length > 0) {
        const sortedPosts = posts.sort((a, b) => b.view_count - a.view_count);
        const topPosts = sortedPosts.slice(0, 5);
        setPosts(topPosts);
      }
    } catch (error) {
      console.log('데이터 요청 실패: ', error);
    }
  };

  useEffect(() => {
    getTopPosts();
  }, []);

  if (posts.length <= 0) {
    return <LoadingRanking />;
  }

  return (
    <div className='flex w-full flex-col items-center justify-center py-1'>
      {posts.map((post, index) => (
        <SearchResultItem
          key={post.id}
          id={post.id}
          title={post.title}
          body={post.body}
          thumbnail={post.thumbnail}
          textColor={textColor}
          clickedHover={clickedHover}
          activeTab={activeTab}
          index={index}
        />
      ))}
    </div>
  );
};
export default Ranking;
