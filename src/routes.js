import { Navigate, useRoutes } from 'react-router-dom';
import img from 'assets/images/loader2.gif';
// layouts
import DashboardLayout from './layouts/dashboard';
//
import Login from './pages/Login';
import DashboardApp from './pages/DashboardApp';
import Settings from './pages/Settings';
import Blog from './pages/Blog';
import User from './pages/User';
import { AuthContext } from 'contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import NotFound from 'pages/Page404';
import Employees from 'pages/Employees';
import Managers from 'pages/Managers';
import Groups from 'pages/Groups';
import Tasks from 'pages/Tasks';
import Logout from 'pages/Logout';
import ViewManager from 'pages/ViewManager';
import ViewEmployee from 'pages/ViewEmployee';
import ViewGroup from 'pages/ViewGroup';
import ViewTask from 'pages/ViewTask';
import Meetings from 'components/_dashboard/app/Meetings';

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
  const protechtedRoutes = [
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        {
          path: 'managers',
          element: <Managers />
        },
        {
          path: 'employees',
          element: <Employees />
        },
        {
          path: 'groups',
          element: <Groups />
        },
        {
          path: 'tasks',
          element: <Tasks />
        },
        {
          path: 'meetings',
          element: <Meetings />
        },
        {
          path: 'settings',
          element: <Settings />
        },
        { path: 'managers/:id', element: <ViewManager /> },
        { path: 'employees/:id', element: <ViewEmployee /> },
        { path: 'groups/:id', element: <ViewGroup /> },
        { path: 'tasks/:id', element: <ViewTask /> },

        { path: 'users', element: <User /> }
      ]
    },
    { path: 'logout', element: <Logout /> },
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

  const [routes, setRoutes] = useState(loaderRoute);

  useEffect(() => {
    if (token) {
      if (user) setRoutes(protechtedRoutes);
      else setRoutes(loaderRoute);
    } else setRoutes(publicRoutes);
  }, [token, user]);

  return useRoutes(routes);
}
