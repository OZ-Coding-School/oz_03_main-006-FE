import { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    const mapOptions = {
      center: new naver.maps.LatLng(36.3595704, 127.105399),
      zoom: 7,
      disableDoubleClickZoom: true,
      disableDoubleTapZoom: true,
      maxZoom: 13,
      minZoom: 7,
    };
    const map = new naver.maps.Map('map', mapOptions);
  }, []);

  return <div id='map' className='h-full w-full'></div>;
};

export default HomePage;
