import React from 'react';

const TechnicalTemplate2B = ({ title, studentNames, content, coordinatorName, coordinatorPic, eventPics }) => {
  return (
    <div
      className="post-content max-w-4xl mx-auto bg-purple-100 p-6 rounded-lg shadow-lg border-4 border-purple-400 relative"
      style={{ height: '1123px', width: '794px', position: 'relative' }}
    >
      <h1 className="text-4xl font-bold text-center text-purple-900 mb-6 border-b-2 border-purple-300 pb-2">
        {title}
      </h1>

      {/* Images at the Top */}
      <div className="flex justify-center gap-6 mb-6">
        <img src={eventPics[0]} alt="Event 1" className="w-64 h-64 object-cover rounded-lg shadow-md border-2 border-purple-300" />
        <img src={eventPics[1]} alt="Event 2" className="w-64 h-64 object-cover rounded-lg shadow-md border-2 border-purple-300" />
      </div>

      <div className="text-purple-900 mb-6 p-4">
        <p className="text-lg leading-relaxed text-justify" style={{ lineHeight: '1.8', fontSize: '18px' }}>
          {content}
        </p>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 flex flex-col md:flex-row items-center bg-purple-800 text-white p-4 rounded-t-lg shadow-md border-t-4 border-purple-400"
        style={{ paddingTop: '20px' }}
      >
        <img src={coordinatorPic} alt={coordinatorName} className="w-16 h-16 rounded-full md:mr-4 border-2 border-purple-300 mb-3 md:mb-0" />
        <div className="text-center md:text-left">
          <p className="text-lg font-medium">{coordinatorName}</p>
          <p className="text-sm">Student Coordinator</p>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTemplate2B;
