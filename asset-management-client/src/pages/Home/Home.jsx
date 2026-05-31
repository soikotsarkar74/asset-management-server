import React from 'react';
import Banner from './Banner';
import Features from './Features/Features';
import OurServices from './OurServices/OurServices';
import Brands from './Brands/Brands';
import OurTreast from './OurTreast/OurTreast';
import Reviews from './Reviews/Reviews';
import About from './About';
import Packages from '../Packages/Packages'

const reviewsPromise = fetch('/reviews.json').then(res => res.json());

const Home = () => {
	return (
		<div>
			<Banner/>
			<Features/>
			<OurServices/>
			<Brands/>
			<OurTreast/>
			<About/>
			 <Packages/> 
			<Reviews reviewsPromise={reviewsPromise}/>
		</div>
	);
};

export default Home;