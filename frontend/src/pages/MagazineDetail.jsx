import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, ArrowLeft, Download, Eye } from 'lucide-react';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000' // Use your backend server port
});

export default function MagazineDetail() {
  const { year } = useParams();
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const [error, setError] = useState(null);

  const quarterlyInfo = [
    { quarter: 1, title: "Spring Edition", season: "Spring", period: "Q1" },
    { quarter: 2, title: "Summer Edition", season: "Summer", period: "Q2" },
    { quarter: 3, title: "Fall Edition", season: "Fall", period: "Q3" },
    { quarter: 4, title: "Winter Edition", season: "Winter", period: "Q4" }
  ];

  useEffect(() => {
    // Fetch magazines for the specified year from the API
    const fetchMagazines = async () => {
      try {
        setLoading(true);
        console.log(`Fetching magazines for year: ${year}`);
        
        // Make sure year is properly passed as a parameter
        const parsedYear = parseInt(year);
        if (isNaN(parsedYear)) {
          throw new Error(`Invalid year parameter: ${year}`);
        }
        
        // Real API call to get magazines for specific year
        const response = await api.get(`/api/magazines?year=${parsedYear}`);
        console.log('API response:', response.data);
        
        if (Array.isArray(response.data)) {
          setMagazines(response.data);
        } else {
          console.error("Invalid magazine data format:", response.data);
          setMagazines([]);
          setError("Invalid data format received from server");
        }
      } catch (error) {
        console.error("Error fetching magazines:", error);
        setMagazines([]);
        setError(`Error fetching magazines: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMagazines();
  }, [year]);

  const handleMagazineClick = (quarter) => {
    const magazine = magazines.find(m => m.quarter === quarter);
    if (magazine) {
      console.log("Selected magazine:", magazine);
      setSelectedMagazine(magazine);
    } else {
      alert(`${quarterlyInfo.find(q => q.quarter === quarter).title} is not available yet.`);
    }
  };

  const closeViewer = () => {
    setSelectedMagazine(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Collections
        </Link>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{year} Quarterly Magazines</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading magazines...</p>
        </div>
      ) : selectedMagazine ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">
              {quarterlyInfo.find(q => q.quarter === selectedMagazine.quarter).title}
            </h3>
            <button
              onClick={closeViewer}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden mb-6">
            {/* Fix the URL and use a more reliable PDF viewer */}
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedMagazine.fileUrl.replace('s3.undefined.', 's3.ap-south-1.'))}&embedded=true`}
              className="w-full h-96"
              title={`${quarterlyInfo.find(q => q.quarter === selectedMagazine.quarter).season} ${year} Magazine`}
              frameBorder="0"
            />
          </div>
          
          <div className="flex justify-center">
            <a

              href={selectedMagazine.fileUrl.replace('s3.undefined.', 's3.ap-south-1.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Eye className="w-5 h-5" />
              Open PDF
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quarterlyInfo.map((magazine) => {
            const isAvailable = magazines.some(m => m.quarter === magazine.quarter);
            
            return (
              <div 
                key={magazine.quarter} 
                className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200 ${
                  isAvailable ? "cursor-pointer" : "opacity-75"
                }`}
                onClick={() => handleMagazineClick(magazine.quarter)}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    isAvailable ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <FileText className={`w-8 h-8 ${
                      isAvailable ? "text-blue-600" : "text-gray-400"
                    }`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{magazine.title}</h3>
                  <p className="text-gray-600 mb-2">{magazine.period} {year}</p>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    isAvailable 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {isAvailable ? "Available" : "Coming Soon"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}