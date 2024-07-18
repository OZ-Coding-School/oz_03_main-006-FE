import { useState, useEffect } from 'react';
import DropdownList from '../components/DropdownList';
import { locationList } from '../data/locationList';

const HomePage = () => {
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const centerX = 36.3595704;
  const centerY = 127.105399;
  const [marker, setMarker] = useState<naver.maps.Marker[] | null>(null);

  // 지도 생성
  useEffect(() => {
    const mapOptions = {
      center: new naver.maps.LatLng(centerX, centerY),
      zoom: 7,
      disableDoubleClickZoom: true,
      disableDoubleTapZoom: true,
      maxZoom: 12,
      minZoom: 7,
      tileSpare: 2,
    };
    const mapInstance = new naver.maps.Map('map', mapOptions);
    setMap(mapInstance);
  }, []);

  // 마커생성하고 마커를 담은 배열을 state로 관리 -> dropdownlist로 넘겨서 list 특정지역 호버시 해당 지역의 마커 bound animation 줄 예정
  useEffect(() => {
    if (map) {
      const MarkerArr = locationList.map((item) => {
        return new naver.maps.Marker({
          position: new naver.maps.LatLng(item.latitude, item.longitude),
          map: map,
          animation: naver.maps.Animation.DROP,
          title: item.name,
        });
      });
      setMarker(MarkerArr);
    }
  }, [map]);

  return (
    <>
      <div id='map' className='relative h-full w-full'></div>
      <DropdownList map={map} marker={marker}></DropdownList>
    </>
  );
};

export default HomePage;
