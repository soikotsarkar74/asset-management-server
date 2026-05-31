import React from "react";
import bannerImage1 from "../../assets/banner1.jpg";
import bannerImage2 from "../../assets/banner2.jpg";
import bannerImage3 from "../../assets/banner3.jpg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
const Banner = () => {
  return (
    <Carousel autoPlay={true}
    infiniteLoop={true}
    >
      <div>
        <img src={bannerImage1}/>
      
      </div>
      <div>
      <img src={bannerImage2}/>
        
      </div>
      <div>
        <img src={bannerImage3}/>
       
      </div>
    </Carousel>
  )
}
export default Banner;

