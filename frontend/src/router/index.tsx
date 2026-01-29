import { createBrowserRouter } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/layout/AppLayout';
import Home from '../pages/Home/index';
import Login from '../pages/Login/index';
import Register from '../pages/Register/index';
import KnowledgeList from '../pages/Knowledge/List';
import KnowledgeDetail from '../pages/Knowledge/Detail';
import LearningDashboard from '../pages/Learning/Dashboard';
import ExerciseList from '../pages/Exercise/List';
import ExercisePractice from '../pages/Exercise/Practice';
import WrongExercises from '../pages/Exercise/Wrong';
import Profile from '../pages/Profile/index';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout><Home /></AppLayout>,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/knowledge',
    element: <AppLayout><KnowledgeList /></AppLayout>,
  },
  {
    path: '/knowledge/:id',
    element: <ProtectedRoute><AppLayout><KnowledgeDetail /></AppLayout></ProtectedRoute>,
  },
  {
    path: '/learning',
    element: <AppLayout><LearningDashboard /></AppLayout>,
  },
  {
    path: '/exercises',
    element: <AppLayout><ExerciseList /></AppLayout>,
  },
  {
    path: '/exercises/:id',
    element: <ProtectedRoute><AppLayout><ExercisePractice /></AppLayout></ProtectedRoute>,
  },
  {
    path: '/exercises/wrong',
    element: <ProtectedRoute><AppLayout><WrongExercises /></AppLayout></ProtectedRoute>,
  },
  {
    path: '/profile',
    element: <ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>,
  },
]);

export default router;
