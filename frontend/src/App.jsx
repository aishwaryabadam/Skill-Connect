import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Requests from './pages/Requests';
import Sessions from './pages/Sessions';
import SessionDetail from './pages/SessionDetail';
import CreateSession from './pages/CreateSession';
import Classroom from './pages/Classroom';
import Profile from './pages/Profile';
import MyProfile from './pages/MyProfile';
import Notifications from './pages/Notifications';
import Reviews from './pages/Reviews';

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return !token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="browse" element={<Browse />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<BlogPost />} />
        <Route path="about" element={<About />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />

        <Route path="requests" element={<PrivateRoute><Requests /></PrivateRoute>} />
        <Route path="sessions" element={<PrivateRoute><Sessions /></PrivateRoute>} />
        <Route path="sessions/create" element={<PrivateRoute><CreateSession /></PrivateRoute>} />
        <Route path="sessions/:id" element={<PrivateRoute><SessionDetail /></PrivateRoute>} />
        <Route path="classroom/:sessionId" element={<PrivateRoute><Classroom /></PrivateRoute>} />
        <Route path="profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
        <Route path="profile/:userId" element={<Profile />} />
        <Route path="notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
