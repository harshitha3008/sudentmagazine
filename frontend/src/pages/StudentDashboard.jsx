import { useState, useEffect, useRef } from 'react';
import { Bell, LogOut, ChevronLeft, Eye, Edit } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import TechnicalTemplate1 from '../components/templates/technical/Template1';
import TechnicalTemplate2 from '../components/templates/technical/Template2';
import TechnicalTemplate3 from '../components/templates/technical/Template3';
import TechnicalTemplate4 from '../components/templates/technical/Template4';
import NonTechnicalTemplate1 from '../components/templates/non-technical/Template1';
import NonTechnicalTemplate2 from '../components/templates/non-technical/Template2';
import NonTechnicalTemplate3 from '../components/templates/non-technical/Template3';
import NonTechnicalTemplate4 from '../components/templates/non-technical/Template4';
import Coordinatorpic from '../assets/cordinator.jpeg';
import pic1 from '../assets/sample-1.jpeg';
import pic2 from '../assets/sample-2.jpeg';
import pic3 from '../assets/sample-3.jpeg';
import pic4 from '../assets/sample-4.jpeg';
import AlumniTemplate1 from '../components/templates/alumni/Template1';
import AlumniTemplate2 from '../components/templates/alumni/Template2';
import AlumniTemplate3 from '../components/templates/alumni/Template3';
import AlumniTemplate4 from '../components/templates/alumni/Template4';
import SportsTemplate1 from '../components/templates/sports/Template1';
import SportsTemplate2 from '../components/templates/sports/Template2';
import SportsTemplate3 from '../components/templates/sports/Template3';
import SportsTemplate4 from '../components/templates/sports/Template4';

const sampleData = {
  title: "Beyond the Algorithm: The Ethics of AI",
  studentNames: "John Doe, Jane Smith, Alex Johnson",
  content: "The Department of Computer Science and Engineering at VFSTR conducted an alumni interaction session for the academic year 2024-25, focusing on Full-Stack Development - Opportunities, Challenges, and Industry Insights. The session featured Mr. Waseem Galab Shaik, an alumnus from the 2018-2021 batch, who is currently working as a Full Stack Developer at Siemens Pvt. Ltd. With expertise in UI development using Angular and web technologies like HTML, CSS, JavaScript, and TypeScript, he provided valuable insights into the real-time expectations of the industry. To ensure wider participation, the session was conducted in two sittings for different student sections. Mr. Waseem highlighted the growing demand for full-stack developers and emphasized the importance of understanding both front-end and back-end technologies. He explained how this integration not only increases job opportunities but also builds adaptability in a dynamic work environment. He also stressed the need for strong debugging skills and adopting a systematic approach to problem-solving. The speaker offered clarity on the differences between front-end and back-end roles, sharing how combining the two creates robust and scalable applications. He encouraged students to practice regularly on coding platforms like LeetCode and to build a strong professional profile. Sharing his experience on the NX Power Monitor (Japan) project, he inspired students to take on real-world projects for practical learning. Mr. Waseem also discussed the advantages of working in product-based companies over service-based ones, including exposure to cutting-edge technologies and ownership of projects. He emphasized communication as a key professional skill and motivated students to improve it continuously. He encouraged leveraging university resources, connecting with faculty, and participating in interdisciplinary projects. Concluding with personal stories of overcoming challenges, he left students with a powerful message: treat failures as learning experiences and stay focused on long-term goals The Department of Computer Science and Engineering at VFSTR conducted an alumni interaction session for the academic year 2024-25, focusing on Full-Stack Development - Opportunities, Challenges, and Industry Insights. The session featured Mr. Waseem Galab Shaik, an alumnus from the 2018-2021 batch, who is currently working as a Full Stack Developer at Siemens Pvt. Ltd. With expertise in UI development using Angular and web technologies like HTML, CSS, JavaScript, and TypeScript, he provided valuable insights into the real-time expectations of the industry. To ensure wider participation, the session was conducted in two sittings for different student sections. Mr. Waseem highlighted the growing demand for full-stack developers and emphasized the importance of understanding both front-end and back-end technologies.",
  coordinatorName: "Prof. David Wilson",
  coordinatorPic: Coordinatorpic, 
  eventPics: [
    pic1,
    pic2,
    pic3,
    pic4
  ]
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

export default function StudentDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditPreview, setShowEditPreview] = useState(false); // New state for edit preview
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const [title, setTitle] = useState('');
  const [studentNames, setStudentNames] = useState('');
  const [category, setCategory] = useState('');
  const [eventPics, setEventPics] = useState([]);
  const [eventPicsPreview, setEventPicsPreview] = useState([]); // For preview images
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorPic, setCoordinatorPic] = useState(null);
  const [coordinatorPicPreview, setCoordinatorPicPreview] = useState(null); // For preview image
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
    fetchNotifications();

    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]);

  // Create URL previews for file inputs
  useEffect(() => {
    // Handle coordinator pic preview
    if (coordinatorPic) {
      const objectUrl = URL.createObjectURL(coordinatorPic);
      setCoordinatorPicPreview(objectUrl);
      
      // Clean up the URL when component unmounts or pic changes
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [coordinatorPic]);
  
  useEffect(() => {
    // Handle event pics preview
    if (eventPics.length > 0) {
      const objectUrls = Array.from(eventPics).map(file => URL.createObjectURL(file));
      setEventPicsPreview(objectUrls);
      
      // Clean up the URLs when component unmounts or pics change
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

  const fetchNotifications = async () => {
    try {
      const response = await fetch('https://sudentmagazine-api.vercel.app/api/notifications');
      const data = await response.json();

      if (response.ok) {
        setNotifications(data);

        const readNotificationIds = JSON.parse(localStorage.getItem('readNotifications')) || [];
        
        const hasUnread = data.some(notification => {
          return !readNotificationIds.includes(notification.id);
        });

        setHasUnreadNotifications(hasUnread);
      } else {
        alert('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      alert('An error occurred while fetching notifications');
    }
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);

    if (!showNotifications && notifications.length > 0) {
      const notificationIds = notifications.map(n => n.id);
      
      const existingReadIds = JSON.parse(localStorage.getItem('readNotifications')) || [];
      
      const updatedReadIds = Array.from(new Set([...existingReadIds, ...notificationIds]));
      
      localStorage.setItem('readNotifications', JSON.stringify(updatedReadIds));
      
      setHasUnreadNotifications(false);
    }
  };

  const handleCreatePostClick = () => {
    // Just show templates directly when "Create a Post" is clicked
    setShowTemplates(true);
  };

  const handleBackToTemplates = () => {
    setShowForm(false);
    setShowPreview(false);
    setIsEditing(false);
    setShowEditPreview(false);
    setSelectedTemplate(null);
    setShowTemplates(true); // <-- This ensures templates are shown again
  };
  
  const handleBackToForm = () => {
    setShowEditPreview(false);
    setShowForm(true);
  };
  
  const handleBackToMainDashboard = () => {
    setShowForm(false);
    setShowPreview(false);
    setIsEditing(false);
    setShowEditPreview(false);
    setSelectedTemplate(null);
    setShowTemplates(false); // Ensure templates are hidden
    resetForm();
  };
  
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    clearImageStates();
    // Use the category from the template's ID to determine the category
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
      // Reset the input and clear previous images
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
    e.stopPropagation(); // Prevent the card click from triggering
    setSelectedTemplate(template);
    setSelectedCategory(categoryName);
    setShowTemplates(false);
    setShowPreview(true);
  };

  const handleEditTemplate = (e, template, categoryName) => {
    e.stopPropagation(); // Prevents unwanted click triggers
    setSelectedTemplate(template);
    setSelectedCategory(categoryName);
    clearImageStates();
    
    // Set category based on the template id
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
    setIsEditing(true); // Ensures the form is displayed
    setShowForm(true);  // This makes sure the form is rendered
    setShowPreview(false);
    setShowEditPreview(false);
    
    // Prefill the form with sample data
    setTitle(sampleData.title);
    setStudentNames(sampleData.studentNames);
    setCoordinatorName(sampleData.coordinatorName);
    setContent(sampleData.content);
  };
  
  // New function to handle preview of edited content
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
    formData.append('templateId', numericTemplateId); // Send numeric ID
  
    // Validate required number of images
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
        setShowForm(false);
        setShowTemplates(true);
        setSelectedTemplate(null);
        setShowEditPreview(false);
        resetForm();
      } else {
        alert('Failed to create post: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('An error occurred');
    }
  };
  

  const resetForm = () => {
    setTitle('');
    setStudentNames('');
    setCategory('');
    clearImageStates();
    setEventPics([]);
    setEventPicsPreview([]);
    setCoordinatorName('');
    setCoordinatorPic(null);
    setCoordinatorPicPreview(null);
    setContent('');
    setSelectedCategory('');
    setSelectedTemplate(null);
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
        <h1 className="text-2xl font-bold">Student Panel</h1>
        <div className="flex items-center gap-4 relative">
          <div className="relative cursor-pointer" onClick={handleBellClick} ref={notificationsRef}>
            <Bell className="w-6 h-6" />
            {hasUnreadNotifications && (
              <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"></span>
            )}
            
            {showNotifications && (
              <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg w-80 max-h-60 overflow-y-auto z-50">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 ${
                        notification.status === 'approved'
                          ? 'bg-green-50'
                          : 'bg-red-50'
                      } border-b last:border-b-0`}
                    >
                      <p className="font-semibold text-black">{notification.title}</p>
                      <p className="text-sm text-gray-600">
                        Status: {notification.status}
                      </p>
                      {notification.reason && (
                        <p className="text-sm text-red-500">
                          Reason: {notification.reason}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-600">No notifications yet</div>
                )}
              </div>
            )}
          </div>

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
        {!showTemplates && !showForm && !showPreview && !isEditing && !showEditPreview && (
          <div className="flex-grow flex justify-center items-center">
            <button
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition shadow-lg"
              onClick={handleCreatePostClick}
            >
              Create a Post
            </button>
          </div>
        )}

        {(showTemplates || showForm || showPreview || isEditing || showEditPreview) && (
          <div className="w-full">
            <div className="mb-4">
              <a 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition cursor-pointer"
                onClick={() => {
                  if (showEditPreview) {
                    handleBackToForm();
                  } else if (showForm || showPreview || isEditing) {
                    handleBackToTemplates();
                  } else {
                    handleBackToMainDashboard();
                  }
                }}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>
                  {showEditPreview ? "Back to Edit Form" : 
                    (showForm || showPreview || isEditing ? "Back to Templates" : "Back to Dashboard")}
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
                  {isEditing ? `Edit Template - ${selectedTemplate?.name} (${selectedCategory})` : "Create a Post"}
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
        )}
      </div>
    </div>
  );
}