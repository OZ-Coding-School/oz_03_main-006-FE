import { useEffect, useState } from 'react';
import Article from '../components/Article';
import Comment from '../components/Comment';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PostDetailPage = () => {
  const { post_id } = useParams();
  const [article, setArticle] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get(`http://52.79.207.68:8000/posts/posts/${post_id}/`)
      .then((res) => {
        setArticle(res.data);
        setComments(res.data.post.comments);

        console.log(res);
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
        <Article article={article.post} />
        <Comment comments={comments} />
      </div>
    </div>
  );
};

export default PostDetailPage;
