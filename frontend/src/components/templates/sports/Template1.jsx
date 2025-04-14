import React from 'react';

const TechnicalTemplate1 = ({ title, studentNames, content, coordinatorName, coordinatorPic, eventPics }) => {
  // Limit content to 396 words
  const words = content.split(' ');
  const trimmedWords = words.slice(0, 396);

  // Split around 200th word for image placement
  const firstPart = trimmedWords.slice(0, 200).join(' ');
  const secondPart = trimmedWords.slice(200).join(' ');

  return (
    <div
      className="post-content max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-violet-100 p-6 shadow-lg rounded-lg border border-purple-300 relative"
      style={{ height: '1123px', width: '794px' }}
    >
      {/* Title */}
      <h1 className="text-4xl font-serif font-bold text-purple-800 text-center border-b-2 border-purple-400 pb-4">
        {title}
      </h1>

      {/* Content with wrapped image in the middle */}
      <div className="text-purple-900 mt-6 px-2 text-justify" style={{ fontSize: '16px', lineHeight: '1.8' }}>
        <p>{firstPart}</p>

        {/* Middle image with text wrapping */}
        <div className="float-right w-80 h-auto ml-4 mb-4">
          <img
            src={eventPics[0]}
            alt="Event"
            className="w-full h-auto object-cover rounded-lg border-2 border-purple-400 shadow-md"
          />
        </div>

        <p>{secondPart}</p>
      </div>

      {/* Coordinator Section */}
      <div className="clear-both absolute bottom-0 left-0 right-0 pt-6 border-t-2 border-purple-400 flex items-center bg-purple-100 p-4 rounded-b-lg shadow-md">
        <img
          src={coordinatorPic}
          alt={coordinatorName}
          className="w-14 h-14 rounded-full border-2 border-purple-400 shadow-md mr-4"
        />
        <div>
          <p className="text-purple-600 text-sm">Student Coordinator</p>
          <p className="text-lg font-medium text-purple-900">{coordinatorName}</p>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTemplate1;
