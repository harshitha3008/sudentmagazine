import React from 'react';

const TechnicalTemplateMiddle = ({ title, content, coordinatorName, coordinatorPic, eventPics }) => {
  const firstHalf = content.slice(0, Math.floor(content.length / 2));
  const secondHalf = content.slice(Math.floor(content.length / 2));

  return (
    <div className="post-content max-w-4xl mx-auto bg-pink-50 p-6 rounded-lg shadow-md border border-pink-300"
      style={{ height: '1123px', width: '794px', position: 'relative' }}>
      
      <h1 className="text-3xl font-bold text-center text-pink-800 mb-4">{title}</h1>

      <div className="bg-white p-4 rounded-lg shadow-sm text-justify text-gray-800 text-sm leading-relaxed mb-4" style={{ fontSize: '16px', lineHeight: '1.8' }}>
        {firstHalf}
      </div>

      <div className="flex justify-center gap-4 mb-4">
        {eventPics.slice(0, 4).map((pic, index) => (
          <img key={index} src={pic} alt={`Event ${index + 1}`} className="w-43 h-50 object-cover rounded-lg border border-pink-300 shadow-md" />
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm text-justify text-gray-800 text-sm leading-relaxed" style={{ fontSize: '16px', lineHeight: '1.8' }}>
        {secondHalf}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center bg-pink-700 text-white p-4 rounded-t-lg shadow-md">
        <img src={coordinatorPic} alt={coordinatorName} className="w-16 h-16 rounded-full border-2 border-white mr-4" />
        <div>
          <p className="text-lg font-medium">{coordinatorName}</p>
          <p className="text-sm">Student Coordinator</p>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTemplateMiddle;
