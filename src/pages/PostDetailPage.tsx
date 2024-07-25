import Article from '../components/Article';
import Comment from '../components/Comment';

const PostDetailPage = () => {
  return (
    <div className='search-scroll-pd h-screen overflow-hidden'>
      <div className='h-full overflow-y-scroll'>
        <Article />
        <Comment />
      </div>
    </div>
  );
};

export default PostDetailPage;
