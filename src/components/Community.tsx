import { useNavigate, useParams } from 'react-router-dom';
import communityData from '../data/community.json'
import weatherData from '../data/weather.json'
import React, { useEffect, useState } from 'react';
import { Post, tag } from '../../config/types';
import PostCard from './PostCard';
import Carousel from './Carousel';
import icons from '../data/icons.json'

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


interface CommunityPost {
  locations: Locations;
  posts: Post[],
}

const weather : Weather[] = weatherData;
const community : CommunityPost[] = communityData;



const Community = () => {
  const { location_id } = useParams<{ location_id: string }>();
  const [sortedPosts, setSortedPosts] = useState<any[]>([])
  const [sortType, setSortType] = useState<string>("default")
  const [sortRegionType, setSortRegionType] = useState<string>("default")

 
  const navigate = useNavigate()
  
  // 날씨 정보 가져오기
  const regionWeather = weather.find((region) => {
    return region.location_id === parseInt(location_id || '0', 10)
  })
  console.log(regionWeather)

  // 총지역 데이터에서 각 지역 정보 가져오기 
  const regionData = community.find((region) => {
    console.log(location_id)
    console.log(region)
    return region.locations.location_id === parseInt(location_id || '0', 10)
  });
  console.log(regionData)


  // 데이터 정렬 함수 ( 날짜순, 조회순 )
  const sortPosts = (posts: any[], type: string)=> {
    if(type === "date") {
      return [...posts].sort((a,b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    } else if (type === "search") {
      return [...posts].sort((a, b) => (
        b.view_count - a.view_count
      ))
    }
    return posts;
  }

  useEffect(() => {
    if(regionData) {
      const sorted = sortPosts(regionData.posts, sortType)
      setSortedPosts(sorted)
    }
  }, [regionData, sortType, sortRegionType])
  

  console.log(location_id);
  console.log(community);
  console.log( regionData);

  if (!regionData) return (<div>지역 데이터를 찾을 수 없습니다.</div>);

  const handleRegion = (e:any) => (
    setSortRegionType(e.target.value),
    navigate(`/community/${e.target.value}`),
    console.log(location_id),
    console.log(e.target.value)
  )

  const handleArray = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value)
  }


  return (
    <>
    {/* <div className='container max-w-[1200px] mx-auto px-10 py-8 overflow-hidden h-[100vh]'> */}
    {/* 기본적으로 숨겼다가(hidden) 사이즈가 lg(1024px)가 되면 block */}
    <div className='block 2xl:px-[100px]'>
      {/* min-w-[1200px]로 1200px보다 작아지면 가로 스크롤이 생김 -> 1200px 화면 유지 */}
      <div className= {`container min-w-[1200px] mx-auto px-10 py-8 overflow-hidden h-[100vh] `}>
        <div className='flex'>
          {
            icons.map((icon) => (
              icon.icon_id === regionData.locations.location_id ? <img key={icon.icon_id} src={icon.file} alt={icon.name} className='w-12 h-12 mr-3'/> : <React.Fragment key={icon.icon_id}></React.Fragment>
            ))
          }
        <h1 className='font-okgung text-5xl font-bold mb-4'>{regionData.locations.category}</h1>
        </div>
        <select onChange={handleRegion} className='mb-2 border-2' defaultValue={sortRegionType}>
        <option value="default" disabled>타 지역으로 이동</option>
        {
          community.map((region) => (
            <option key={region.locations.location_id} value={region.locations.location_id}>{region.locations.category}</option>
          ))
        }
      </select>


      <hr className='mb-5 border-1.8'/>

        <div className=' overflow-y-scroll max-h-[calc(100vh-160px)] '>
        {/* <div className='  '> */}
          <div className='mb-8 flex'>
            {/* <img src={regionData.locations.logation_img} alt={regionData.locations.city} className='rounded-xl w-[550px] h-[350px]'/> */}
            <div className='rounded-xl w-[500px] '>
              <Carousel  />
            </div>
            <div className='px-8 py-12'>
              <h2 className='text-4xl mx-auto mb-4'>{regionData.locations.city}</h2>
              <p className='my-4'>
                <span className='text-gray-600/50'>인기도시</span>
                <span></span>
              </p>
              <div className='flex my-4'>
                <span className='mr-12 text-gray-600/50'>날씨</span>
                <div className='flex justify-between text-blue-700/60'>
                  <span className='mx-3'>{regionWeather?.description}</span>
                  <span>|</span>
                  <span className='mx-3'>온도 {regionWeather?.temperature}</span>
                  <span>|</span>
                  <span className='mx-3'>습도 {regionWeather?.humidity}</span>
                  <span>|</span>
                  <span className='mx-3'>풍속 {regionWeather?.wind_speed}</span>
                  <span>|</span>
                  <span className='mx-3'>예보 {regionWeather?.wind_speed}</span>
                </div>
              </div>
              <p className='mt-6 '>{regionData.locations.information}</p>
            </div>
          </div>

      <select onChange={handleArray} className='mb-3 border-2' defaultValue={sortType}>
        <option value="default"  disabled>날짜순, 조회순 정렬</option>
        <option value="date">날짜순</option>
        <option value="search">조회순</option>
      </select>
      {/* grid-cols-1 : 기본적으로 (모바일 화면 등 작은 화면에서 한 열로 배치) / md:grid-cols-2 중간 크기(768px) 이상의 화면에서 두열로 배치 */}
      <div className='grid grid-cols-2 gap-6 '>
        {
          sortedPosts.map((post) => (
            <PostCard key={post.post_id} post={post}/>
          ))
        }
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
