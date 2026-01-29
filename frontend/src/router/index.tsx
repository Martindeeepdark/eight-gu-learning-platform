import { createBrowserRouter } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AppLayout from '../components/layout/AppLayout';

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
    element: <AppLayout><div>Home</div></AppLayout>,
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
    element: <AppLayout><div>Knowledge List</div></AppLayout>,
  },
  {
    path: '/knowledge/:id',
    element: <ProtectedRoute><AppLayout><div>Knowledge Detail</div></AppLayout></ProtectedRoute>,
  },
  {
    path: '/learning',
    element: <AppLayout><div>Learning Dashboard</div></AppLayout>,
  },
  {
    path: '/learning/graph',
    element: <ProtectedRoute><AppLayout><div>Knowledge Graph</div></AppLayout></ProtectedRoute>,
  },
  {
    path: '/exercises',
    element: <AppLayout><div>Exercises</div></AppLayout>,
  },
  {
    path: '/exercises/:id',
    element: <ProtectedRoute><AppLayout><div>Exercise Practice</div></AppLayout></ProtectedRoute>,
  },
  {
    path: '/exercises/wrong',
    element: <ProtectedRoute><AppLayout><div>Wrong Exercises</div></AppLayout></ProtectedRoute>,
  },
  {
    path: '/profile',
    element: <ProtectedRoute><AppLayout><div>Profile</div></AppLayout></ProtectedRoute>,
  },
]);

export default router;
