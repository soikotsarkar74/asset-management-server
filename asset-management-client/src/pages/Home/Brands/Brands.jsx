import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import brand1 from "../../../assets/brand1.jpg";
import brand2 from "../../../assets/brand2.jpg";
import brand3 from "../../../assets/brand3.jpg";
import brand4 from "../../../assets/brand4.jpg";
import brand5 from "../../../assets/brand5.jpg";
const Brands = () => {
	return (
		<section className="py-16 bg-base-200">
			<div className="max-w-6xl mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-10">
					Trusted by Leading Companies
				</h2>
				<Swiper
					modules={[Autoplay]}
					spaceBetween={30}
					slidesPerView={2}
					autoplay={{
						delay: 2000,
						disableOnInteraction: false,
					}}
					loop={true}
					speed={800}
					grabCursor={true}
					breakpoints={{
						640: { slidesPerView: 2 },
						768: { slidesPerView: 3 },
						1024: { slidesPerView: 4 },
					}}
				>
					{[brand1, brand2, brand3, brand4, brand5].map((brand, index) => (
						<SwiperSlide key={index}>
							<div className="flex justify-center items-center cursor-grab active:cursor-grabbing">
								<img
									src={brand}
									alt={`Brand ${index + 1}`}
									className="h-20 object-contain grayscale hover:grayscale-0 transition duration-300"
								/>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	);
};

export default Brands;