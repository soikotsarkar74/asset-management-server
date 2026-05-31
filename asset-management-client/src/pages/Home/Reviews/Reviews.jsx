import React, { use } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import ReviewCard from "./ReviewCard";

// Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const Reviews = ({ reviewsPromise }) => {
  const reviews = use(reviewsPromise);

  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Clients Say
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Trusted by businesses worldwide, AssetVerse helps teams track,
            manage, and secure their assets with confidence.
          </p>
        </div>

        {/* Reviews Slider */}
        <Swiper
          loop
          centeredSlides
          grabCursor
          effect="coverflow"
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          coverflowEffect={{
            rotate: 25,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: false,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="pb-12"
        >
          {reviews?.map((review) => (
            <SwiperSlide key={review.id} className="px-4">
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Reviews;
