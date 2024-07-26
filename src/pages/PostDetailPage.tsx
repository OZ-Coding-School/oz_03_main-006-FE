import { useEffect, useState } from 'react';
import Article from '../components/Article';
import Comment from '../components/Comment';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DetailPostArticle } from '../../config/types';
import Loading from '../components/common/Loading';

const PostDetailPage = () => {
  const { post_id } = useParams();
  const [article, setArticle] = useState<DetailPostArticle | null>(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get(`http://52.79.207.68:8000/posts/${post_id}/`)
      .then((res) => {
        setArticle(res.data.post);
        setComments(res.data.post.comments);

        console.log(res);
      })
      .catch((error) =>
        console.error(
          error + '에러가 발생하여 데이터를 불러오는데 실패했습니다.'
        )
      );
  }, [post_id]);

  if (!article || !comments) {
    return <Loading></Loading>;
  }

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
