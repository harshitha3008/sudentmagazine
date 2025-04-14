import React from 'react';

const TechnicalTemplate3 = ({ title, studentNames, content, coordinatorName, coordinatorPic, eventPics }) => {
  return (
    <div
      className="post-content max-w-4xl mx-auto bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-lg shadow-lg border-4 border-blue-500"
      style={{ height: '1123px', width: '794px', position: 'relative' }}
    >
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center text-blue-900 neon-text mb-6">{title}</h1>

      {/* Layout with Images on the Left */}
      <div className="flex">
        {/* Images Section on the Left */}
        <div className="flex flex-col justify-start mr-6 mt-20" style={{ height: 'calc(100% - 250px)' }}>
          {eventPics.slice(0, 3).map((pic, index) => (
            <img
              key={index}
              src={pic}
              alt={`Event ${index + 1}`}
              className={`w-64 h-60 object-cover rounded-lg shadow-xl border-2 border-blue-300 transition-transform duration-300 ease-in-out hover:scale-105 ${
                index !== eventPics.slice(0, 3).length - 1 ? 'mb-5' : ''
              }`}
            />
          ))}
        </div>

        {/* Content Section on the Right */}
        <div className="flex-1 bg-white p-4 rounded-lg shadow-md text-gray-800">
          <p
            className="text-sm leading-relaxed text-justify neon-text"
            style={{ lineHeight: '1.8', fontSize: '16px' }}
          >
            {content}
          </p>
        </div>
      </div>

      {/* Coordinator Section */}
      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col md:flex-row items-center bg-blue-600 text-white p-4 rounded-t-lg shadow-lg border-t-4 border-blue-500"
        style={{ paddingTop: '20px' }}
      >
        <img
          src={coordinatorPic}
          alt={coordinatorName}
          className="w-16 h-16 rounded-full md:mr-4 border-4 border-white mb-3 md:mb-0 transition-transform duration-300 ease-in-out hover:scale-110"
        />
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold neon-text">{coordinatorName}</p>
          <p className="text-sm">Student Coordinator</p>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTemplate3;
