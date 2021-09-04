import { useEffect, useState, useCallback, useContext } from 'react';

import alanBtn from '@alan-ai/alan-sdk-web';
import { AuthContext } from 'contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const COMMANDS = {
  LOGOUT_USER: 'logout',
  HOME_PAGE: 'home',

  MANAGERS_PAGE: 'managers',
  EMPLOYEES_PAGE: 'employees',
  GROUPS_PAGE: 'groups',
  TASKS_PAGE: 'tasks'
};

const UseAlan = () => {
  const [alanInstance, setAlanInstance] = useState();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const homePage = useCallback(() => {
    alanInstance.playText(' going to home page ');
    navigate('/', { replace: true });
  }, [alanInstance, history]);

  const logoutPage = useCallback(() => {
    if (user) {
      alanInstance.playText('Logging Out');
      navigate('/logout', { replace: true });
      toast.success('Logout success');
    } else {
      alanInstance.playText('You are NOT logged In');
    }
  }, [alanInstance, history]);

  const managersPage = useCallback(() => {
    alanInstance.playText(' Showing Managers ');
    navigate('/managers', { replace: true });
  }, [alanInstance, history]);

  const employeesPage = useCallback(() => {
    alanInstance.playText(' Showing Employees ');
    navigate('/employees', { replace: true });
  }, [alanInstance, history]);

  const groupsPage = useCallback(() => {
    alanInstance.playText(' Showing Groups ');
    navigate('/groups', { replace: true });
  }, [alanInstance, history]);

  const tasksPage = useCallback(() => {
    alanInstance.playText(' Showing Tasks ');
    navigate('/tasks', { replace: true });
  }, [alanInstance, history]);

  useEffect(() => {
    window.addEventListener(COMMANDS.HOME_PAGE, homePage);
    window.addEventListener(COMMANDS.LOGOUT_USER, logoutPage);
    window.addEventListener(COMMANDS.MANAGERS_PAGE, managersPage);
    window.addEventListener(COMMANDS.EMPLOYEES_PAGE, employeesPage);
    window.addEventListener(COMMANDS.GROUPS_PAGE, groupsPage);
    window.addEventListener(COMMANDS.TASKS_PAGE, tasksPage);

    return () => {
      window.removeEventListener(COMMANDS.HOME_PAGE, homePage);
      window.removeEventListener(COMMANDS.LOGOUT_USER, logoutPage);
      window.removeEventListener(COMMANDS.EMPLOYEES_PAGE, employeesPage);
      window.removeEventListener(COMMANDS.GROUPS_PAGE, groupsPage);
      window.removeEventListener(COMMANDS.TASKS_PAGE, tasksPage);
    };
  }, [homePage, logoutPage, managersPage, employeesPage, groupsPage]);

  useEffect(() => {
    if (alanInstance != null) return;
    console.clear();
    console.log(`process.env.REACT_APP_ALAN_KEY`, process.env.REACT_APP_ALAN_KEY);
    console.log(
      `process.env.REACT_APP_CLOUDINARY_CLOUD_NAME`,
      process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    );
    setAlanInstance(
      alanBtn({
        key: process.env.REACT_APP_ALAN_KEY,
        onCommand: ({ command }) => {
          window.dispatchEvent(new CustomEvent(command));
        }
      })
    );
  }, []);

  return null;
};

export default UseAlan;
