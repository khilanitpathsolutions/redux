import React from "react";
import {
  Navigation,
  Pagination,
  A11y,
  Autoplay,
  EffectFlip,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import banner1 from "../assets/img1.jpg";
import banner2 from "../assets/img2.jpg";
import banner3 from "../assets/img3.jpg";
import banner4 from "../assets/img4.jpg";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ImageSwiper = () => {
  const swiperImageStyles = `
    .swiper-image {
      height: 500px;
      width: 100%;
    }

    @media (max-width: 768px) {
      .swiper-image {
        height: 250px;
      }
    }
  `;

  return (
    <>
      <style>{swiperImageStyles}</style>
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay, EffectFlip]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        effect="flip"
      >
        <SwiperSlide>
          <LazyLoadImage src={banner1} alt="error" className="swiper-image" />
        </SwiperSlide>
        <SwiperSlide>
          <LazyLoadImage src={banner2} alt="error" className="swiper-image" />
        </SwiperSlide>
        <SwiperSlide>
          <LazyLoadImage src={banner4} alt="error" className="swiper-image" />
        </SwiperSlide>
        <SwiperSlide>
          <LazyLoadImage src={banner3} alt="error" className="swiper-image" />
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default ImageSwiper;
