import { useState, useEffect, useRef } from 'react';
import { LogOut, ChevronLeft, Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import all template components (same as StudentDashboard)
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

// Import sample data and images (same as StudentDashboard)
import Coordinatorpic from '../assets/cordinator.jpeg';
import pic1 from '../assets/sample-1.jpeg';
import pic2 from '../assets/sample-2.jpeg';
import pic3 from '../assets/sample-3.jpeg';
import pic4 from '../assets/sample-4.jpeg';

const sampleData = {
  title: "Beyond the Algorithm: The Ethics of AI",
  studentNames: "John Doe, Jane Smith, Alex Johnson",
  content: "Artificial Intelligence is rapidly changing the world, revolutionizing industries from healthcare to finance, and even influencing what we see online. But behind the convenience and innovation lies a complex ethical dilemma—how do we ensure AI systems are fair, transparent, and unbiased? Many algorithms inherit biases from the data they are trained on, leading to discrimination in hiring, policing, and financial decisions. Furthermore, AI-driven surveillance raises concerns about privacy, while automated decision-making systems challenge traditional ideas of accountability. This discussion delves into the ethical challenges posed by AI, exploring real-world examples of both its benefits and dangers. It questions whether regulations can keep up with technological advancements and what responsibility developers, corporations, and governments have in shaping an ethical AI future.",
  coordinatorName: "Prof. David Wilson",
  coordinatorPic: Coordinatorpic, 
  eventPics: [pic1, pic2, pic3, pic4]
};

const templateComponentMap = {
  // Technical templates
  'tech1': TechnicalTemplate1,
  'tech2': TechnicalTemplate2,
  'tech3': TechnicalTemplate3,
  'tech4': TechnicalTemplate4,
  
  // Non-Technical templates
  'nontech1': NonTechnicalTemplate1,
  'nontech2': NonTechnicalTemplate2,
  'nontech3': NonTechnicalTemplate3,
  'nontech4': NonTechnicalTemplate4,
  
  // Alumni templates
  'alumni1': AlumniTemplate1,
  'alumni2': AlumniTemplate2,
  'alumni3': AlumniTemplate3,
  'alumni4': AlumniTemplate4,
  
  // Sports templates
  'sports1': SportsTemplate1,
  'sports2': SportsTemplate2,
  'sports3': SportsTemplate3,
  'sports4': SportsTemplate4
};

export default function CreatePost() {
  const navigate = useNavigate();
  
  // State variables (copied from StudentDashboard but simplified)
  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true); // Show templates by default
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showEditPreview, setShowEditPreview] = useState(false);
  
  // Form state variables
  const [title, setTitle] = useState('');
  const [studentNames, setStudentNames] = useState('');
  const [category, setCategory] = useState('');
  const [eventPics, setEventPics] = useState([]);
  const [eventPicsPreview, setEventPicsPreview] = useState([]);
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorPic, setCoordinatorPic] = useState(null);
  const [coordinatorPicPreview, setCoordinatorPicPreview] = useState(null);
  const [content, setContent] = useState('');
  
  const templateCategories = [
    {
      name: 'Technical',
      templates: [
        { id: 'tech1', name: 'Template 1' },
        { id: 'tech2', name: 'Template 2' },
        { id: 'tech3', name: 'Template 3' },
        { id: 'tech4', name: 'Template 4' },
      ]
    },
    {
      name: 'Non-Technical',
      templates: [
        { id: 'nontech1', name: 'Template 1' },
        { id: 'nontech2', name: 'Template 2' },
        { id: 'nontech3', name: 'Template 3' },
        { id: 'nontech4', name: 'Template 4' },
      ]
    },
    {
      name: 'Alumni',
      templates: [
        { id: 'alumni1', name: 'Template 1' },
        { id: 'alumni2', name: 'Template 2' },
        { id: 'alumni3', name: 'Template 3' },
        { id: 'alumni4', name: 'Template 4' },
      ]
    },
    {
      name: 'Sports',
      templates: [
        { id: 'sports1', name: 'Template 1' },
        { id: 'sports2', name: 'Template 2' },
        { id: 'sports3', name: 'Template 3' },
        { id: 'sports4', name: 'Template 4' },
      ]
    }
  ];

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  // Create URL previews for file inputs
  useEffect(() => {
    if (coordinatorPic) {
      const objectUrl = URL.createObjectURL(coordinatorPic);
      setCoordinatorPicPreview(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [coordinatorPic]);
  
  useEffect(() => {
    if (eventPics.length > 0) {
      const objectUrls = Array.from(eventPics).map(file => URL.createObjectURL(file));
      setEventPicsPreview(objectUrls);
      
      return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
    }
  }, [eventPics]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const handleBackToAdminDashboard = () => {
    navigate('/admin-dashboard');
  };
  
  const handleBackToTemplates = () => {
    setShowForm(false);
    setShowPreview(false);
    setShowEditPreview(false);
    setSelectedTemplate(null);
    setShowTemplates(true);
  };
  
  const handleBackToForm = () => {
    setShowEditPreview(false);
    setShowForm(true);
  };
  
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    clearImageStates();
    // Determine category from template ID
    if (template.id.startsWith('tech')) {
      setCategory('technical');
    } else if (template.id.startsWith('nontech')) {
      setCategory('non-technical');
    } else if (template.id.startsWith('alumni')) {
      setCategory('alumni');
    } else if (template.id.startsWith('sports')) {
      setCategory('sports');
    }
    setShowTemplates(false);
    setShowForm(true);
  };

  const getRequiredImageCount = (templateId) => {
    if (!templateId) return 0;
    const templateNumber = parseInt(templateId.slice(-1));
    return templateNumber;
  };

  const handleEventPicsChange = (e) => {
    const files = Array.from(e.target.files);
    const requiredCount = getRequiredImageCount(selectedTemplate?.id);
    
    if (files.length !== requiredCount) {
      alert(`Please select exactly ${requiredCount} image${requiredCount !== 1 ? 's' : ''} for this template.`);
      e.target.value = '';
      setEventPics([]);
      setEventPicsPreview([]);
      return;
    }
    
    setEventPics(files);
  };

  const clearImageStates = () => {
    setEventPics([]);
    setEventPicsPreview([]);
    setCoordinatorPic(null);
    setCoordinatorPicPreview(null);
  };

  const handlePreviewTemplate = (e, template, categoryName) => {
    e.stopPropagation();
    setSelectedTemplate(template);
    setSelectedCategory(categoryName);
    setShowTemplates(false);
    setShowPreview(true);
  };

  const handleEditTemplate = (e, template, categoryName) => {
    e.stopPropagation();
    setSelectedTemplate(template);
    setSelectedCategory(categoryName);
    clearImageStates();
    
    if (template.id.startsWith('tech')) {
      setCategory('technical');
    } else if (template.id.startsWith('nontech')) {
      setCategory('non-technical');
    } else if (template.id.startsWith('alumni')) {
      setCategory('alumni');
    } else if (template.id.startsWith('sports')) {
      setCategory('sports');
    }
    
    setShowTemplates(false);
    setShowForm(true);
    setShowPreview(false);
    setShowEditPreview(false);
    
    // Prefill the form with sample data
    setTitle(sampleData.title);
    setStudentNames(sampleData.studentNames);
    setCoordinatorName(sampleData.coordinatorName);
    setContent(sampleData.content);
  };
  
  const handlePreviewEdit = (e) => {
    e.preventDefault();
    
    if (!title || !studentNames || !category || !coordinatorName || !content) {
      alert('Please fill in all fields before previewing.');
      return;
    }
    
    setShowForm(false);
    setShowEditPreview(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !studentNames || !category || !coordinatorName || !content) {
      alert('Please fill in all fields.');
      return;
    }
  
    // Extract numeric template ID from the string ID
    const numericTemplateId = parseInt(selectedTemplate.id.slice(-1));
    if (isNaN(numericTemplateId) || numericTemplateId < 1 || numericTemplateId > 4) {
      alert('Invalid template ID');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('studentNames', studentNames);
    formData.append('category', category);
    formData.append('coordinatorName', coordinatorName);
    formData.append('content', content);
    formData.append('templateId', numericTemplateId);
  
    if (eventPics.length !== numericTemplateId) {
      alert(`This template requires exactly ${numericTemplateId} photo${numericTemplateId !== 1 ? 's' : ''}.`);
      return;
    }
  
    for (const pic of eventPics) {
      formData.append('eventPics', pic);
    }
  
    if (coordinatorPic) {
      formData.append('coordinatorPic', coordinatorPic);
    }
  
    try {
      const response = await fetch('https://sudentmagazine-api.vercel.app/api/posts/create', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Post created successfully!');
        // Navigate back to admin dashboard after submission
        navigate('/admin-dashboard');
      } else {
        alert('Failed to create post: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('An error occurred');
    }
  };

  // Template Preview Component
  const TemplatePreview = () => {
    if (!selectedTemplate || !templateComponentMap[selectedTemplate.id]) {
      return (
        <div className="p-6 text-center">
          <p className="text-red-500">Template not found</p>
          <button 
            onClick={handleBackToTemplates}
            className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Back to Templates
          </button>
        </div>
      );
    }

    const TemplateComponent = templateComponentMap[selectedTemplate.id];

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg w-full border border-blue-300">
        <h2 className="text-xl font-semibold text-blue-700 text-center mb-4">
          Template Preview - {selectedTemplate.name} ({selectedCategory})
        </h2>
        
        <div className="mb-6 border-b pb-6">
          <TemplateComponent {...sampleData} />
        </div>
        
        <div className="flex justify-end gap-4">
          <button 
            onClick={handleBackToTemplates}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Back to Templates
          </button>
          <button 
            onClick={(e) => handleEditTemplate(e, selectedTemplate, selectedCategory)}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Edit This Template
          </button>
        </div>
      </div>
    );
  };

  // Edit Preview Component - Shows user's content in the selected template
  const EditPreview = () => {
    if (!selectedTemplate || !templateComponentMap[selectedTemplate.id]) {
      return (
        <div className="p-6 text-center">
          <p className="text-red-500">Template not found</p>
          <button 
            onClick={handleBackToForm}
            className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Back to Form
          </button>
        </div>
      );
    }

    const TemplateComponent = templateComponentMap[selectedTemplate.id];
    
    // Create data object with user's entered values
    const userData = {
      title: title,
      studentNames: studentNames,
      content: content,
      coordinatorName: coordinatorName,
      // Use preview URLs for images
      coordinatorPic: coordinatorPicPreview || Coordinatorpic, // fallback to sample if no preview
      eventPics: eventPicsPreview.length > 0 ? eventPicsPreview : sampleData.eventPics // fallback to sample if no preview
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg w-full border border-blue-300">
        <h2 className="text-xl font-semibold text-blue-700 text-center mb-4">
          Edit Preview - {selectedTemplate.name} ({selectedCategory})
        </h2>
        
        <div className="mb-6 border-b pb-6">
          <TemplateComponent {...userData} />
        </div>
        
        <div className="flex justify-end gap-4">
          <button 
            onClick={handleBackToForm}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Back to Edit Form
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Submit Post
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-screen bg-blue-50 flex flex-col">
      <nav className="bg-blue-700 text-white p-4 flex justify-between items-center w-full shadow-md">
        <h1 className="text-2xl font-bold">Create Post</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 bg-white text-blue-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-grow p-6 w-full">
        <div className="w-full">
          <div className="mb-4">
            <a 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition cursor-pointer"
              onClick={() => {
                if (showEditPreview) {
                  handleBackToForm();
                } else if (showForm || showPreview) {
                  handleBackToTemplates();
                } else {
                  handleBackToAdminDashboard();
                }
              }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>
                {showEditPreview ? "Back to Edit Form" : 
                  (showForm || showPreview ? "Back to Templates" : "Back to Admin Dashboard")}
              </span>
            </a>
          </div>            
          {showTemplates && (
            <div className="bg-white p-6 rounded-lg shadow-lg w-full border border-blue-300">
              <h2 className="text-xl font-semibold text-blue-700 text-center mb-6">
                Select a Template
              </h2>
              
              <div className="space-y-8">
                {templateCategories.map((templateCategory) => (
                  <div key={templateCategory.name} className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-600 mb-3">
                      {templateCategory.name}
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      {templateCategory.templates.map((template) => (
                        <div
                          key={template.id}
                          className="border border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition text-center"
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <div className="bg-gray-200 w-full h-24 mb-2 rounded relative">
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-4">
                              <button 
                                onClick={(e) => handlePreviewTemplate(e, template, templateCategory.name)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center"
                              >
                                <Eye className="w-3 h-3 mr-1" /> Preview
                              </button>
                              <button 
                                onClick={(e) => handleEditTemplate(e, template, templateCategory.name)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center"
                              >
                                <Edit className="w-3 h-3 mr-1" /> Edit
                              </button>
                            </div>
                          </div>
                          <p className="text-blue-700">{template.name}</p>
                        </div>                        
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showPreview && <TemplatePreview />}
          
          {showEditPreview && <EditPreview />}

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-lg w-full border border-blue-300">
              <h2 className="text-xl font-semibold text-blue-700 text-center mb-4">
                Create a Post - {selectedTemplate?.name} ({selectedCategory})
              </h2>
              <form onSubmit={handlePreviewEdit} className="space-y-4 max-w-2xl mx-auto">
                <div>
                  <label className="block text-blue-600 font-medium">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-blue-600 font-medium">Student Names</label>
                  <input
                    type="text"
                    value={studentNames}
                    onChange={(e) => setStudentNames(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-blue-600 font-medium">Category</label>
                  <input
                    type="text"
                    value={category}
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-blue-600 font-medium">
                    Upload Event Pics ({getRequiredImageCount(selectedTemplate?.id)} required)
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleEventPicsChange}
                    accept="image/*"
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                  {eventPicsPreview.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {eventPicsPreview.map((url, index) => (
                        <img 
                          key={index} 
                          src={url} 
                          alt={`Event preview ${index}`} 
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-blue-600 font-medium">Co-Ordinator Name</label>
                  <input
                    type="text"
                    value={coordinatorName}
                    onChange={(e) => setCoordinatorName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-blue-600 font-medium">Upload Co-Ordinator Pic</label>
                  <input
                    type="file"
                    onChange={(e) => setCoordinatorPic(e.target.files[0])}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                  {coordinatorPicPreview && (
                    <div className="mt-2">
                      <img 
                        src={coordinatorPicPreview} 
                        alt="Coordinator preview" 
                        className="w-16 h-16 object-cover rounded-full border"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-blue-600 font-medium">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 h-32"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  Preview Post
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}