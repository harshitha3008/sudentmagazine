import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Upload, ArrowLeft, Calendar } from 'lucide-react';
import axios from 'axios'; 
const api = axios.create({
  baseURL: 'https://sudentmagazine-api.vercel.app' // Use your backend server port (likely 5000 based on your server.js)
});

export default function MagazineUpload() {
  const navigate = useNavigate();
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [magazines, setMagazines] = useState([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentYear = new Date().getFullYear();

  const quarterlyMagazines = [
    { quarter: 1, title: "Spring Edition", season: "Spring", period: "Q1" },
    { quarter: 2, title: "Summer Edition", season: "Summer", period: "Q2" },
    { quarter: 3, title: "Fall Edition", season: "Fall", period: "Q3" },
    { quarter: 4, title: "Winter Edition", season: "Winter", period: "Q4" }
  ];
  
  useEffect(() => {
    // Fetch existing magazines from database
    const fetchMagazines = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/magazines');
        // Ensure we're setting an array
        setMagazines(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (error) {
        console.error("Error fetching magazines:", error);
        setError("Failed to load magazines");
        // Set to empty array on error
        setMagazines([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMagazines();
  }, [currentYear]);
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file || !selectedQuarter) return;
    
    setUploading(true);
    
    try {
      // Create FormData and append file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quarter', selectedQuarter.quarter);
      formData.append('year', currentYear);
      formData.append('title', `${selectedQuarter.season} ${selectedQuarter.period} Magazine`);
      
      // Real API call to upload the PDF
      const response = await api.post('/api/magazines/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        // Update local state with new magazine from server response
        const newMagazine = response.data.magazine;
        
        setMagazines(prev => {
          // Make sure prev is an array
          const currentMagazines = Array.isArray(prev) ? prev : [];
          // Remove any existing magazine for this quarter
          const filtered = currentMagazines.filter(m => 
            m.quarter !== selectedQuarter.quarter || 
            m.year !== currentYear
          );
          return [...filtered, newMagazine];
        });
        
        setUploading(false);
        setSelectedQuarter(null);
        setFile(null);
        
        alert(`${selectedQuarter.season} ${selectedQuarter.period} magazine uploaded successfully!`);
      }
    } catch (error) {
      console.error("Error uploading magazine:", error);
      alert("Error uploading magazine. Please try again.");
      setUploading(false);
    }
  };
  
  const getMagazineStatus = (quarter) => {
    // Ensure magazines is an array before using find
    if (!Array.isArray(magazines)) return "Not Uploaded";
    
    const uploaded = magazines.find(m => 
      m.quarter === quarter && 
      m.year === currentYear
    );
    
    return uploaded ? "Uploaded" : "Not Uploaded";
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/admin-dashboard')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Upload Quarterly Magazines - {currentYear}</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-6">
            <p>Loading magazines...</p>
          </div>
        ) : selectedQuarter ? (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Upload {selectedQuarter.season} {selectedQuarter.period} Magazine
              </h2>
              <button 
                onClick={() => setSelectedQuarter(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                id="magazineFile"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label 
                htmlFor="magazineFile" 
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <Upload className="w-12 h-12 text-blue-600 mb-4" />
                <p className="text-lg text-gray-600 mb-2">
                  {file ? file.name : "Select PDF file"}
                </p>
                <p className="text-sm text-gray-500">
                  {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "PDF files only"}
                </p>
              </label>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`px-6 py-2 rounded-lg flex items-center ${
                  !file || uploading 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {uploading ? "Uploading..." : "Upload Magazine"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quarterlyMagazines.map((magazine) => {
              const status = getMagazineStatus(magazine.quarter);
              const isUploaded = status === "Uploaded";
              
              return (
                <div 
                  key={magazine.quarter} 
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
                  onClick={() => setSelectedQuarter(magazine)}
                >
                  <div className="flex flex-col items-center cursor-pointer">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      isUploaded ? "bg-green-100" : "bg-blue-100"
                    }`}>
                      <FileText className={`w-8 h-8 ${
                        isUploaded ? "text-green-600" : "text-blue-600"
                      }`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{magazine.title}</h3>
                    <p className="text-gray-600 mb-2">{magazine.season} {magazine.period}</p>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      isUploaded 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
