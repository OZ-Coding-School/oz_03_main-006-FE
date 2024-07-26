import { useNavigate, useParams } from 'react-router-dom';
import communityData from '../data/community.json';
import weatherData from '../data/weather.json';
import React, { useEffect, useState } from 'react';
import { Post } from '../../config/types';
import PostCard from './PostCard';
import Carousel from './Carousel';
import icons from '../data/icons.json';
import axios from 'axios';

interface Locations {
  location_id: number;
  city: string;
  distric: string;
  symbol?: string;
  population: number;
  information: string;
  category: string;
  logation_img: string;
}

interface Weather {
  weather_id: number;
  location_id: number;
  temperature: number;
  humidity: number;
  description: string;
  wind_speed: number;
  updated_at: string;
}

interface CommunityEndItem {
  body: string;
  created_at: string;
  id: number;
  region: number;
  tag: string;
  thumbnail: string;
  title: string;
  travel_end_date: string;
  travel_start_date: string;
  updated_at: string;
  user_id: number;
  view_count: number;
}

interface CommunityPost {
  locations: Locations;
  posts: Post[];
}

const weather: Weather[] = weatherData;
const community: CommunityPost[] = communityData;

const Community = () => {
  const { location_id } = useParams<{ location_id: string }>();

  const [sortedPosts, setSortedPosts] = useState<any[]>([]);
  const [sortType, setSortType] = useState<string>('default');
  const [sortRegionType, setSortRegionType] = useState<string>('default');

  const [community_end, setCommunity_end] = useState<CommunityEndItem[]>([]);
  const [regionData_end, setRegionData_end] = useState<CommunityEndItem[]>([]);

  const navigate = useNavigate();

  const fetchCommunityData = async () => {
    try {
      const response = await axios.get(`http://52.79.207.68:8000/posts/`);
      console.log(response);
      setCommunity_end(response.data);
    } catch {}
  };

  useEffect(() => {
    fetchCommunityData();
  }, []);

  console.log(community_end);
  console.log(community);
  console.log(weather);
  console.log(typeof community_end);
  // 날씨 정보 가져오기
  const regionWeather = weather.find((region) => {
    return region.location_id === parseInt(location_id || '0', 10);
  });
  console.log(regionWeather);

  // 총지역 데이터에서 각 지역 정보 가져오기 -> 더미데이터 이용
  const regionData = community.find((region) => {
    console.log(location_id);
    console.log(region);
    return region.locations.location_id === parseInt(location_id || '0', 10);
  });
  console.log(regionData);

  // 지역데이터 가져오기 -> 앤드포인트
  // if (community_end) {
  //   const region_end = community_end.find((region) => {
  //     return region.region === parseInt(location_id || '0', 10);
  //   });
  //   console.log(region_end);
  //   setRegionData_end(region_end);
  // }

  useEffect(() => {
    if (community_end.length > 0 && location_id) {
      const foundRegions = community_end.filter(
        (region) => region.region === parseInt(location_id, 10)
      );
      setRegionData_end(foundRegions);
    }
  }, [community_end, location_id]);

  // 데이터 정렬 함수 ( 날짜순, 조회순 )
  const sortPosts = (posts: any[], type: string) => {
    if (type === 'date') {
      return [...posts].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (type === 'search') {
      return [...posts].sort((a, b) => b.view_count - a.view_count);
    }
    return posts;
  };

  useEffect(() => {
    if (regionData) {
      const sorted = sortPosts(regionData.posts, sortType);
      setSortedPosts(sorted);
    }
  }, [regionData, sortType, sortRegionType]);

  console.log(location_id);
  console.log(community);
  console.log(regionData);

  if (!regionData) return <div>지역 데이터를 찾을 수 없습니다.</div>;

  const handleRegion = (e: any) => (
    setSortRegionType(e.target.value),
    navigate(`/community/${e.target.value}`),
    console.log(location_id),
    console.log(e.target.value)
  );

  const handleArray = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value);
  };

  return (
    <>
      {/* <div className='container max-w-[1200px] mx-auto px-10 py-8 overflow-hidden h-[100vh]'> */}
      {/* 기본적으로 숨겼다가(hidden) 사이즈가 lg(1024px)가 되면 block */}
      <div className='h-screen w-full overflow-hidden'>
        {/* min-w-[1200px]로 1200px보다 작아지면 가로 스크롤이 생김 -> 1200px 화면 유지 */}
        <div
          className={`container mx-auto h-full min-w-[1200px] max-w-[1200px] overflow-hidden px-10 py-8`}
        >
          <div className='mb-2 flex'>
            {icons.map((icon) =>
              icon.icon_id === regionData.locations.location_id ? (
                <img
                  key={icon.icon_id}
                  src={icon.file}
                  alt={icon.name}
                  className='mr-3 h-12 w-12'
                />
              ) : (
                <React.Fragment key={icon.icon_id}></React.Fragment>
              )
            )}
            <h1 className='mb-4 font-okgung text-5xl font-bold'>
              {regionData.locations.category}
            </h1>
          </div>
          <select
            onChange={handleRegion}
            className='mb-3 cursor-pointer rounded-sm border px-2 py-1 text-sm text-[#6c6c6c] hover:bg-[#eeeeeec8] hover:text-[#5b5b5b] focus:outline-none'
            defaultValue={sortRegionType}
          >
            <option value='default' disabled>
              타 지역으로 이동
            </option>
            {community.map((region) => (
              <option
                key={region.locations.location_id}
                value={region.locations.location_id}
              >
                {region.locations.category}
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
                  {regionData.locations.city}
                </h2>
                <p className='mb-4 mt-8'>
                  <span className='text-gray-600/70'>인기도시</span>
                  <span></span>
                </p>
                <div className='mb-7 mt-4 flex'>
                  <span className='mr-12 text-gray-600/70'>날씨</span>
                  <div className='my-auto flex justify-between text-blue-700/60'>
                    <span className='mx-3'>{regionWeather?.description}</span>
                    <span>|</span>
                    <span className='mx-3'>
                      온도 {regionWeather?.temperature}
                    </span>
                    <span>|</span>
                    <span className='mx-3'>습도 {regionWeather?.humidity}</span>
                    <span>|</span>
                    <span className='mx-3'>
                      풍속 {regionWeather?.wind_speed}
                    </span>
                    <span>|</span>
                    <span className='mx-3'>
                      예보 {regionWeather?.wind_speed}
                    </span>
                  </div>
                </div>
                <p className=''>{regionData.locations.information}</p>
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
              {regionData_end.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 사이즈가 lg이면 hidden (미만이면) */}
      {/* <div className='lg:hidden'>
      <p className='text-center py-10'>화면 크기가 너무 작습니다. 더 큰 화면에서 확인해주세요.</p>
    </div> */}
    </>
  );
};

export default Community;
