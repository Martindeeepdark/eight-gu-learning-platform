import { createBrowserRouter } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
    element: <div>Home</div>,
  },
  {
    path: '/login',
    element: <div>Login</div>,
  },
  {
    path: '/register',
    element: <div>Register</div>,
  },
  {
    path: '/knowledge',
    element: <ProtectedRoute><div>Knowledge List</div></ProtectedRoute>,
  },
  {
    path: '/knowledge/:id',
    element: <ProtectedRoute><div>Knowledge Detail</div></ProtectedRoute>,
  },
  {
    path: '/learning',
    element: <ProtectedRoute><div>Learning Dashboard</div></ProtectedRoute>,
  },
  {
    path: '/learning/graph',
    element: <ProtectedRoute><div>Knowledge Graph</div></ProtectedRoute>,
  },
  {
    path: '/exercises',
    element: <ProtectedRoute><div>Exercises</div></ProtectedRoute>,
  },
  {
    path: '/exercises/:id',
    element: <ProtectedRoute><div>Exercise Detail</div></ProtectedRoute>,
  },
  {
    path: '/exercises/wrong',
    element: <ProtectedRoute><div>Wrong Exercises</div></ProtectedRoute>,
  },
  {
    path: '/profile',
    element: <ProtectedRoute><div>Profile</div></ProtectedRoute>,
  },
]);

export default router;
