import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Article from '../components/Article';
import Comment from '../components/Comment';
import { DetailPostArticle } from '../../config/types';
import Loading from '../components/common/Loading';
import axios from '../api/axios';
import Error from '../components/common/Error';

const PostDetailPage = () => {
  const { post_id } = useParams();
  const [article, setArticle] = useState<DetailPostArticle | null>(null);
  const [comments, setComments] = useState();
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get(`/posts/${post_id}/`, { withCredentials: true })
      .then((res) => {
        setArticle(res.data.post);
        setComments(res.data.post.comments);
        setErrorStatus(null);
        scrollRef.current?.scrollTo(0, 0);
      })
      .catch((error) => {
        if (error.response) {
          setErrorStatus(error.response.status);
        } else {
          setErrorStatus(500);
        }
        console.error(
          error + '에러가 발생하여 데이터를 불러오는데 실패했습니다.'
        );
      });
  }, [post_id]);

  if (errorStatus) {
    return <Error status={errorStatus} />;
  }

  if (!article || !comments) {
    return <Loading />;
  }

  return (
    <div className='search-scroll-pd h-screen overflow-hidden'>
      <div className='h-full overflow-y-scroll' ref={scrollRef}>
        <Article article={article} />
        <Comment comments={comments} />
      </div>
    </div>
  );
};

export default PostDetailPage;
