import axios from 'axios';
import TagItem from './TagItem';
import { PiEyesFill } from 'react-icons/pi';
import { useParams } from 'react-router-dom';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { useUserStore, useAlertStore } from '../../config/store';
import Alert from './common/Alert';
import dompurify from 'dompurify';
import { locationList } from '../data/locationList';

const sanitizer = dompurify.sanitize;

const Article = () => {
  const user = useUserStore((state) => state.user);
  const setAlert = useAlertStore((state) => state.setAlert);

  const tags = [
    { id: 1, content: '이것은' },
    { id: 2, content: '태그테스트' },
    { id: 3, content: '입니다..' },
    { id: 4, content: '제주도..가고싶다' },
    { id: 5, content: '제주도한달살이' },
  ];

  const { postId } = useParams();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [postUserId, setPostUserId] = useState(null);
  const [postContent, setPostContent] = useState<string>('');
  const [postTitle, setPostTitle] = useState<string>('');
  const [postRegion, setPostRegion] = useState<string>('');
  const [postTags, setPostTags] = useState<string[]>([]);
  const [postStartDate, setPostStartDate] = useState<string>('');
  const [postEndDate, setPostEndDate] = useState<string>('');
  const [postCreateDate, setPostCreateDate] = useState<string>('');
  const [postView, setPostView] = useState<string>('');
  const [postUsername, setpostUsername] = useState<string>('');

  useEffect(() => {
    if (user && postUserId && user.user_id === postUserId) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [user, postUserId]);

  const handleHeartToggle = () => {
    if (!user) {
      setAlert('로그인 후 이용해주세요.');
      return;
    }
    setIsLiked(!isLiked);
    //count 올리기
  };

  useEffect(() => {
    const getPostData = async () => {
      try {
        const response = await axios.get(
          `http://52.79.207.68:8000/posts/posts/${postId}/`
        );
        console.log(response.data);
        setPostUserId(response.user_id); //게시글 작성한 유저의 id
        setPostContent(response.content);
        setPostTitle(response.title);
        matchLocationName(response.region);
        setPostStartDate(response.travel_start_date);
        setPostEndDate(response.travel_end_date);
        setPostCreateDate(response.created_at);
        setPostView(response.view_count);
        setpostUsername(response.username);

        const tagsArr = response.tag.split(',').map((i) => i.trim());
        setPostTags(tagsArr);
      } catch (error) {
        console.error(error);
      }
    };
    getPostData();
  }, [postId]);

  const matchLocationName = (value: string) => {
    const location = locationList.find(
      (loc) => loc.location_id === parseInt(value)
    );
    location ? setPostRegion(location.name) : setPostRegion('');
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/posts/${postId}`);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className='mx-auto mt-8 flex max-w-[1052px] flex-wrap'>
        <Alert></Alert>
        <div className='mb-8 w-full text-4xl font-bold'>
          {
            '이 제목들이 장기 여행자들에게 유용한 정보를 제공하고 흥미를 끌 수있기를 바랍니다.'
          }
        </div>
        <div className='mb-2 flex w-full'>
          <span className='w-40 text-xl font-semibold'>지역</span>
          <span className='text-lg'>{postRegion}서울</span>
        </div>
        <div className='mb-3 flex w-full'>
          <span className='w-40 text-xl font-semibold'>여행기간</span>
          <span className='text-lg'>
            {postStartDate}2024.07.09 ~ {postEndDate}2024.07. 22
          </span>
        </div>
        <div className='mb-6 flex h-7 w-full'>
          {tags.map((tag, index) => (
            <TagItem tagContent={tag} showDeleteButton={false} key={index} />
          ))}
          <span className='ml-auto flex gap-2'>
            <p className='m-auto text-sm text-[#777777]'>{postView} 24회</p>
            <PiEyesFill className='m-auto text-base text-[#777777]' />
          </span>
        </div>
        <div className='mb-2 flex w-full'>
          <span className='mr-5 font-semibold'>
            {postUsername}나는 한바퀴유저
          </span>
          <span className='my-auto text-sm text-[#777777]'>
            {postCreateDate}2024.07.09
          </span>
          {showButton && (
            <div className='my-auto ml-auto flex justify-center gap-1 align-middle text-sm text-[#777777]'>
              <button className='cursor-pointer hover:text-[#373737]'>
                수정
              </button>
              <p>/</p>
              <button
                className='cursor-pointer hover:text-[#373737]'
                onClick={handleDelete}
              >
                삭제
              </button>
            </div>
          )}
        </div>
        <div className='w-full border-y pb-32 pt-4'>
          {/* <div
            className='ql-editor'
            dangerouslySetInnerHTML={{ __html: sanitizer(postContent) }}
          /> */}
          장기 여행을 하다 보면 유명한 관광지 외에도 뜻밖의 아름다움을 간직한
          숨겨진 보석 같은 장소들을 만나게 됩니다. 이 포스팅에서는 제가 장기
          여행 중 발견한, 아직 많은 이들에게 알려지지 않은 특별한 장소들을
          소개해드리겠습니다. 1. 포르투갈의 알렌테주 해변 알렌테주 해변은
          포르투갈의 남서부에 위치한 한적한 해변으로, 맑고 푸른 바다와 황금빛
          모래사장이 펼쳐져 있습니다. 관광객이 많지 않아 조용히 휴식을 취하거나,
          해변 산책을 즐기기에 완벽한 곳입니다. 2. 이탈리아의 치비타 디 바뇨레조
          ‘죽어가는 마을’이라는 별명을 가진 치비타 디 바뇨레조는 이탈리아 중부
          라치오 주에 위치한 작은 언덕 마을입니다. 독특한 지형과 고대 로마 유적,
          중세 건축물이 어우러져 있으며, 관광객이 많지 않아 고즈넉한 분위기를
          느낄 수 있습니다. 3. 일본의 다카야마 다카야마는 일본 기후 현에 위치한
          전통적인 산간 마을로, 에도 시대의 건축물이 잘 보존되어 있습니다.
          이곳에서는 매년 다카야마 축제가 열리며, 전통적인 일본 문화를 체험할 수
          있는 기회가 많습니다. 특히, 아름다운 자연경관과 정겨운 분위기가
          일품입니다. 4. 멕시코의 이슬라 홀박스 이슬라 홀박스는 멕시코 유카탄
          반도에 위치한 작은 섬으로, 카리브해의 에메랄드빛 바다와 하얀
          모래사장이 펼쳐져 있습니다. 이곳은 자동차가 없는 무공해 지역으로,
          자전거나 골프카트를 이용해 섬을 돌아볼 수 있습니다. 바닷가에서
          플라밍고를 볼 수 있는 특별한 경험도 가능합니다. 5. 베트남의 푸꾸옥 섬
          베트남 남부에 위치한 푸꾸옥 섬은 맑고 투명한 바다와 아름다운 해변으로
          유명하지만, 아직 대규모 관광객에게는 잘 알려지지 않았습니다. 해양
          스포츠를 즐기거나, 해변에서 여유롭게 일몰을 감상할 수 있는 최고의
          장소입니다. 6. 루마니아의 시기쇼아라 루마니아 트란실바니아에 위치한
          시기쇼아라는 중세 도시로, 유네스코 세계문화유산에 등재되어 있습니다.
          중세 성곽과 타워, 구시가지가 잘 보존되어 있으며, 드라큘라의 출생지로도
          알려져 있습니다. 독특한 역사와 문화를 간직한 이곳은 마치 시간 여행을
          하는 듯한 느낌을 줍니다. 7. 뉴질랜드의 와나카 호수 뉴질랜드 남섬에
          위치한 와나카 호수는 고요한 호수와 주변의 산들이 어우러져 환상적인
          풍경을 자랑합니다. 많은 관광객이 밀려드는 퀸스타운 이처럼 장기 여행
          중에는 예상치 못한 숨겨진 보석 같은 장소들을 만날 수 있습니다. 유명한
          관광지만을 찾아다니기보다는, 현지인들의 추천을 받거나 직접 탐험하면서
          이러한 특별한 장소들을 발견해보세요. 여행의 또 다른 재미를 느낄 수
          있을 것입니다.
        </div>
        <div className='mb-10 mt-4 flex w-full justify-end gap-2 text-lg'>
          <p>9,999</p>
          <button
            onClick={handleHeartToggle}
            className='my-auto cursor-pointer text-red-500'
          >
            {isLiked ? (
              <IoMdHeart className='size-6' />
            ) : (
              <IoMdHeartEmpty className='size-6' />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Article;
