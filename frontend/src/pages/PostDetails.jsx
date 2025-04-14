import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

// Template mapping object
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

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://sudentmagazine-api.vercel.app/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        if (data.coordinatorName) {
          return fetch(`https://sudentmagazine-api.vercel.app/api/users/coordinator/${data.coordinatorName}`);
        } else {
          throw new Error('Coordinator data not found');
        }
      })
      .then((res) => res.json())
      .then((authorData) => setAuthor(authorData))
      .catch((err) => console.error('Error fetching data:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (action) => {
    if (isSubmitting) return;

    let reason = '';
    if (action === 'reject') {
      reason = prompt('Enter reason for rejection:');
      if (!reason) return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://sudentmagazine-api.vercel.app/api/posts/${id}/${action}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(action === 'reject' ? { reason } : {}),
      });

      if (response.ok) {
        navigate('/admin-dashboard/verify-posts');
      } else {
        throw new Error(`Failed to ${action} post`);
      }
    } catch (error) {
      console.error(`Error ${action}ing post:`, error);
      alert(`Failed to ${action} post. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading post details...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        Failed to load post details.
      </div>
    );
  }

  // Get the appropriate template component based on category and templateId
  const TemplateComponent = templateMap[post.category]?.[post.templateId];

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        Template not found for this post.
      </div>
    );
  }

  // Prepare the data for the template
  const templateData = {
    title: post.title,
    studentNames: post.studentNames,
    content: post.content,
    coordinatorName: post.coordinatorName,
    coordinatorPic: post.coordinatorPic, // assuming it's full S3 URL too
    eventPics: post.eventPics // don't prepend localhost
  };
  

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/admin-dashboard/verify-posts"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 group transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back to Posts
        </Link>

        <div className="flex justify-end space-x-4 mb-6">
          <button
            onClick={() => handleAction('reject')}
            disabled={isSubmitting}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Reject
          </button>
          <button
            onClick={() => handleAction('approve')}
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Approve
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <TemplateComponent {...templateData} />
        </div>
      </div>
    </div>
  );
}