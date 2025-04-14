import React from 'react';
import { Link } from 'react-router-dom';

const magazines = [
  {
    year: 2025,
    image: "https://images.unsplash.com/photo-1603796846097-bee99e4a601f?auto=format&fit=crop&q=80&w=800",
    title: "Magazine Collection 2025"
  },
  {
    year: 2024,
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=800",
    title: "Magazine Collection 2024"
  }
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {magazines.map((magazine) => (
          <Link
            key={magazine.year}
            to={`/magazines/${magazine.year}`}
            className="transform hover:scale-105 transition-transform duration-200"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={magazine.image}
                alt={`Magazine ${magazine.year}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {magazine.title}
                </h3>
                <p className="text-gray-600">
                  Click to view quarterly editions
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
