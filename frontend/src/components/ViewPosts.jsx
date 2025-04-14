import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, FileText, Download, Filter } from 'lucide-react';

// Import the template components (same as PostDetails.jsx)
import TechnicalTemplate1 from '../components/templates/technical/Template1';
import TechnicalTemplate2 from '../components/templates/technical/Template2';
import TechnicalTemplate3 from '../components/templates/technical/Template3';
import TechnicalTemplate4 from '../components/templates/technical/Template4';
import NonTechnicalTemplate1 from '../components/templates/non-technical/Template1';
import NonTechnicalTemplate2 from '../components/templates/non-technical/Template2';
import NonTechnicalTemplate3 from '../components/templates/non-technical/Template3';
import NonTechnicalTemplate4 from '../components/templates/non-technical/Template4';
import AlumniTemplate1 from '../components/templates/alumni/Template1';
import AlumniTemplate2 from '../components/templates/alumni/Template2';
import AlumniTemplate3 from '../components/templates/alumni/Template3';
import AlumniTemplate4 from '../components/templates/alumni/Template4';
import SportsTemplate1 from '../components/templates/sports/Template1';
import SportsTemplate2 from '../components/templates/sports/Template2';
import SportsTemplate3 from '../components/templates/sports/Template3';
import SportsTemplate4 from '../components/templates/sports/Template4';

const templateMap = {
  technical: {
    1: TechnicalTemplate1,
    2: TechnicalTemplate2,
    3: TechnicalTemplate3,
    4: TechnicalTemplate4
  },
  'non-technical': {
    1: NonTechnicalTemplate1,
    2: NonTechnicalTemplate2,
    3: NonTechnicalTemplate3,
    4: NonTechnicalTemplate4
  },
  alumni: {
    1: AlumniTemplate1,
    2: AlumniTemplate2,
    3: AlumniTemplate3,
    4: AlumniTemplate4
  },
  sports: {
    1: SportsTemplate1,
    2: SportsTemplate2,
    3: SportsTemplate3,
    4: SportsTemplate4
  }
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ViewPosts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfTitle, setPdfTitle] = useState('');
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Filter states
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  
  // Get available years from posts
  const getAvailableYears = () => {
    if (!posts.length) return [];
    const years = new Set(posts.map(post => {
      const date = new Date(post.createdAt);
      return date.getFullYear();
    }));
    return Array.from(years).sort((a, b) => b - a); // Sort years in descending order
  };

  useEffect(() => {
    fetchApprovedPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedYear, selectedQuarter]);

  const fetchApprovedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://sudentmagazine-api.vercel.app/api/publishedposts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Ensure data is an array
      if (!Array.isArray(data)) {
        throw new Error('Data received is not an array');
      }
      
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error('Error fetching approved posts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];
    
    if (selectedYear) {
      filtered = filtered.filter(post => {
        const date = new Date(post.createdAt);
        return date.getFullYear() === parseInt(selectedYear);
      });
    }
    
    if (selectedQuarter) {
      filtered = filtered.filter(post => {
        const date = new Date(post.createdAt);
        const month = date.getMonth() + 1; // getMonth() returns 0-11
        
        switch (selectedQuarter) {
          case 'Q1': return month >= 1 && month <= 3; // Jan-Mar
          case 'Q2': return month >= 4 && month <= 6; // Apr-Jun
          case 'Q3': return month >= 7 && month <= 9; // Jul-Sep
          case 'Q4': return month >= 10 && month <= 12; // Oct-Dec
          default: return true;
        }
      });
    }
    
    setFilteredPosts(filtered);
  };

  const handleViewDetails = (post) => {
    setSelectedPost(post);
  };

  const handleGeneratePdf = () => {
    // Generate a default title based on date
    const defaultTitle = `Posts Collection - ${new Date().toLocaleDateString()}`;
    setPdfTitle(defaultTitle);
    setSelectedPosts(new Set());
    setShowPdfModal(true);
  };

  const handlePostSelection = (postId) => {
    setSelectedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  function PostPreview() {
    const { id } = useParams();
    const post = getPostById(id); // Fetch post from API

    const TemplateComponent = templateMap[post.category]?.[post.templateId];

    return (
      <div className="p-6">
        {TemplateComponent ? <TemplateComponent {...post} /> : <p>Template not found</p>}
      </div>
    );
  }

  const handleDownloadPdf = async () => {
    if (selectedPosts.size === 0) {
      alert('Please select at least one post');
      return;
    }
  
    if (!pdfTitle.trim()) {
      alert('Please enter a title for the PDF');
      return;
    }
  
    try {
      setGeneratingPdf(true);
      const token = localStorage.getItem('token');
      
      // Get full post data for selected posts to include template information
      const selectedPostsData = posts.filter(post => selectedPosts.has(post._id));
      
      const response = await fetch('http://localhost:5000/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          postIds: Array.from(selectedPosts),
          title: pdfTitle
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pdfTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setShowPdfModal(false);
      setSelectedPosts(new Set());
      setPdfTitle('');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF: ' + error.message);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedPosts.size === filteredPosts.length) {
      // If all are selected, deselect all
      setSelectedPosts(new Set());
    } else {
      // Select all
      const allIds = new Set(filteredPosts.map(post => post._id));
      setSelectedPosts(allIds);
    }
  };

  const clearFilters = () => {
    setSelectedYear('');
    setSelectedQuarter('');
    setShowFilterModal(false);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl text-gray-600">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl text-red-600">
          Error loading posts: {error}
          <button
            onClick={fetchApprovedPosts}
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (selectedPost) {
    const TemplateComponent = templateMap[selectedPost.category]?.[selectedPost.templateId];

    if (!TemplateComponent) {
      return (
        <div className="min-h-screen flex justify-center items-center">
          <div className="text-xl text-red-600">
            Template not found
            <button
              onClick={() => setSelectedPost(null)}
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Posts
            </button>
          </div>
        </div>
      );
    }

    const templateData = {
      title: selectedPost.title,
      studentNames: selectedPost.studentNames,
      content: selectedPost.content,
      coordinatorName: selectedPost.coordinatorName,
      coordinatorPic: selectedPost.coordinatorPic ? `http://localhost:5000/${selectedPost.coordinatorPic}` : null,
      eventPics: selectedPost.eventPics.map(pic => `http://localhost:5000/${pic}`)
    };

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedPost(null)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 group transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Posts List
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <TemplateComponent {...templateData} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/admin-dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 group transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowFilterModal(true)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition flex items-center"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filter
              {(selectedYear || selectedQuarter) && (
                <span className="ml-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {(selectedYear ? 1 : 0) + (selectedQuarter ? 1 : 0)}
                </span>
              )}
            </button>
            {filteredPosts.length > 0 && (
              <button
                onClick={handleGeneratePdf}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <Download className="w-5 h-5 mr-2" />
                Generate PDF
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedYear || selectedQuarter) && (
          <div className="mb-4 bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-blue-800">
                Active Filters:
                {selectedYear && <span className="ml-2">Year: {selectedYear}</span>}
                {selectedQuarter && (
                  <span className="ml-2">Period: {
                    selectedQuarter === 'Q1' ? 'Jan-Mar' :
                    selectedQuarter === 'Q2' ? 'Apr-Jun' :
                    selectedQuarter === 'Q3' ? 'Jul-Sep' : 'Oct-Dec'
                  }</span>
                )}
              </div>
              <button 
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              {posts.length === 0 ? 'No approved posts found' : 'No posts match the current filters'}
            </p>
            {posts.length > 0 && filteredPosts.length === 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleViewDetails(post)}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PDF Generation Modal */}
        {showPdfModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">Generate PDF from Selected Posts</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF Title
                </label>
                <input
                  type="text"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter a title for your PDF"
                  required
                />
              </div>
              
              <div className="mb-4 flex justify-between items-center">
                <h3 className="font-medium">Select Posts</h3>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {selectedPosts.size === filteredPosts.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                {filteredPosts.map(post => (
                  <label key={post._id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 border-b border-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPosts.has(post._id)}
                      onChange={() => handlePostSelection(post._id)}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    />
                    <span className="text-gray-800">{post.title}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowPdfModal(false);
                    setSelectedPosts(new Set());
                    setPdfTitle('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={selectedPosts.size === 0 || !pdfTitle.trim() || generatingPdf}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center ${
                    (selectedPosts.size === 0 || !pdfTitle.trim() || generatingPdf) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {generatingPdf ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Generate & Download
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">Filter Posts</h2>
              
              {/* Year Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Years</option>
                  {getAvailableYears().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              {/* Quarter Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedQuarter(selectedQuarter === 'Q1' ? '' : 'Q1')}
                    className={`px-3 py-2 border rounded-md flex justify-center items-center ${
                      selectedQuarter === 'Q1' 
                        ? 'bg-blue-100 border-blue-300 text-blue-800' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Jan - Mar (Q1)
                  </button>
                  <button
                    onClick={() => setSelectedQuarter(selectedQuarter === 'Q2' ? '' : 'Q2')}
                    className={`px-3 py-2 border rounded-md flex justify-center items-center ${
                      selectedQuarter === 'Q2' 
                        ? 'bg-blue-100 border-blue-300 text-blue-800' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Apr - Jun (Q2)
                  </button>
                  <button
                    onClick={() => setSelectedQuarter(selectedQuarter === 'Q3' ? '' : 'Q3')}
                    className={`px-3 py-2 border rounded-md flex justify-center items-center ${
                      selectedQuarter === 'Q3' 
                        ? 'bg-blue-100 border-blue-300 text-blue-800' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Jul - Sep (Q3)
                  </button>
                  <button
                    onClick={() => setSelectedQuarter(selectedQuarter === 'Q4' ? '' : 'Q4')}
                    className={`px-3 py-2 border rounded-md flex justify-center items-center ${
                      selectedQuarter === 'Q4' 
                        ? 'bg-blue-100 border-blue-300 text-blue-800' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Oct - Dec (Q4)
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}