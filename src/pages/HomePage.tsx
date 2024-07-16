import { useState, useEffect } from 'react';
import DropdownList from '../components/DropdownList';

const HomePage = () => {
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const centerX = 36.3595704;
  const centerY = 127.105399;

  useEffect(() => {
    const mapOptions = {
      center: new naver.maps.LatLng(centerX, centerY),
      zoom: 7,
      disableDoubleClickZoom: true,
      disableDoubleTapZoom: true,
      maxZoom: 10,
      minZoom: 7,
    };
    const mapInstance = new naver.maps.Map('map', mapOptions);
    setMap(mapInstance);
  }, []);

  return (
    <>
      <div id='map' className='relative h-full w-full'></div>
      <DropdownList map={map}></DropdownList>
    </>
  );
};

export default HomePage;
