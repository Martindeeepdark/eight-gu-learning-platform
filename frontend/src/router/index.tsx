import { createBrowserRouter } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Home from '../pages/Home/index';
import Login from '../pages/Login/index';
import Register from '../pages/Register/index';
import KnowledgeList from '../pages/Knowledge/List';
import KnowledgeDetail from '../pages/Knowledge/Detail';
import LearningDashboard from '../pages/Learning/Dashboard';
import LearningGraph from '../pages/Learning/Graph';
import ExerciseList from '../pages/Exercise/List';
import ExercisePractice from '../pages/Exercise/Practice';
import ExerciseWrong from '../pages/Exercise/Wrong';
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
    element: <Home />,
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
    element: <ProtectedRoute><KnowledgeList /></ProtectedRoute>,
  },
  {
    path: '/knowledge/:id',
    element: <ProtectedRoute><KnowledgeDetail /></ProtectedRoute>,
  },
  {
    path: '/learning',
    element: <ProtectedRoute><LearningDashboard /></ProtectedRoute>,
  },
  {
    path: '/learning/graph',
    element: <ProtectedRoute><LearningGraph /></ProtectedRoute>,
  },
  {
    path: '/exercises',
    element: <ProtectedRoute><ExerciseList /></ProtectedRoute>,
  },
  {
    path: '/exercises/:id',
    element: <ProtectedRoute><ExercisePractice /></ProtectedRoute>,
  },
  {
    path: '/exercises/wrong',
    element: <ProtectedRoute><ExerciseWrong /></ProtectedRoute>,
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
]);

export default router;
