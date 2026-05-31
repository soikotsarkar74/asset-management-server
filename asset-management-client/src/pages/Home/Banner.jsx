

import React from "react";
import bannerImage1 from "../../assets/banner1.jpg";
import bannerImage2 from "../../assets/banner2.jpg";
import bannerImage3 from "../../assets/banner3.jpg";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const Banner = () => {
  return (
    <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
      
      {/* Slide 1 */}
      <div className="relative">
        <img src={bannerImage1} className="h-[500px] object-cover w-full" />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold">
            Smart Asset Management
          </h1>
          <p className="mt-3 text-sm md:text-lg text-center max-w-2xl">
            Track, assign, and manage all your company assets efficiently with AssetVerse.
          </p>
        </div>
      </div>

      {/* Slide 2 */}
      <div className="relative">
        <img src={bannerImage2} className="h-[500px] object-cover w-full" />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold">
            Manage Employees & Assets Together
          </h1>
          <p className="mt-3 text-sm md:text-lg text-center max-w-2xl">
            Simplify HR operations with real-time asset tracking and employee management.
          </p>
        </div>
      </div>

      {/* Slide 3 */}
      <div className="relative">
        <img src={bannerImage3} className="h-[500px] object-cover w-full" />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold">
            Secure & Scalable System
          </h1>
          <p className="mt-3 text-sm md:text-lg text-center max-w-2xl">
            Built for modern companies to ensure secure, scalable and efficient asset control.
          </p>
        </div>
      </div>

    </Carousel>
  );
};

export default Banner;