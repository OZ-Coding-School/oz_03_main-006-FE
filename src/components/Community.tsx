import { useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { Locations, Post } from '../../config/types';
import PostCard from './PostCard';
import Carousel from './Carousel';
import icons from '../data/icons.json';
import axiosInstance from '../api/axios';
import Pagination from 'react-js-pagination';
import './pagination.scss';
import Loading from './common/Loading';
import { RxDoubleArrowLeft, RxDoubleArrowRight } from 'react-icons/rx';

interface Weather {
  POP: number;
  SKY: number;
  TMN: number;
  TMX: number;
  location: number;
  sky_status: string;
  base_date?: string;
  base_time?: string;
  fcst_date?: string;
}

const Community = () => {
  const { location_id } = useParams<{ location_id: string }>();

  const [sortType, setSortType] = useState<string>('popular');
  const [sortRegionType, setSortRegionType] = useState<string>('default');
  const [community, setCommunity] = useState<Locations>();
  const [communitys, setCommunitys] = useState<Locations[]>([]);
  const [weather, setWeather] = useState<Weather>();
  const [forecast, setForecast] = useState<Weather>();
  const [isLoading, setIsLoading] = useState(true);

  const [currentPosts, setCurrentPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();

  const postPerPage: number = 8;

  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
      const fetchChange = async () => {
        if (sortType === 'date') {
          const response = await axiosInstance(
            `/posts/${location_id}/latest/?page=${page}/`
          );
          setCurrentPosts(response.data.results);
        } else if (sortType === 'popular') {
          const response = await axiosInstance(
            `/posts/${location_id}/popular/?page=${page}/`
          );
          setCurrentPosts(response.data.results);
        }
      };
      fetchChange();
    },
    [location_id, sortType]
  );

  const fetchAllPosts = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/posts/${location_id}/all/popular/`
      );
      setAllPosts(response.data);
    } catch (error) {
      console.error('게시물을 불러오는데 실패했습니다.', error);
    }
  }, [location_id]);

  const fetchPostsPopular = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/posts/${location_id}/popular/`
      );
      setCurrentPosts(response.data.results);
    } catch (error) {
      console.error('게시물을 불러오는데 실패했습니다.', error);
    }
  }, [location_id]);
  const fetchPostsLatest = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/posts/${location_id}/latest/`);
      setCurrentPosts(response.data.results);
    } catch (error) {
      console.error('게시물을 불러오는데 실패했습니다.', error);
    }
  }, [location_id]);

  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/weather/today/${location_id}/`
      );
      setWeather(response.data[0]);
    } catch (error) {
      console.error('날씨 데이터를 가져오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  }, [location_id]);

  const fetchTomorrowWeather = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/weather/tomorrow/${location_id}/`
      );
      setForecast(response.data[0]);
    } catch (error) {
      console.error('날씨 데이터를 가져오는데 실패했습니다: ', error);
    } finally {
      setIsLoading(false);
    }
  }, [location_id]);

  const fetchLocations = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/locations/${location_id}/`);
      setCommunity(response.data);
    } catch (error) {
      console.log('지역 정보를 불러오는데 실패했습니다: ', error);
    }
  }, [location_id]);

  const fetchCommunitys = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/locations/`);
      setCommunitys(response.data);
    } catch (error) {
      console.log('지역 목록을 불러오는데 실패했습니다: ', error);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    fetchLocations();
    fetchCommunitys();
    fetchTomorrowWeather();
    fetchAllPosts();
    if (sortType === 'popular') {
      fetchPostsPopular();
    } else if (sortType === 'date') {
      fetchPostsLatest();
    }
    setPage(1);
  }, [location_id, sortType]);

  const handleRegion = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => (
      setSortRegionType(e.target.value),
      navigate(`/community/${e.target.value}`)
    ),
    [navigate]
  );

  const handleArray = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value);
  }, []);

  return (
    <>
      {!community ? (
        <Loading />
      ) : (
        <>
          <div className='h-screen w-full overflow-hidden'>
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
                <div className='mb-8 flex'>
                  <div className='w-[500px] rounded-xl'>
                    <Carousel images={community.images} community={community} />
                  </div>
                  <div className='px-8 pb-12 pt-3'>
                    <h2 className='mx-auto mb-4 text-4xl font-medium'>
                      {community?.city}
                    </h2>
                    <p className='mb-4 mt-8'>
                      <span className='mr-10 text-gray-600/70'>인기도시</span>
                      <span className='text-blue-700/60'>
                        {community?.popular_cities === 'None' ? (
                          <span className='text-gray-950/60'>
                            인기 도시 선정 진행 중입니다. 여러분의 의견을
                            기다립니다!
                          </span>
                        ) : (
                          <React.Fragment>
                            {community?.popular_cities}
                          </React.Fragment>
                        )}
                      </span>
                    </p>
                    <div className='mb-4 mt-4 flex'>
                      <span className='mr-14 text-gray-600/70'>날씨</span>
                      <div className='my-auto flex justify-between text-blue-700/60'>
                        {isLoading ? (
                          <p className='mx-3'>날씨 정보를 불러오는 중...</p>
                        ) : (
                          <React.Fragment>
                            <span className='mx-3'>{weather?.sky_status}</span>
                            <span>|</span>
                            <span className='mx-3'>
                              최고 온도 {weather?.TMX}°C
                            </span>
                            <span>|</span>
                            <span className='mx-3'>
                              최저 온도 {weather?.TMN}°C
                            </span>
                            <span>|</span>
                            <span className='mx-3'>
                              강수확률 {weather?.POP}%
                            </span>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                    <div className='mb-8 flex'>
                      <span className='mr-3 text-gray-600/70'>내일의 날씨</span>
                      <div className='my-auto flex justify-between text-blue-700/60'>
                        {isLoading ? (
                          <p className='mx-3'>날씨 정보를 불러오는 중...</p>
                        ) : (
                          <React.Fragment>
                            <span className='mx-3'>{forecast?.sky_status}</span>
                            <span>|</span>
                            {forecast?.TMX === null ? (
                              <></>
                            ) : (
                              <>
                                <span className='mx-3'>
                                  최고 온도 {forecast?.TMX}°C
                                </span>
                                <span>|</span>
                              </>
                            )}
                            {forecast?.TMN === null ? (
                              <></>
                            ) : (
                              <>
                                <span className='mx-3'>
                                  최저 온도 {forecast?.TMN}°C
                                </span>
                                <span>|</span>
                              </>
                            )}

                            <span className='mx-3'>
                              강수확률 {forecast?.POP}%
                            </span>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                    <p className=''>{community?.description}</p>
                  </div>
                </div>

                <select
                  onChange={handleArray}
                  className='mb-3 mt-7 cursor-pointer rounded-sm border px-2 py-1 text-sm text-[#6c6c6c] hover:bg-[#eeeeeec8] hover:text-[#5b5b5b] focus:outline-none'
                  value={sortType}
                >
                  <option value='date'>날짜순</option>
                  <option value='popular'>조회순</option>
                </select>
                <div className='mr-3 grid grid-cols-2 gap-6'>
                  {currentPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
                {currentPosts && currentPosts.length > 0 ? (
                  <Pagination
                    activePage={page}
                    itemsCountPerPage={postPerPage}
                    totalItemsCount={allPosts.length}
                    pageRangeDisplayed={5}
                    prevPageText={'<'}
                    nextPageText={'>'}
                    onChange={handlePageChange}
                    itemClass='pagination-item'
                    linkClass='pagination-link'
                    activeClass='active'
                    activeLinkClass=''
                    firstPageText={<RxDoubleArrowLeft />}
                    lastPageText={<RxDoubleArrowRight />}
                    itemClassFirst='pagination-nav'
                    itemClassLast='pagination-nav'
                    itemClassPrev='pagination-nav'
                    itemClassNext='pagination-nav'
                    disabledClass='disabled'
                  />
                ) : (
                  <div className='py-8 text-center text-gray-600'>
                    <div>첫 번째 게시글의 주인공이 되어보세요!</div>
                    <div className='mt-2'>
                      당신의 특별한 경험이 다른 여행자들에게 영감이 될 수
                      있어요.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Community;
