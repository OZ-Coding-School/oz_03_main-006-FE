import { useEffect, useState } from 'react';
import Article from '../components/Article';
import Comment from '../components/Comment';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';

const PostDetailPage = () => {
  const { post_id } = useParams();
  const [article, setArticle] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get(`/posts/${post_id}/`)
      .then((res) => {
        setArticle(res.data);
        setComments(res.data.post.comments);
      })
      .catch((error) =>
        console.error(
          error + '에러가 발생하여 데이터를 불러오는데 실패했습니다.'
        )
      );
  }, [post_id]);

  return (
    <div className='search-scroll-pd h-screen overflow-hidden'>
      <div className='h-full overflow-y-scroll'>
        <Article article={article} />
        <Comment comments={comments} />
      </div>
    </div>
  );
};

export default PostDetailPage;
