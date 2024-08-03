import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Article from '../components/Article';
import Comment from '../components/Comment';
import { DetailPostArticle } from '../../config/types';
import Loading from '../components/common/Loading';
import axios from '../api/axios';
import Error from '../components/common/Error';
import { locationList } from '../data/locationList';
import { FaArrowLeft } from 'react-icons/fa';
import { useAlertStore } from '../../config/store';
import Alert from '../components/common/Alert';

const PostDetailPage = () => {
  const { post_id } = useParams();
  const [article, setArticle] = useState<DetailPostArticle | null>(null);
  const [comments, setComments] = useState();
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const showAlert = useAlertStore((state) => state.showAlert);

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

  const navigateCommunity = () => {
    const location = article.location;
    const selectedLocation = locationList.find((item) => {
      return item.city === location;
    });
    navigate(`/community/${selectedLocation?.location_id}`);
  };

  return (
    <div className='search-scroll-pd h-screen overflow-hidden'>
      <div className='h-full overflow-y-scroll' ref={scrollRef}>
        <div
          className='mx-auto mt-5 flex min-w-[1052px] max-w-[1092px] cursor-pointer items-center text-gray-400'
          onClick={navigateCommunity}
        >
          <FaArrowLeft className='mr-2 text-sm' />
          지역 게시판으로 돌아가기
        </div>
        <Article article={article} />
        <Comment comments={comments} />
        {showAlert && <Alert />}
      </div>
    </div>
  );
};

export default PostDetailPage;
