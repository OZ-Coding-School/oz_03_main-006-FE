import React, { useRef, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { FaArrowRight } from 'react-icons/fa';
import { locationList } from '../data/locationList';
import { Link } from 'react-router-dom';

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
  const [infoWindow, setInfoWindow] = useState<naver.maps.InfoWindow | null>(
    null
  );

  const toggleFold = () => {
    setIsFold(!isFold);
  };

  // 선택된 지역으로 지도가 움직이는 함수
  const moveCenter = (location: string): void => {
    const selectedLocation = locationList.find(
      (item) => item.name === location
    );
    if (selectedLocation && map) {
      // 지도가 움직이기 전에 다른 지역이 선택되면, setTimeout 취소
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const morphMap = (): Promise<void> => {
        return new Promise((resolve) => {
          const boundsLocation = new naver.maps.LatLng(
            selectedLocation.latitude,
            selectedLocation.longitude
          );
          map.morph(boundsLocation, 10);
          // map.morph에 대한 지연 시간을 직접 추가
          setTimeout(() => resolve(), 300); // 지연 시간을 적절하게 설정
        });
      };

      timeoutRef.current = window.setTimeout(() => {
        morphMap().then(() => {
          updateMarkerAnimation(location);
          showInfoWindow(location);
        });
      }, 300);
    }
  };

  // 지도가 움직이기 전에 다른 지역이 선택되는게 아니라, 아예 리스트를 벗어났을 경우 이벤트 삭제
  const clearMoveCenterTimeout = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (choosedMarker) {
      choosedMarker.setAnimation(null);
    }
    if (infoWindow) {
      infoWindow.close();
    }
  };

  // 선택된 마커에 bounce 애니메이션 추가
  const updateMarkerAnimation = (location: string): void => {
    if (marker) {
      // 이전의 선택된 마커가 있으면 이벤트 삭제
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

  // infowindow 생성
  const showInfoWindow = (location: string): void => {
    const selectedLocation = locationList.find(
      (item) => item.name === location
    );
    if (selectedLocation && map !== null) {
      const colors = ['#42c2f4', '#E894C1', '#f47575', '#44d0b0', '#8d7cf6'];
      const newInfoWindow = new naver.maps.InfoWindow({
        content: `
        <div class='info-window_container'>
          <div class='info-tail'></div>
            <h3 class='info-window_title'><img class="info-title_img" src="${selectedLocation.src}"></img>${selectedLocation.name}</h3>
          <p class='info-window_activity'>${selectedLocation.highlights.메세지.활동.join(', ')}</p>
          ${selectedLocation.highlights.메세지.명소
            .map((item, index) => {
              return `<div class='info-window_sights' style="background-color: ${colors[index % colors.length]}"><img class='info-img' src='marker.svg'></img>${item}</div>`;
            })
            .join('')}
        </div>
      `,
        borderWidth: 0,
        disableAnchor: true,
        backgroundColor: 'transparent',
        disableAutoPan: false,
      });
      const position = new naver.maps.LatLng(
        selectedLocation.latitude,
        selectedLocation.longitude
      );
      setInfoWindow(newInfoWindow);
      newInfoWindow.open(map, position);
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
          className={`linear transition-[max-height] duration-700 ${isFold ? 'max-h-0' : 'max-h-[100vh]'}`}
        >
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
