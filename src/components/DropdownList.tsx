import { IoMdArrowDropup } from 'react-icons/io';
import { useRef } from 'react';
import { locationList } from '../data/locationList';

interface DropdownListProps {
  map: naver.maps.Map | null;
  marker: naver.maps.Marker[] | null;
}

const DropdownList: React.FC<DropdownListProps> = ({ map, marker }) => {
  console.log(marker);
  const timeoutRef = useRef<number | null>(null);

  // 해당 하는 지역으로 zoomin + move
  const moveCenter = (location: string) => {
    const selectedLocation = locationList.find(
      (item) => item.name === location
    );
    if (selectedLocation && map) {
      if (timeoutRef.current) {
        // 다른 지역으로 이동했을 때 기존의 이벤트 삭제
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        const boundsLocation = new naver.maps.LatLng(
          selectedLocation.latitude,
          selectedLocation.longitude
        );
        map.morph(boundsLocation, 10);
      }, 500);
    }
  };

  // 지도 이동 하기 전에, 또 다른 지역이 아니라 아예 리스트 밖으로 나갔을 때 이벤트 삭제
  const clearMoveCenterTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <div className='absolute right-[3%] top-[3%]'>
      <ul className='flex w-[201px] flex-col overflow-hidden rounded-b-lg rounded-t-lg bg-[#F5F5F5] bg-opacity-60'>
        <li className='mb-1 flex items-center justify-between p-4 pb-0'>
          접기
          <IoMdArrowDropup />
        </li>
        <div className='my-2 h-[1px] w-full bg-[#575757] bg-opacity-10'></div>
        {locationList.map((item, index) => (
          <li
            key={index}
            className='mb-2 flex items-center pl-4 hover:bg-[#575757] hover:bg-opacity-10'
            onMouseEnter={() => moveCenter(item.name)}
            onMouseLeave={clearMoveCenterTimeout}
          >
            <img
              className='mr-5 h-[21px] w-[21px]'
              src={item.src}
              alt={item.alt}
            ></img>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownList;
