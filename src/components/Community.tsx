import { useNavigate, useParams } from 'react-router-dom';
import communityData from '../data/community.json';
import weatherData from '../data/weather.json';
import React, { useCallback, useEffect, useState } from 'react';
import { Post } from '../../config/types';
import PostCard from './PostCard';
import Carousel from './Carousel';
import icons from '../data/icons.json';
import axios from 'axios';
import Loading from './common/Loading';

interface Locations {
  location_id: number;
  city: string;
  description: string;
  images: string;
  popular_cities: string;
  district: string;
  highlights?: string;
  l_category: string;
}

interface Weather {
  POP: number;
  SKY: number;
  TMP: number;
  location_id: number;
  sky_status: string;
  base_date?: string;
  base_time?: string;
  fcst_date?: string;
}

interface CommunityEndItem {
  body: string;
  created_at: string;
  id: number;
  location: number;
  tag: string;
  thumbnail: string;
  title: string;
  travel_end_date: string;
  travel_start_date: string;
  updated_at: string;
  user_id: number;
  view_count: number;
}

const Community = () => {
  const { location_id } = useParams<{ location_id: string }>();

  const [sortedPosts, setSortedPosts] = useState<any[]>([]);
  const [sortType, setSortType] = useState<string>('default');
  const [sortRegionType, setSortRegionType] = useState<string>('default');
  const [community, setCommunity] = useState<Locations>();
  const [communitys, setCommunitys] = useState<Locations[]>([]);
  const [weather, setWeather] = useState<Weather>();
  const [forecast, setForecast] = useState<Weather>();
  const [isLoading, setIsLoading] = useState(true);

  const [communityPosts, setCommunityPosts] = useState<CommunityEndItem[]>([]);
  const [regionData_end, setRegionData_end] = useState<CommunityEndItem[]>([]);

  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://43.202.53.249:8000/posts/`);
      console.log(response.data);
      setCommunityPosts(response.data);
    } catch {}
  };
  const fetchWeather = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://43.202.53.249:8000/weather/weather/latest/${location_id}`
      );
      setWeather(response.data);
      console.log(response);
    } catch (error) {
      console.error('날씨 데이터를 가져오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForecastWeather = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://43.202.53.249:8000/weather/weather/forecast/${location_id}`
      );
      setForecast(response.data);
      console.log(response);
    } catch (error) {
      console.error('날씨 데이터를 가져오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        `http://43.202.53.249:8000/locations/${location_id}`
      );
      setCommunity(response.data);
      console.log(response);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCommunitys = async () => {
    try {
      const response = await axios.get(`http://43.202.53.249:8000/locations/`);
      setCommunitys(response.data);
      console.log(response);
    } catch {}
  };

  useEffect(() => {
    fetchPosts();
    fetchWeather();
    fetchLocations();
    fetchCommunitys();
    fetchForecastWeather();
  }, [location_id]);

  console.log(communityPosts);
  console.log(community);
  console.log(community);
  console.log(weather);
  console.log(typeof communityPosts);

  // 데이터 정렬 함수 ( 날짜순, 조회순 )
  const sortPosts = useCallback((posts: Post[], type: string) => {
    if (type === 'date') {
      return [...posts].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (type === 'search') {
      return [...posts].sort((a, b) => b.view_count - a.view_count);
    }
    return posts;
  }, []);

  const handleRegion = (e: React.ChangeEvent<HTMLSelectElement>) => (
    setSortRegionType(e.target.value),
    navigate(`/community/${e.target.value}`),
    console.log(location_id),
    console.log(e.target.value)
  );

  const handleArray = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value);
  }, []);

  return (
    <>
      {/* <div className='container max-w-[1200px] mx-auto px-10 py-8 overflow-hidden h-[100vh]'> */}
      {/* 기본적으로 숨겼다가(hidden) 사이즈가 lg(1024px)가 되면 block */}
      {!community ? (
        <div>지역 데이터를 찾을 수 없습니다.</div>
      ) : (
        <>
          <div className='h-screen w-full overflow-hidden'>
            {/* min-w-[1200px]로 1200px보다 작아지면 가로 스크롤이 생김 -> 1200px 화면 유지 */}
            <div
              className={`container mx-auto h-full min-w-[1200px] max-w-[1200px] overflow-hidden px-10 py-8`}
            >
              <div className='mb-2 flex'>
                {icons.map((icon) =>
                  icon.icon_id === community?.location_id ? (
                    <React.Fragment key={icon.icon_id}>
                      <img
                        src={icon.file}
                        alt={icon.name}
                        className='mr-3 h-12 w-12'
                      />
                      <h1 className='mb-4 font-okgung text-5xl font-bold'>
                        {/* {regionData.locations.category} */}
                        {community.l_category}
                      </h1>
                    </React.Fragment>
                  ) : null
                )}
              </div>
              <select
                onChange={handleRegion}
                className='mb-3 cursor-pointer rounded-sm border px-2 py-1 text-sm text-[#6c6c6c] hover:bg-[#eeeeeec8] hover:text-[#5b5b5b] focus:outline-none'
                defaultValue={sortRegionType}
              >
                <option value='default' disabled>
                  타 지역으로 이동
                </option>
                {communitys.map((region) => (
                  <option key={region.location_id} value={region.location_id}>
                    {region.l_category}
                  </option>
                ))}
              </select>

              <hr className='border-1.8 mb-5' />

              <div className='search-scroll-community h-[calc(100%-100px)] overflow-y-auto'>
                {/* <div className='  '> */}
                <div className='mb-8 flex'>
                  {/* <img src={regionData.locations.logation_img} alt={regionData.locations.city} className='rounded-xl w-[550px] h-[350px]'/> */}
                  <div className='w-[500px] rounded-xl'>
                    <Carousel />
                  </div>
                  <div className='px-8 pb-12 pt-8'>
                    <h2 className='mx-auto mb-4 text-4xl font-medium'>
                      {community?.city}
                    </h2>
                    <p className='mb-4 mt-8'>
                      <span className='mr-8 text-gray-600/70'>인기도시</span>
                      <span className='text-blue-700/60'>
                        {community?.popular_cities === 'None' ? (
                          <React.Fragment>
                            인기 도시 선정 진행 중입니다. 여러분의 의견을
                            기다립니다!
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            {community?.popular_cities}
                          </React.Fragment>
                        )}
                      </span>
                    </p>
                    <div className='mb-4 mt-4 flex'>
                      <span className='mr-12 text-gray-600/70'>날씨</span>
                      <div className='my-auto flex justify-between text-blue-700/60'>
                        {isLoading ? (
                          <p>
                            {/* <Loading /> */}
                            날씨 정보를 불러오는 중...
                          </p>
                        ) : (
                          <React.Fragment>
                            <span className='mx-3'>{weather?.sky_status}</span>
                            <span>|</span>
                            <span className='mx-3'>온도 {weather?.TMP}°C</span>
                            <span>|</span>
                            <span className='mx-3'>
                              강수확률 {weather?.POP}%
                            </span>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                    <div className='mb-8 flex'>
                      <span className='mr-12 text-gray-600/70'>
                        이번주 날씨
                      </span>
                      <div className='my-auto flex justify-between text-blue-700/60'>
                        {isLoading ? (
                          <p>
                            {/* <Loading /> */}
                            날씨 정보를 불러오는 중...
                          </p>
                        ) : (
                          <React.Fragment>
                            <span className='mx-3'>{forecast?.sky_status}</span>
                            <span>|</span>
                            <span className='mx-3'>온도 {forecast?.TMP}°C</span>
                            <span>|</span>
                            <span className='mx-3'>
                              강수확률 {forecast?.POP}%
                            </span>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                    {/* <p className=''>{regionData.locations.information}</p> */}
                    <p className=''>{community?.description}</p>
                  </div>
                </div>

                <select
                  onChange={handleArray}
                  className='mb-3 mt-7 cursor-pointer rounded-sm border px-2 py-1 text-sm text-[#6c6c6c] hover:bg-[#eeeeeec8] hover:text-[#5b5b5b] focus:outline-none'
                  defaultValue={sortType}
                >
                  <option value='default' disabled>
                    날짜순, 조회순 정렬
                  </option>
                  <option value='date'>날짜순</option>
                  <option value='search'>조회순</option>
                </select>
                {/* grid-cols-1 : 기본적으로 (모바일 화면 등 작은 화면에서 한 열로 배치) / md:grid-cols-2 중간 크기(768px) 이상의 화면에서 두열로 배치 */}
                <div className='mr-3 grid grid-cols-2 gap-6'>
                  {communityPosts
                    .filter(
                      (post) =>
                        post.location === parseInt(location_id || '0', 10)
                    )
                    .map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Community;
