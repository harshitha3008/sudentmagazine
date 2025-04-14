import React, { useRef } from 'react';

const TechnicalTemplate1 = ({ title, studentNames, content, coordinatorName, coordinatorPic, eventPics }) => {
  const imageRef = useRef(null);

  return (
    <div
      className="post-content max-w-4xl mx-auto bg-gradient-to-br from-red-50 to-orange-100 p-6 shadow-lg rounded-lg border border-orange-300 relative"
      style={{ height: '1123px', width: '794px' }} // A4 size in pixels at 96 DPI
    >
      {/* Title Section */}
      <h1 className="text-4xl font-serif font-bold text-orange-800 text-center border-b-2 border-orange-400 pb-4">
        {title}
      </h1>

      {/* Content Layout */}
      <div className="relative mt-6">
        {/* Image Section (Positioned Left) */}
        <div className="float-left mr-6 mb-4">
          <img
            ref={imageRef}
            src={eventPics[0]}
            alt="Event"
            className="w-64 h-64 object-cover rounded-lg shadow-md border-2 border-orange-400"
          />
        </div>

        {/* Content Section */}
        <div className="text-gray-800">
          <p
            className="text-base leading-relaxed text-justify"
            style={{ lineHeight: '1.8', fontSize: '16px' }}
          >
            {content}
          </p>
        </div>
      </div>

      {/* Clearfix to prevent layout issues */}
      <div className="clearfix"></div>

      {/* Coordinator Section */}
      <div className="absolute bottom-0 left-0 right-0 pt-6 border-t-2 border-orange-400 flex items-center bg-orange-50 p-4 rounded-b-lg shadow-md">
        <img
          src={coordinatorPic}
          alt={coordinatorName}
          className="w-14 h-14 rounded-full border-2 border-orange-400 shadow-md mr-4"
        />
        <div>
          <p className="text-orange-600 text-sm">Event Coordinator</p>
          <p className="text-lg font-medium text-orange-900">{coordinatorName}</p>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTemplate1;
