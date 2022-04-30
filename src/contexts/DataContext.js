import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { handleCatch, makeReq } from 'utils/constants';
import { AuthContext } from './AuthContext';

export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (!user || user === null) return;

    fetchDoctors();
    fetchPatients();
  }, [user]);

  const fetchDoctors = async () => {
    try {
      const resData = await makeReq('/users?role=');
      setDoctors(resData.users);
    } catch (err) {
      handleCatch(err);
    } finally {
    }
  };
  const fetchPatients = async () => {
    try {
      const resData = await makeReq('/users?role=');
      setPatients(resData.users);
    } catch (err) {
      handleCatch(err);
    } finally {
    }
  };

  // * +Add Operations
  const addNewManager = async (body, callBack) => {
    try {
      const resData = await makeReq(`/users`, { body: { ...body, role: 'Manager' } }, 'POST');
      console.log(`resData`, resData);
      toast.success(`Manager ${resData.user.name} Created Successfully`);
      setManagers((st) => [...st, resData.user]);
      callBack();
    } catch (err) {
      handleCatch(err);
    }
  };

  const addNewEmployee = async (body, callBack) => {
    try {
      const resData = await makeReq(`/employee`, { body: { ...body } }, 'POST');
      console.log(`resData`, resData);
      toast.success(`Employee ${resData.employee.name} Created Successfully`);
      setEmploys((st) => [...st, resData.employee]);
      callBack();
    } catch (err) {
      handleCatch(err);
    }
  };

  const addNewDoctor = async (body, callBack) => {
    try {
      // TODO
      const resData = await makeReq(`/`, { body: { ...body } }, 'POST');
      console.log(`resData`, resData);
      toast.success(`Task ${resData.task.name} Created Successfully`);
      callBack();
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
    } catch (err) {
      handleCatch(err);
    }
  };

  const assignTaskToManager = async (taskId, managerId) => {
    try {
      const resData = await makeReq(`/task/assignTask/${taskId}/manager/${managerId}`, {}, 'PATCH');
      console.log(`resData ASSIGN TASK`, resData);
      toast.success(`Task ${resData.task.name} Assigned Successfully`);
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

  const completeTaskStage = async (taskId, stageId) => {
    try {
      const resData = await makeReq(`/task/manageTask/${taskId}`, { body: { stageId } }, 'PATCH');
      console.log(`resData`, resData);
      toast.success(`Task ${resData.task.name} Updated Successfully`);
      window.location.reload();
    } catch (err) {
      handleCatch(err);
    }
  };

  const deleteTask = async (id, callBack) => {
    try {
      const resData = await makeReq(`/task/${id}`, {}, 'DELETE');
      console.log(`resData`, resData);
      toast.success(`Task ${resData.task.name} Deleted Successfully`);
      callBack();
    } catch (err) {
      handleCatch(err);
    }
  };

  return (
    <DataContext.Provider
      displayName="Data Context"
      value={{
        doctors,
        patients
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
