import React from 'react';

const AlumniTemplate1 = ({ title, studentNames, content, coordinatorName, coordinatorPic, eventPics }) => {
  // Limit content to 396 words
  const words = content.split(' ');
  const trimmedContent = words.slice(0, 396).join(' ');

  return (
    <div
      className="post-content max-w-4xl mx-auto bg-gradient-to-b from-rose-50 to-yellow-100 p-6 shadow-xl rounded-lg border border-yellow-300 relative"
      style={{ height: '1123px', width: '794px' }}
    >
      {/* Title */}
      <h1 className="text-4xl font-serif font-bold text-center text-rose-800 border-b-2 border-rose-300 pb-4">
        {title}
      </h1>

      {/* Small Square Image on Top */}
      <div className="w-full flex justify-center my-4">
        <img
          src={eventPics[0]}
          alt="Alumni Event"
          className="w-[300px] h-[300px] object-cover rounded-lg border-2 border-rose-300 shadow-md"
        />
      </div>

      {/* Content */}
      <div className="text-gray-900 px-2 text-justify" style={{ fontSize: '16px', lineHeight: '1.8' }}>
        <p>{trimmedContent}</p>
      </div>

      {/* Coordinator Section */}
      <div className="absolute bottom-0 left-0 right-0 pt-4 border-t-2 border-rose-300 flex items-center bg-rose-50 p-4 rounded-b-lg shadow-md">
        <img
          src={coordinatorPic}
          alt={coordinatorName}
          className="w-14 h-14 rounded-full border-2 border-rose-300 shadow-md mr-4"
        />
        <div>
          <p className="text-rose-600 text-sm">Student Coordinator</p>
          <p className="text-lg font-medium text-rose-900">{coordinatorName}</p>
        </div>
      </div>
    </div>
  );
};

export default AlumniTemplate1;
