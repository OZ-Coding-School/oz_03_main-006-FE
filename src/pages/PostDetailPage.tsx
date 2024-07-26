import { useEffect, useState } from 'react';
import Article from '../components/Article';
import Comment from '../components/Comment';
import { useParams } from 'react-router-dom';
import { DetailPostArticle } from '../../config/types';
import Loading from '../components/common/Loading';
import axios from '../api/axios';

const PostDetailPage = () => {
  const { post_id } = useParams();
  const [article, setArticle] = useState<DetailPostArticle | null>(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get(`/posts/${post_id}/`)
      .then((res) => {
        setArticle(res.data.post);
        setComments(res.data.post.comments);
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
