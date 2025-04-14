import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Import all templates
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

// Sample data for previews
const sampleData = {
  title: "Beyond the Algorithm: The Ethics of AI",
  studentNames: "John Doe, Jane Smith, Alex Johnson",
  content: "The Department of Computer Science and Engineering at VFSTR conducted an alumni interaction session for the academic year 2024-25, focusing on Full-Stack Development - Opportunities, Challenges, and Industry Insights. The session featured Mr. Waseem Galab Shaik, an alumnus from the 2018-2021 batch, who is currently working as a Full Stack Developer at Siemens Pvt. Ltd. With expertise in UI development using Angular and web technologies like HTML, CSS, JavaScript, and TypeScript, he provided valuable insights into the real-time expectations of the industry. To ensure wider participation, the session was conducted in two sittings for different student sections. Mr. Waseem highlighted the growing demand for full-stack developers and emphasized the importance of understanding both front-end and back-end technologies. He explained how this integration not only increases job opportunities but also builds adaptability in a dynamic work environment. He also stressed the need for strong debugging skills and adopting a systematic approach to problem-solving. The speaker offered clarity on the differences between front-end and back-end roles, sharing how combining the two creates robust and scalable applications. He encouraged students to practice regularly on coding platforms like LeetCode and to build a strong professional profile. Sharing his experience on the NX Power Monitor (Japan) project, he inspired students to take on real-world projects for practical learning. Mr. Waseem also discussed the advantages of working in product-based companies over service-based ones, including exposure to cutting-edge technologies and ownership of projects. He emphasized communication as a key professional skill and motivated students to improve it continuously. He encouraged leveraging university resources, connecting with faculty, and participating in interdisciplinary projects. Concluding with personal stories of overcoming challenges, he left students with a powerful message: treat failures as learning experiences and stay focused on long-term goals",
  coordinatorName: "Prof. David Wilson",
  coordinatorPic: Coordinatorpic, 
  eventPics: [
    pic1,
    pic2,
    pic3,
    pic4
  ]
};

const handleBackToTemplates = () => {
  setShowForm(false);
  setShowPreview(false);
  setIsEditing(false);
  setSelectedTemplate(null);
  setShowTemplates(true); // <-- This ensures templates are shown again
};

// Map template IDs to their respective components
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

const TemplatePreviewSystem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const templateId = location.state?.selectedTemplate?.id || null;

  // Get the corresponding template component
  const TemplateComponent = templateComponentMap[templateId];

  // Handle case where template ID is invalid or missing
  if (!TemplateComponent) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Template not found</p>
        <button 
          onClick={() => handleBackToTemplates()}
          className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full border border-blue-300">
      <h2 className="text-xl font-semibold text-blue-700 text-center mb-4">
        Template Preview
      </h2>
      
      <div className="mb-6 border-b pb-6">
        <TemplateComponent {...sampleData} />
      </div>
      
      <div className="flex justify-end gap-4">
        <button 
          onClick={() => navigate('/student-dashboard')}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Back
        </button>
        <button 
          onClick={() => {
            alert("Template Selected!");
            navigate('/student-dashboard');
          }}
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Use This Template
        </button>
      </div>
    </div>
  );
};

export default TemplatePreviewSystem;
