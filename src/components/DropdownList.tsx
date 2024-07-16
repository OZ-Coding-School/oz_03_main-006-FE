import { IoMdArrowDropup } from 'react-icons/io';
import { useRef } from 'react';
import { locationList } from '../data/locationList';

interface DropdownListProps {
  map: naver.maps.Map | null;
}

const DropdownList: React.FC<DropdownListProps> = ({ map }) => {
  const timeoutRef = useRef<number | null>(null);

  const moveCenter = (location: string) => {
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
        map.morph(boundsLocation, 9);
      }, 500);
    }
  };

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
          접기<img src=''></img>
          <IoMdArrowDropup />
        </li>
        <div className='my-2 h-[1px] w-full bg-[#575757] bg-opacity-10'></div>
        {locationList.map((item, index) => (
          <li
            key={index}
            className='mb-2 flex items-center pl-4 font-chosun hover:bg-[#575757] hover:bg-opacity-10'
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
