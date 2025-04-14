import React from 'react';

const TechnicalTemplateRight = ({ title, content, coordinatorName, coordinatorPic, eventPics }) => {
  return (
    <div className="post-content max-w-4xl mx-auto bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-300"
      style={{ height: '1123px', width: '794px', position: 'relative' }}>
      
      <h1 className="text-3xl font-bold text-center text-yellow-800 mb-4">{title}</h1>

      <div className="flex">
        <div className="flex-1 bg-white p-4 rounded-lg shadow-sm text-justify text-gray-800 text-sm leading-relaxed" style={{ fontSize: '16px', lineHeight: '1.8' }}>
          {content}
        </div>

        <div className="flex flex-col gap-4 ml-4 mt-10">
          {eventPics.slice(0, 4).map((pic, index) => (
            <img key={index} src={pic} alt={`Event ${index + 1}`} className="w-60 h-50 object-cover rounded-lg border border-yellow-300 shadow-md" />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center bg-yellow-700 text-white p-4 rounded-t-lg shadow-md">
        <img src={coordinatorPic} alt={coordinatorName} className="w-16 h-16 rounded-full border-2 border-white mr-4" />
        <div>
          <p className="text-lg font-medium">{coordinatorName}</p>
          <p className="text-sm">Student Coordinator</p>
        </div>
      </div>
    </div>
  );
};

export default TechnicalTemplateRight;
