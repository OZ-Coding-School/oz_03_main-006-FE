import { IoMdArrowDropdown } from 'react-icons/io';
import { useRef, useState } from 'react';
import { locationList } from '../data/locationList';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

interface DropdownListProps {
  map: naver.maps.Map | null;
  marker: naver.maps.Marker[] | null;
}

const DropdownList: React.FC<DropdownListProps> = ({ map, marker }) => {
  const timeoutRef = useRef<number | null>(null);
  const [choosedMarker, setChoosedMarker] = useState<naver.maps.Marker | null>(
    null
  );
  const [isFold, setIsFold] = useState<boolean>(true);

  const toggleFold = () => {
    setIsFold(!isFold);
  };

  const moveCenter = (location: string): void => {
    const selectedLocation = locationList.find(
      (item) => item.name === location
    );
    if (selectedLocation && map) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        const boundsLocation = new naver.maps.LatLng(
          selectedLocation.latitude,
          selectedLocation.longitude
        );
        map.morph(boundsLocation, 10);
        updateMarkerAnimation(location);
      }, 300);
    }
  };

  const clearMoveCenterTimeout = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (choosedMarker) {
      choosedMarker.setAnimation(null);
    }
  };

  const updateMarkerAnimation = (location: string): void => {
    if (marker) {
      if (choosedMarker) {
        choosedMarker.setAnimation(null);
      }
      const selectedMarker = marker.find(
        (item) => item.getTitle() === location
      );
      if (selectedMarker) {
        selectedMarker.setAnimation(naver.maps.Animation.BOUNCE);
        setChoosedMarker(selectedMarker);
      }
    }
  };

  return (
    <div className='absolute right-[3%] top-[3%]'>
      <ul className='flex w-[201px] flex-col overflow-hidden rounded-b-lg rounded-t-lg bg-[#F5F5F5] bg-opacity-60'>
        <li
          className='mb-1 flex cursor-pointer items-center justify-between p-4 pb-0'
          onClick={toggleFold}
        >
          {isFold ? '펼치기' : '접기'}
          <IoMdArrowDropdown
            className={`transition-transform duration-700 ${isFold ? '' : 'rotate-180'}`}
          />
        </li>
        <div className='my-2 h-[1px] w-full bg-[#575757] bg-opacity-10'></div>
        {/* 0~4는 무조건 보여줘야 하는 리스트 */}
        {locationList.slice(0, 4).map((item) => {
          return (
            <Link to={`/community/${item.location_id}`} key={item.location_id}>
              <li
                className='group mb-2 flex items-center pl-4 font-chosun hover:bg-[#575757] hover:bg-opacity-10'
                onMouseEnter={() => moveCenter(item.name)}
                onMouseLeave={clearMoveCenterTimeout}
              >
                <img
                  className='mr-5 h-[21px] w-[21px]'
                  src={item.src}
                  alt={item.alt}
                />
                {item.name}
                <FaArrowRight className='ml-auto mr-3 hidden text-xs group-hover:inline' />
              </li>
            </Link>
          );
        })}
        <div
          className={`linear transition-[max-height] duration-700 ${
            isFold ? 'max-h-0' : 'max-h-[100vh]'
          }`}
        >
          {/* 나머지는 fold가 아닐 때만 보여줘야 하는 리스트 */}
          {locationList.slice(4, 18).map((item) => {
            return (
              <Link
                to={`/community/${item.location_id}`}
                key={item.location_id}
              >
                <li
                  className='group mb-2 flex items-center pl-4 font-chosun hover:bg-[#575757] hover:bg-opacity-10'
                  onMouseEnter={() => moveCenter(item.name)}
                  onMouseLeave={clearMoveCenterTimeout}
                >
                  <img
                    className='mr-5 h-[21px] w-[21px]'
                    src={item.src}
                    alt={item.alt}
                  />
                  {item.name}
                  <FaArrowRight className='ml-auto mr-3 hidden text-xs group-hover:inline' />
                </li>
              </Link>
            );
          })}
        </div>
      </ul>
    </div>
  );
};

export default DropdownList;
