import { useState, useEffect, useRef } from 'react';
import DropdownList from '../components/DropdownList';
import { locationList } from '../data/locationList';

const HomePage = () => {
  const mapRef = useRef<naver.maps.Map | undefined>(undefined);
  const centerX = 36.0595704;
  const centerY = 127.805399;
  const [marker, setMarker] = useState<naver.maps.Marker[] | null>(null);

  useEffect(() => {
    const mapOptions = {
      center: new naver.maps.LatLng(centerX, centerY),
      zoom: 8,
      disableDoubleClickZoom: true,
      disableDoubleTapZoom: true,
      maxZoom: 9,
      minZoom: 8,
      tileSpare: 2,
    };
    const mapInstance = new naver.maps.Map('map', mapOptions);
    mapRef.current = mapInstance;

    const MarkerArr = locationList.map((item) => {
      return new naver.maps.Marker({
        position: new naver.maps.LatLng(item.latitude, item.longitude),
        map: mapRef.current,
        animation: naver.maps.Animation.DROP,
        title: item.name,
      });
    });
    setMarker(MarkerArr);

    naver.maps.Event.addListener(mapRef.current, 'zoom_changed', () => {
      if (mapRef.current) {
        const newZoom = mapRef.current.getZoom();
        mapRef.current.setOptions({
          maxZoom: newZoom + 1,
          minZoom: newZoom - 1,
        });
      }
    });
  }, []);

  return (
    <>
      <div id='map' className='relative h-full w-full'></div>
      <DropdownList map={mapRef.current} marker={marker}></DropdownList>
    </>
  );
};

export default HomePage;
