import React from 'react';

const TechnicalTemplate6 = ({ title, studentNames, content, coordinatorName, coordinatorPic, eventPics }) => {
  const splitIndex = Math.floor(content.length / 2);

  return (
    <div
      className="post-content max-w-4xl mx-auto bg-rose-50 p-6 rounded-lg shadow-md border border-orange-300"
      style={{ height: '1123px', width: '794px', position: 'relative' }}
    >
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-orange-800 mb-6">{title}</h1>

      {/* Content: First Half */}
      <div className="text-gray-800 text-sm leading-relaxed text-justify mb-4" style={{ lineHeight: '1.8', fontSize: '16px' }}>
        {content.substring(0, splitIndex)}
      </div>

      {/* Horizontal Images in Center */}
      <div className="flex justify-center gap-4 my-4">
        {eventPics.slice(0, 3).map((pic, index) => (
          <img
            key={index}
            src={pic}
            alt={`Event ${index + 1}`}
            className="w-60 h-60 object-cover rounded-lg shadow-md border border-orange-300"
          />
        ))}
      </div>

      {/* Content: Second Half */}
      <div className="text-gray-800 text-sm leading-relaxed text-justify" style={{ lineHeight: '1.8', fontSize: '16px' }}>
        {content.substring(splitIndex)}
      </div>

      {/* Coordinator Section */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col md:flex-row items-center bg-orange-600 text-white p-4 rounded-t-lg shadow-md"
        style={{ paddingTop: '20px' }}
      >
        <img
          src={coordinatorPic}
          alt={coordinatorName}
          className="w-16 h-16 rounded-full md:mr-4 border-2 border-white mb-3 md:mb-0"
        />
        <div className="text-center md:text-left">
          <p className="text-lg font-medium">{coordinatorName}</p>
          <p className="text-sm">Student Coordinator</p>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTemplate6;
