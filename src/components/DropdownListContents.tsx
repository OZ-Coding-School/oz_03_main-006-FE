import React from 'react';
import { Link } from 'react-router-dom';
import { locationList } from '../data/locationList';
import { FaArrowRight } from 'react-icons/fa';

interface DropdownListContentsProps {
  startIndex: number;
  lastIndex: number;
  moveCenter: (name: string) => void;
  clearMoveCenterTimeout: () => void;
}

const DropdownListContents: React.FC<DropdownListContentsProps> = ({
  startIndex,
  lastIndex,
  moveCenter,
  clearMoveCenterTimeout,
}) => {
  return (
    <>
      {locationList.slice(startIndex, lastIndex).map((item) => (
        <Link to={`/community/${item.location_id}`} key={item.location_id}>
          <li
            className='group flex items-center py-2 pl-4 font-chosun hover:bg-[#233e7815]'
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
      ))}
    </>
  );
};

export default DropdownListContents;
