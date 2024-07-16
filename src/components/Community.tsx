import { useNavigate, useParams } from 'react-router-dom';
import communityData from '../data/community.json'
import weatherData from '../data/weather.json'
import { useEffect, useState } from 'react';
import { Post } from '../../config/types';

interface Locations {
  location_id: number;
  city: string;
  distric: string;
  symbol?: string;
  population: number;
  information: string;
  category: string;
  location_img: string;
}

interface Weather {
  weather_id: number;
  location_id: number;
  temperature: number;
  humidity: number;
  description: string;
  wind_speed: number;
  updated_at: number;
}


interface CommunityPost {
  locations: Locations;
  posts: Post[]
}

// const weather : Weather[] = weatherData;


const Community: React.FC = () => {
  const { location_id } = useParams<{ location_id: string }>();
  const [sortedPosts, setSortedPosts] = useState<any[]>([])
  const [sortType, setSortType] = useState<string>("default")
  const [sortRegionType, setSortRegionType] = useState<string>("default")





  const navigate = useNavigate()
  
  // 날씨 정보 가져오기
  const regionWeather = weatherData.find((region) => {
    return region.location_id === parseInt(location_id || '0', 10)
  })
  console.log(regionWeather)

  // 총지역 데이터에서 각 지역 정보 가져오기 
  const regionData = communityData.find((region) => {
    console.log(location_id)
    console.log(region)
    return region.locations.location_id === parseInt(location_id || '0', 10)
  });
  console.log(regionData)


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
      // const currentRegion = regionData.locations.category
      // setSortRegionType(currentRegion)
    }
  }, [regionData, sortType, sortRegionType])
  

  console.log(location_id);
  console.log(communityData);
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
    <div className='container mx-auto px-10 py-8'>
      <h1 className='text-5xl font-bold mb-4'>{regionData.locations.category}</h1>
      <select onChange={handleRegion} className='mb-2 border-2' value={sortRegionType}>
        <option value="default" selected disabled>지역을 골라주세요</option>
        {
          communityData.map((region) => (
            <option key={region.locations.location_id} value={region.locations.location_id}>{region.locations.category}</option>
          ))
        }
      </select>


      <hr className='mb-5 border-1.8'/>


      <div className='mb-8 flex '>
        <img src={regionData.locations.logation_img} alt={regionData.locations.city} className='rounded-xl'/>
        <div className='px-4 py-12'>
          <h2 className='text-4xl mx-auto mb-4'>{regionData.locations.city}</h2>
          <p className='my-4'>
            <span className='text-gray-600/50'>인기도시</span>
            <span></span>
          </p>
          <p className='flex my-4  '>
            <span className='mr-12 text-gray-600/50'>날씨</span>
            <p className='flexjustify-between text-gray-600/50'>
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

      <select onChange={handleArray} className='mb-2 border-2' value={sortType}>
        <option value="default" selected disabled>날짜순, 조회순 정렬</option>
        <option value="date">날짜순</option>
        <option value="search">조회순</option>
      </select>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {
          sortedPosts.map((post) => (
            <div key={post.post_id} className='bg-white p-6 rounded-lg shadow-md flex'>
              <img src={post.representative_image_id} alt={post.title} className='size-[150px] mr-4 rounded-xl'/>
              <div>
                <h2 className='text-xl font-semibold mb-2'>{post.title}</h2>
                <p className='text-gray-600 mb-4'>{post.body}</p>
                <div className='flex justify-between text-sm text-gray-500'>
                  <span>{post.created_at}</span>
                  <span className='text-xs py-1'>{post.view_count} 조회수</span>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Community;
