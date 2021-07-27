import { Navigate, useRoutes } from 'react-router-dom';
import img from 'assets/images/loader2.gif';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import { AuthContext } from 'contexts/AuthContext';
import { useContext } from 'react';

// ----------------------------------------------------------------------

const Loader = () => {
  return <img src={img} alt="loader"></img>;
};

export default function Router() {
  const { token, user } = useContext(AuthContext);
  let routes;
  const protechtedRoutes = [
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: '*', element: <Navigate to="/login" /> }
      ]
    }
  ];

  const loaderRoute = [
    {
      path: '*',
      element: <Loader />
    }
  ];

  if (token) {
    if (user) routes = protechtedRoutes;
    else routes = loaderRoute;
  } else routes = publicRoutes;

  return useRoutes(routes);
}
