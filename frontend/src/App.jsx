import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import MagazineDetail from './pages/MagazineDetail';
import  CreatePost  from './pages/CreatePost';
import { Posts } from './pages/Posts';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import VerifyPosts from './pages/VerifyPosts';
import PostDetails from './pages/PostDetails';
import TemplatePreviewSystem from './pages/TemplatePreviewSystem';
import ViewPosts from './components/ViewPosts';
import PostPreview from './components/PostPreview';
import MagazineUpload from './components/MagazineUpload';

// ✅ Student Layout (No Header & Footer)
function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<StudentDashboard />} />
          <Route path="template-preview" element={<TemplatePreviewSystem />} />
          <Route path="*" element={<Navigate to="/student-dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// ✅ Admin Layout
function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="verify-posts" element={<VerifyPosts />} />
          <Route path="verify-posts/:id" element={<PostDetails />} />
          <Route path="view-posts" element={<ViewPosts />} />
          <Route path="upload-magazine" element={<MagazineUpload />} />
          <Route path="post/:id" element={<PostPreview />} /> {/* ✅ Fixed route */}
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// ✅ App Content Component
function AppContent() {
  const { isLoggedIn, userRole } = useAuth();
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.startsWith('/admin-dashboard') ||
    location.pathname.startsWith('/student-dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {!isDashboardRoute && <Header isLoggedIn={isLoggedIn} userRole={userRole} />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/magazines/:year" element={<MagazineDetail />} />
          {/* <Route path="/create-post" element={<CreatePost />} /> */}
          <Route path="/posts" element={<Posts />} />
          <Route path="/student-dashboard/*" element={<StudentLayout />} />
          <Route path="/admin-dashboard/*" element={<AdminLayout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

// ✅ Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
