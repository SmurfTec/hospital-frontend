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

  // * Fetch Operations
  const fetchUsers = async () => {
    try {
      if (user && user.role === 'Admin') {
        const resData1 = await makeReq(`/users?role=Manager`);
        const resData2 = await makeReq(`/employee`);
        const resManagers = resData1.users;
        const resEmploys = resData2.employees;

        // console.log(`RES MANAGERS`, resData1);
        // console.log(`RES EMPLOYEES`, resData2);
        setManagers(resManagers);
        setEmploys(resEmploys);
      } else if (user) {
        const resData = await makeReq(`/employee`);
        const resEmploys = resData.employees;

        console.log(`RES employees`, resData);
        setEmploys(resEmploys);
      }
      // } else if (user && user.role === 'Employee') {
      // }
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

  // * +Add Operations
  const addNewManager = async (body) => {
    try {
      const resData = await makeReq(`/users`, { body: { ...body, role: 'Manager' } }, 'POST');
      console.log(`resData`, resData);
      toast.success(`Manager ${resData.user.name} Created Successfully`);
      setManagers((st) => [...st, resData.user]);
    } catch (err) {
      handleCatch(err);
    }
  };

  const addNewEmployee = async (body) => {
    try {
      const resData = await makeReq(`/employee`, { body: { ...body } }, 'POST');
      console.log(`resData`, resData);
      toast.success(`Employee ${resData.employee.name} Created Successfully`);
      setEmploys((st) => [...st, resData.employee]);
    } catch (err) {
      handleCatch(err);
    }
  };

  const addNewGroup = async (body) => {
    try {
      const resData = await makeReq(`/group`, { body: { ...body } }, 'POST');
      console.log(`resData`, resData);
      toast.success(`Group ${resData.group.name} Created Successfully`);
      setGroups((st) => [...st, resData.group]);
    } catch (err) {
      handleCatch(err);
    }
  };

  const addNewTask = async (body) => {
    try {
      const resData = await makeReq(`/task`, { body: { ...body } }, 'POST');
      console.log(`resData`, resData);
      toast.success(`Task ${resData.task.name} Created Successfully`);
      setTasks((st) => [...st, resData.task]);
    } catch (err) {
      handleCatch(err);
    }
  };

  const addEmployeeToGroups = async (employeeId, groupId) => {
    try {
      const resData = await makeReq(`/group/${groupId}/addEmployee/${employeeId}`, {}, 'POST');
      console.log(`resData`, resData);
      toast.success(
        `Employee "${resData.employee.name}" Added to group "${resData.group.name}" Successfully`
      );
      setGroups((st) => st.map((el) => (el._id === groupId ? resData.group : el)));
    } catch (err) {
      handleCatch(err);
    }
  };
  const removeEmployeeGroup = async (employeeId, groupId) => {
    try {
      const resData = await makeReq(`/group/${groupId}/removeEmployee/${employeeId}`, {}, 'POST');
      console.log(`resData`, resData);
      // TODO UnComment these when API res fixed
      //  toast.success(
      //   `Employee "${resData.employee.name}" removed from group "${resData.group.name}" Successfully`
      // );
      toast.success(`Employee removed from group "${resData.group.name}" Successfully`);
      setGroups((st) => st.map((el) => (el._id === groupId ? resData.group : el)));
    } catch (err) {
      handleCatch(err);
    }
  };

  // * /Edit Opetations

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
      const resData = await makeReq(`/employee/${id}`, { body: { ...body } }, 'PATCH');
      console.log(`resData`, resData);
      toast.success(`Employee ${resData.employee.name} Updated Successfully`);
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

  const editGroup = async (id, body) => {
    try {
      const resData = await makeReq(`/group/${id}`, { body: { ...body } }, 'PATCH');
      console.log(`resData`, resData);
      toast.success(`Group ${resData.group.name} Updated Successfully`);
      setGroups((st) =>
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

  const assignTaskToManager = async (taskId, managerId) => {
    try {
      const resData = await makeReq(`/task/assignTask/${taskId}/manager/${managerId}`, {}, 'PATCH');
      console.log(`resData ASSIGN TASK`, resData);
      toast.success(`Task ${resData.task.name} Assigned Successfully`);
      setTasks((st) => st.map((el) => (el._id === taskId ? resData.task : el)));
      setManagers((st) => st.map((el) => (el._id === managerId ? resData.manager : el)));
    } catch (err) {
      handleCatch(err);
    }
  };

  const unAssignTaskFromManger = async (taskId, managerId) => {
    try {
      const resData = await makeReq(
        `/task/unAssignedTask/${taskId}/manager/${managerId}`,
        {},
        'PATCH'
      );
      console.log(`resData ASSIGN TASK`, resData);
      toast.success(`Task ${resData.task.name} UnAssigned Successfully`);
      setTasks((st) => st.map((el) => (el._id === taskId ? resData.task : el)));
      setManagers((st) => st.map((el) => (el._id === managerId ? resData.manager : el)));
    } catch (err) {
      handleCatch(err);
    }
  };

  const assignTaskToGroup = async (taskId, groupId) => {
    try {
      const resData = await makeReq(`/group/${groupId}/addTask/${taskId}`, {}, 'POST');
      console.log(`resData ASSIGN TASK`, resData);
      toast.success(`Task ${resData.task.name} Assigned Successfully`);
      setTasks((st) => st.map((el) => (el._id === taskId ? resData.task : el)));
      setGroups((st) => st.map((el) => (el._id === groupId ? resData.group : el)));
    } catch (err) {
      handleCatch(err);
    }
  };

  const unAssignTaskFromGroup = async (taskId, groupId) => {
    try {
      const resData = await makeReq(`/group/${groupId}/removeTask/${taskId}`, {}, 'POST');
      console.log(`resData ASSIGN TASK`, resData);
      toast.success(`Task ${resData.task.name} UnAssigned Successfully`);
      setTasks((st) => st.map((el) => (el._id === taskId ? resData.task : el)));
      setGroups((st) => st.map((el) => (el._id === groupId ? resData.group : el)));
    } catch (err) {
      handleCatch(err);
    }
  };

  const updateTask = async (taskId, body) => {
    try {
      const resData = await makeReq(`/task/${taskId}`, { body: { ...body } }, 'PATCH');
      console.log(`resData`, resData);
      toast.success(`Task ${resData.task.name} Updated Successfully`);
      setTasks((st) => st.map((el) => (el._id === taskId ? resData.task : el)));
    } catch (err) {
      handleCatch(err);
    }
  };

  // ! -Delete Operations

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

  const deleteGroup = async (id) => {
    try {
      const resData = await makeReq(`/group/${id}`, {}, 'DELETE');
      console.log(`resData`, resData);
      toast.success(`Group ${resData.group.name} Deleted Successfully`);
      setGroups((st) => st.filter((el) => el._id !== id));
    } catch (err) {
      handleCatch(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const resData = await makeReq(`/task/${id}`, {}, 'DELETE');
      console.log(`resData`, resData);
      toast.success(`Task ${resData.task.name} Deleted Successfully`);
      setTasks((st) => st.filter((el) => el._id !== id));
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
        editEmployee,
        addNewManager,
        addNewEmployee,
        addNewGroup,
        editGroup,
        addEmployeeToGroups,
        removeEmployeeGroup,
        assignTaskToManager,
        unAssignTaskFromManger,
        deleteTask,
        addNewTask,
        updateTask,
        assignTaskToGroup,
        unAssignTaskFromGroup
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

const links = document.getElementsByTagName('a');

Array.from(links).forEach((link) => {
  link.addEventListener('click', (e) => {
    window.localStorage.setItem('lastLink', link);
  });
});
