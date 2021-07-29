import { UserListHead } from 'components/_dashboard/user';
import { constant, keyBy } from 'lodash';
import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { handleCatch, makeReq } from 'utils/constants';
import { AuthContext } from './AuthContext';

export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [managers, setManagers] = useState();
  const [employs, setEmploys] = useState();
  const [groups, setGroups] = useState();
  const [tasks, setTasks] = useState();

  useEffect(() => {
    if (!user || user === null) return;

    fetchUsers();
    fetchTasks();
    fetchGroups();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const resData = await makeReq(`/users`);
      const resManagers = resData.users.filter((el) => el.role === 'Manager');
      const resEmploys = resData.users.filter((el) => el.role === 'Employee');

      console.log(`RES USERS`, resData);
      setManagers(resManagers);
      setEmploys(resEmploys);
    } catch (err) {
      handleCatch(err);
    }
  };

  const fetchTasks = async () => {
    try {
      const resData = await makeReq(`/task`);
      console.log(`RES TASKS`, resData);

      setTasks(resData.tasks);
    } catch (err) {
      handleCatch(err);
    }
  };

  const fetchGroups = async () => {
    try {
      const resData = await makeReq(`/group`);
      console.log(`RES GROUPS`, resData);

      setGroups(resData.groups);
    } catch (err) {
      handleCatch(err);
    }
  };

  const addNew = (key, body) => {};
  const deleteManager = async (id) => {
    try {
      const resData = await makeReq(`/users/${id}`, {}, 'DELETE');
      console.log(`resData`, resData);
      toast.success(`Manager ${resData.user.name} Deleted Successfully`);
      setManagers((st) => st.filter((el) => el._id !== id));
    } catch (err) {
      handleCatch(err);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const resData = await makeReq(`/employee/${id}`, {}, 'DELETE');
      console.log(`resData`, resData);
      toast.success(`Employee ${resData.employee.name} Deleted Successfully`);
      setEmploys((st) => st.filter((el) => el._id !== id));
    } catch (err) {
      handleCatch(err);
    }
  };

  const editManager = async (id, body) => {
    try {
      const resData = await makeReq(`/users/${id}`, { body: { ...body } }, 'PATCH');
      console.log(`resData`, resData);
      toast.success(`Manager ${resData.user.name} Updated Successfully`);
      setManagers((st) =>
        st.map((el) => {
          console.log(`el`, el);
          console.log(`body`, body);
          return el._id === id ? { ...el, ...body } : el;
        })
      );
    } catch (err) {
      handleCatch(err);
    }
  };
  const editEmployee = async (id, body) => {
    try {
      const resData = await makeReq(`/users/${id}`, { body: { ...body } }, 'PATCH');
      console.log(`resData`, resData);
      toast.success(`Employee ${resData.user.name} Updated Successfully`);
      setEmploys((st) =>
        st.map((el) => {
          console.log(`el`, el);
          console.log(`body`, body);
          return el._id === id ? { ...el, ...body } : el;
        })
      );
    } catch (err) {
      handleCatch(err);
    }
  };

  const deleteGroup = async (id) => {
    try {
      const resData = await makeReq(`/group/${id}`, {}, 'DELETE');
      console.log(`resData`, resData);
      toast.success(`Group ${resData.group.name} Deleted Successfully`);
      setEmploys((st) => st.filter((el) => el._id !== id));
    } catch (err) {
      handleCatch(err);
    }
  };

  return (
    <DataContext.Provider
      value={{
        groups,
        setGroups,
        managers,
        setManagers,
        employs,
        setEmploys,
        tasks,
        setTasks,
        deleteManager,
        deleteEmployee,
        deleteGroup,
        editManager,
        editEmployee
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
