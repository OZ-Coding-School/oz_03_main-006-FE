import { useNavigate, useParams } from 'react-router-dom';
import communityData from '../data/community.json'
import weatherData from '../data/weather.json'
import { useEffect, useState } from 'react';
import { Post, tag } from '../../config/types';
import PostCard from './PostCard';

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



const Community: React.FC = () => {
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
    <div className='container max-w-[1200px] mx-auto px-10 py-8 '>
      <h1 className='font-okgung text-5xl font-bold mb-4'>{regionData.locations.category}</h1>
      <select onChange={handleRegion} className='mb-2 border-2' value={sortRegionType}>
        <option value="default" selected disabled>타 지역으로 이동</option>
        {
          community.map((region) => (
            <option key={region.locations.location_id} value={region.locations.location_id}>{region.locations.category}</option>
          ))
        }
      </select>


      <hr className='mb-5 border-1.8'/>


      <div className='mb-8 flex '>
        <img src={regionData.locations.logation_img} alt={regionData.locations.city} className='rounded-xl w-[550px] h-[350px]'/>
        <div className='px-4 py-12'>
          <h2 className='text-4xl mx-auto mb-4'>{regionData.locations.city}</h2>
          <p className='my-4'>
            <span className='text-gray-600/50'>인기도시</span>
            <span></span>
          </p>
          <p className='flex my-4  '>
            <span className='mr-12 text-gray-600/50'>날씨</span>
            <p className='flexjustify-between text-blue-700/60'>
              <span className='mx-3'>{regionWeather?.description}</span>
              <span>|</span>
              <span className='mx-3'>온도 {regionWeather?.temperature}</span>
              <span>|</span>
              <span className='mx-3'>습도 {regionWeather?.humidity}</span>
              <span>|</span>
              <span className='mx-3'>풍속 {regionWeather?.wind_speed}</span>
            </p>
          </p>
          <p className='mt-6 '>{regionData.locations.information}</p>
        </div>
      </div>

      <select onChange={handleArray} className='mb-3 border-2' value={sortType}>
        <option value="default" selected disabled>날짜순, 조회순 정렬</option>
        <option value="date">날짜순</option>
        <option value="search">조회순</option>
      </select>
      {/* grid-cols-1 : 기본적으로 (모바일 화면 등 작은 화면에서 한 열로 배치) / md:grid-cols-2 중간 크기(768px) 이상의 화면에서 두열로 배치 */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {
          sortedPosts.map((post) => (
            <PostCard post={post}/>
          ))
        }
      </div>
    </div>
  );
};

export default Community;
