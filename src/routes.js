import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useRoutes } from 'react-router-dom';
import img from 'assets/images/loader2.gif';

// layouts;
import DashboardLayout from './layouts/dashboard';
//
import DashboardApp from './pages/DashboardApp';
import Settings from './pages/Settings';
import Blog from './pages/Blog';
import User from './pages/User';
import { AuthContext } from 'contexts/AuthContext';
import Logout from 'pages/Logout';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from 'pages/Page404';
// import Employees f rom 'pages/Employees';
import Doctors from 'pages/Doctors';
// import Groups from 'pages/Groups';
import Tasks from 'pages/Tasks';
// import ViewManager from 'pages/ViewManager';
// import ViewEmployee from 'pages/ViewEmployee';
// import ViewGroup from 'pages/ViewGroup';
// import ViewTask from 'pages/ViewTask';
import Patients from 'pages/Patients';
import Appointments from 'pages/Appointments';

// const LazyDashboardLayout = React.lazy(() => import('./layouts/dashboard'));
// //
// const LazyLogin = React.lazy(() => import('./pages/Login'));
// const LazyDashboardApp = React.lazy(() => import('./pages/DashboardApp'));
// const LazySettings = React.lazy(() => import('./pages/Settings'));
// const LazyBlog = React.lazy(() => import('./pages/Blog'));
// const LazyUser = React.lazy(() => import('./pages/User'));
// const LazyNotFound = React.lazy(() => import('pages/Page404'));
// const LazyEmployees = React.lazy(() => import('pages/Employees'));
// const LazyManagers = React.lazy(() => import('pages/Managers'));
// const LazyGroups = React.lazy(() => import('pages/Groups'));
// const LazyTasks = React.lazy(() => import('pages/Tasks'));
// const LazyLogout = React.lazy(() => import('pages/Logout'));
// const LazyViewManager = React.lazy(() => import('pages/ViewManager'));
// const LazyViewEmployee = React.lazy(() => import('pages/ViewEmployee'));
// const LazyViewGroup = React.lazy(() => import('pages/ViewGroup'));
// const LazyViewTask = React.lazy(() => import('pages/ViewTask'));

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
  // const protechtedRoutes = [
  //   {
  //     path: '/dashboard',
  //     element: <LazyDashboardLayout />,
  //     children: [
  //       { path: '/', element: <Navigate to="/dashboard/app" replace /> },
  //       { path: 'app', element: <LazyDashboardApp /> },
  //       {
  //         path: 'managers',
  //         element: <LazyManagers />
  //       },
  //       {
  //         path: 'employees',
  //         element: <LazyEmployees />
  //       },
  //       {
  //         path: 'groups',
  //         element: <LazyGroups />
  //       },
  //       {
  //         path: 'tasks',
  //         element: <LazyTasks />
  //       },
  //       {
  //         path: 'meetings',
  //         element: <LazyMeetings />
  //       },
  //       {
  //         path: 'settings',
  //         element: <LazySettings />
  //       },
  //       { path: 'managers/:id', element: <LazyViewManager /> },
  //       { path: 'employees/:id', element: <LazyViewEmployee /> },
  //       { path: 'groups/:id', element: <LazyViewGroup /> },
  //       { path: 'tasks/:id', element: <LazyViewTask /> },

  //       { path: 'users', element: <LazyUser /> }
  //     ]
  //   },
  //   { path: 'logout', element: <LazyLogout /> },
  //   { path: '/', element: <Navigate to="/dashboard/app" replace /> },
  //   { path: '*', element: <LazyNotFound /> }
  // ];

  // const publicRoutes = [
  //   { path: 'login', element: <LazyLogin /> },
  //   { path: '*', element: <Navigate to="/login" /> }
  // ];

  // const loaderRoute = [
  //   {
  //     path: '*',
  //     element: <Loader />
  //   }
  // ];

  // const [routes, setRoutes] = useState(loaderRoute);

  // useEffect(() => {
  //   if (token) {
  //     if (user) setRoutes(protechtedRoutes);
  //     else setRoutes(loaderRoute);
  //   } else setRoutes(publicRoutes);
  // }, [token, user]);

  // return useRoutes(routes);

  // return (
  //   <div>
  //     {token ? (
  //       user ? (
  //         <Routes>
  //           <Route
  //             path="/dashboard"
  //             element={<React.Suspense fallback="lazy loading">DashboardLayout</React.Suspense>}
  //           >
  //             <Route
  //               path="/app"
  //               element={
  //                 <React.Suspense fallback="lazy loading">
  //                   <DashboardApp />
  //                 </React.Suspense>
  //               }
  //               replace
  //             />
  //             <Route
  //               path="/managers"
  //               element={
  //                 <React.Suspense fallback="lazy loading">
  //                   <Managers />
  //                 </React.Suspense>
  //               }
  //             />
  //             <Route
  //               path="/employees"
  //               element={
  //                 <React.Suspense fallback="lazy loading">
  //                   <Employees />
  //                 </React.Suspense>
  //               }
  //             />
  //             <Route
  //               path="/groups"
  //               element={
  //                 <React.Suspense fallback="lazy loading">
  //                   <Groups />
  //                 </React.Suspense>
  //               }
  //             />
  //             <Route
  //               path="/tasks"
  //               element={
  //                 <React.Suspense fallback="lazy loading">
  //                   <Tasks />
  //                 </React.Suspense>
  //               }
  //             />

  //             <Route
  //               path="/settings"
  //               element={
  //                 <React.Suspense fallback="lazy loading">
  //                   <Settings />
  //                 </React.Suspense>
  //               }
  //             />
  //             <Route
  //               path="/managers/:id"
  //               element={
  //                 <React.Suspense fallback="lazy loading">
  //                   <ViewManager />
  //                 </React.Suspense>
  //               }
  //             />
  //             <Route
  //               path="/employees/:id"
  //               element={
  //                 <React.Suspense fallback="lazy loading">
  //                   <ViewEmployee />
  //                 </React.Suspense>
  //               }
  //             />
  //             <Route
  //               path="/groups/:id"
  //               element={
  //                 <React.Suspense fallback="lazy loading">
  //                   <ViewGroup />
  //                 </React.Suspense>
  //               }
  //             />
  //             <Route
  //               path="/tasks/:id"
  //               element={
  //                 <React.Suspense fallback="lazy loading">
  //                   <ViewTask />
  //                 </React.Suspense>
  //               }
  //             />
  //             <Route
  //               path="/users"
  //               element={
  //                 <React.Suspense fallback="lazy loading">
  //                   <User />
  //                 </React.Suspense>
  //               }
  //             />
  //           </Route>
  //           <Route path="/logout" element={<Logout />} />
  //           <Route path="/" element={<Navigate to="/dashboard/app" replace />} />
  //           <Route path="*" element={<NotFound />} />
  //         </Routes>
  //       ) : (
  //         <Loader />
  //       )
  //     ) : (
  //       <Routes>
  //         <Route path="/login" element={<Login />} />
  //         <Route path="*" element={<Navigate t o="/login" />} />
  //       </Routes>
  //     )}
  //   </div>
  // );
  return (
    <div>
      {token ? (
        user ? (
          <Routes>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="/app" element={<DashboardApp />} replace />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/users" element={<User />} />
              <Route path="*" element={<Navigate to="/dashboard/app" replace />} />
            </Route>
            <Route path="/logout" element={<Logout />} />
            <Route path="/" element={<Navigate to="/dashboard/app" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        ) : (
          <Loader />
        )
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
}

//  <Route
//    path="/login"
//    element={
//      <React.Suspense fallback="lazy loading">
//        <LazyLogin />
//      </React.Suspense>
//    }
//  />;
