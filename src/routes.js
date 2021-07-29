import { Navigate, useRoutes } from 'react-router-dom';
import img from 'assets/images/loader2.gif';
// layouts
import DashboardLayout from './layouts/dashboard';
//
import Login from './pages/Login';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import { AuthContext } from 'contexts/AuthContext';
import { useContext } from 'react';
import NotFound from 'pages/Page404';
import Employees from 'pages/Employees';
import Managers from 'pages/Managers';
import Groups from 'pages/Groups';

// ----------------------------------------------------------------------

const Loader = () => {
  return (
    <img
      src={img}
      alt="loader"
      style={{
        display: 'block',
        maxWidth: '100%',
        /* width: 100%; */
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)'
      }}
    ></img>
  );
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
        { path: 'managers', element: <Managers /> },
        { path: 'employees', element: <Employees /> },
        { path: 'groups', element: <Groups /> },
        { path: 'users', element: <User /> }
        // { path: 'groups', element: <User /> }
      ]
    },
    { path: '/', element: <Navigate to="/dashboard/app" replace /> },
    { path: '*', element: <NotFound /> }
  ];

  const publicRoutes = [
    { path: 'login', element: <Login /> },
    { path: '*', element: <Navigate to="/login" /> }
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
