import React from 'react';
import { Navigation, Pagination, A11y, Autoplay, EffectFlip} from 'swiper/modules'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import banner1 from '../assets/img1.jpg';
import banner2 from '../assets/img2.jpg';
import banner3 from '../assets/img3.jpg';
import banner4 from '../assets/img4.jpg';

const ImageSwiper = () => {
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay, EffectFlip]} 
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        effect='flip'
      >
        <SwiperSlide>
          <img src={banner1} alt='error' style={{ height: '500px', width: '100%' }} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={banner2} alt='error' style={{ height: '500px', width: '100%' }} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={banner4} alt='error' style={{ height: '500px', width: '100%' }} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={banner3} alt='error' style={{ height: '500px', width: '100%' }} />
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default ImageSwiper;
