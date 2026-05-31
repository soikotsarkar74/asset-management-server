// import React from 'react';

// const ReviewCard = ({review}) => {
// 	const {} =review;
// 	return (
// 		<div>
			
// 		</div>
// 	);
// };

// export default ReviewCard;

import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({ review }) => {
  const { name, role, company, rating, comment, image } = review;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition duration-300">
      
      {/* User Info */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={image}
          alt={name}
          className="w-14 h-14 rounded-full object-cover border"
        />
        <div>
          <h4 className="font-semibold text-lg">{name}</h4>
          <p className="text-sm text-gray-500">
            {role} • {company}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`${
              index < Math.round(rating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-500">
          {rating}
        </span>
      </div>

      {/* Comment */}
      <p className="text-gray-600 text-sm leading-relaxed">
        “{comment}”
      </p>
    </div>
  );
};

export default ReviewCard;
