import React, { useEffect, useRef, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { locationList } from '../data/locationList';
import DropdownListContents from './DropdownListContents';
import axios from '../api/axios';
import confetti from 'canvas-confetti';

interface DropdownListProps {
  map: naver.maps.Map | undefined;
  marker: naver.maps.Marker[] | null;
}

interface Highlights {
  location_id: number;
  highlights: string;
}

const DropdownList: React.FC<DropdownListProps> = ({ map, marker }) => {
  const timeoutRef = useRef<number | null>(null);
  const choosedMarkerRef = useRef<naver.maps.Marker | null>(null);
  const infoWindowRef = useRef<naver.maps.InfoWindow | null>(null);
  const [isFold, setIsFold] = useState<boolean>(true);
  const [locationHighlights, setLocationHighlights] = useState<
    Highlights[] | null
  >(null);
  const confettiRef = useRef<Promise<void> | null>(null);

  const toggleFold = () => {
    setIsFold((prev) => !prev);
  };

  const moveCenter = (location: string, locationId: number): void => {
    const selectedLocation = locationList.find(
      (item) => item.name === location
    );
    if (selectedLocation && map) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const morphMap = (): Promise<void> => {
        return new Promise((resolve) => {
          const boundsLocation = new naver.maps.LatLng(
            selectedLocation.latitude,
            selectedLocation.longitude
          );
          map.morph(boundsLocation, 9);
          setTimeout(() => resolve(), 300);
        });
      };

      timeoutRef.current = window.setTimeout(() => {
        morphMap().then(() => {
          updateMarkerAnimation(location);
          showInfoWindow(location, locationId);
        });
      }, 300);
    }
  };

  const clearMoveCenterTimeout = (): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (choosedMarkerRef.current) {
      choosedMarkerRef.current.setAnimation(null);
    }
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  };

  const updateMarkerAnimation = (location: string): void => {
    if (marker) {
      if (choosedMarkerRef.current) {
        choosedMarkerRef.current.setAnimation(null);
      }
      const selectedMarker = marker.find(
        (item) => item.getTitle() === location
      );
      if (selectedMarker) {
        selectedMarker.setAnimation(naver.maps.Animation.BOUNCE);
        choosedMarkerRef.current = selectedMarker;
      }
    }
  };

  useEffect(() => {
    axios
      .get('/locations/highlights/')
      .then((res) => setLocationHighlights(res.data));
  }, []);

  const showInfoWindow = (location: string, locationId: number): void => {
    const selectedLocation = locationList.find(
      (item) => item.name === location
    );
    let selectedLocationHighlight: Highlights | undefined;
    let selectedLocationArray: string[] = [];
    if (locationHighlights !== null) {
      selectedLocationHighlight = locationHighlights.find(
        (item) => item.location_id === locationId
      );
    }
    if (selectedLocationHighlight) {
      selectedLocationArray = selectedLocationHighlight.highlights.split(', ');
    }

    if (selectedLocation && map !== null) {
      const colors = ['#42c2f4', '#E894C1', '#f47575', '#44d0b0', '#8d7cf6'];
      const newInfoWindow = new naver.maps.InfoWindow({
        content: `
          <div class='info-window_container'>
            <div class='info-tail'></div>
            <h3 class='info-window_title' style='display: inline-flex;'><img class="info-title_img" src="${selectedLocation.src}"></img>${selectedLocation.name}</h3>
            <p class='info-window_activity'>${selectedLocation.highlights.메세지.활동.join(', ')}</p>
            ${selectedLocationArray
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
      infoWindowRef.current = newInfoWindow;
      if (map) {
        newInfoWindow.open(map, position);
        const h3Element = document.querySelector('.info-window_title');
        const rect = h3Element?.getBoundingClientRect();
        const confettiOrigin = rect
          ? {
              x: (rect.left + rect.right) / 2 / window.innerWidth,
              y: rect.top / window.innerHeight,
            }
          : { x: 0.5, y: 0.4 };
        confettiRef.current = confetti({
          spread: 70,
          angle: 90,
          ticks: 50,
          gravity: 3,
          decay: 0.94,
          startVelocity: 20,
          shapes: ['star'],
          particleCount: 30,
          scalar: 0.7,
          origin: confettiOrigin,
          colors: ['#42c2f4', '#E894C1', '#f47575', '#44d0b0', '#8d7cf6'],
        });
      }
    }
  };

  return (
    <div className='absolute right-[3%] top-[3%]'>
      <ul className='flex w-[201px] flex-col overflow-hidden rounded-b-lg rounded-t-lg bg-[#f5f5f5a5] pb-2 shadow-sm'>
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
        <DropdownListContents
          confettiRef={confettiRef}
          startIndex={0}
          lastIndex={4}
          moveCenter={moveCenter}
          clearMoveCenterTimeout={clearMoveCenterTimeout}
        />
        <div
          className={`linear transition-[max-height] duration-700 ${isFold ? 'max-h-0' : 'max-h-[100vh]'}`}
        >
          <DropdownListContents
            confettiRef={confettiRef}
            startIndex={4}
            lastIndex={18}
            moveCenter={moveCenter}
            clearMoveCenterTimeout={clearMoveCenterTimeout}
          />
        </div>
      </ul>
    </div>
  );
};

export default DropdownList;
