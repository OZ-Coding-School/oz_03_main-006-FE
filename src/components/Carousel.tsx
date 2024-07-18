import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './Carousel.css'

const Carousel = () => {
    const settings = {
        dots: true, // 개수 표시 점
        infinite: true, // 무한 캐러셀
        speed: 500, // 다음 컨텐츠 까지의 속도
        slidesToScroll: 1, // 스크롤 시 넘어가는 컨텐츠 수
        // centerMode: true, // 현재 컨텐츠 가운데 정렬
        autoplay: true, // 자동 캐러셀
        autoplaySpeed: 2000, // 자동 캐러셀 속도
        draggable: true,
        initialSlide: 1, // 첫 컨텐츠 번호
        pauseOnFocus: true, // focus시 정지
        pauseOnHover: true, // hover시 정지
    }
  return (
    
    <>
    <div className='carousel'>
        <Slider {...settings} className='rounded-xl'>
            <img src='/images/서울.jpg' alt="서울" />
            <img src='/images/대구.png' alt="대구" />
            <img src='/images/부산.png' alt="부산" /> 
        </Slider>
    </div>
    </>
  )
}
export default Carousel