import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL, handleCatch, makeReq } from 'utils/constants';
import { AuthContext } from './AuthContext';

export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (!user || user === null) return;

    fetchDoctors();
    fetchPatients();
    fetchAppointments();
    fetchInvoices();
  }, [user]);

  const fetchInvoices = async () => {
    try {
      const resData = await makeReq('/invoices');
      setInvoices(resData.invoices);
    } catch (err) {
      handleCatch(err);
    } finally {
    }
  };
  const fetchAppointments = async () => {
    try {
      let url;
      if (user.role === 'doctor') url = '/appointments';
      else url = `/appointments?doctor=${user._id}`;
      const resData = await makeReq(url);
      setAppointments(resData.appointments);
    } catch (err) {
      handleCatch(err);
    } finally {
    }
  };
  const fetchDoctors = async () => {
    try {
      const resData = await makeReq('/users?role=doctor');
      setDoctors(resData.users);
    } catch (err) {
      handleCatch(err);
    } finally {
    }
  };
  const fetchPatients = async () => {
    try {
      const resData = await makeReq('/users?role=patient');
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
      const resData = await makeReq(`/users`, { body: { ...body, role: 'doctor' } }, 'POST');
      console.log(`resData`, resData);
      toast.success(`Doctor ${resData.user.fullName} Created Successfully`);
      setDoctors((st) => [...st, resData.user]);
      callBack();
    } catch (err) {
      handleCatch(err);
    }
  };

  const addNewInvoice = async (body, callBack) => {
    try {
      // TODO
      const resData = await makeReq(`/invoices`, { body: { ...body, role: 'doctor' } }, 'POST');
      console.log(`resData`, resData);
      toast.success(`Invoice Created Successfully`);
      setInvoices((st) => [...st, resData.invoice]);
      callBack();
    } catch (err) {
      handleCatch(err);
    }
  };
  const addNewAppointment = async (body, callBack) => {
    try {
      // TODO
      const resData = await makeReq(`/appointments`, { body: { ...body, role: 'doctor' } }, 'POST');
      console.log(`resData`, resData);
      toast.success(`Appointment Created Successfully`);
      setAppointments((st) => [...st, resData.appointment]);
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

  const editDoctor = async (id, doctor) => {
    try {
      const resData = await makeReq(`/users/${id}`, { body: { ...doctor } }, 'PATCH');
      console.log(`resData`, resData);
      toast.success(`Doctor ${resData.user.fullName} Updated Successfully`);
      setDoctors((st) => st.map((el) => (el._id === id ? resData.user : el)));
    } catch (err) {
      handleCatch(err);
    }
  };
  const editAppointment = async (id, appointment) => {
    try {
      let formData = new FormData();

      // * Object foreach -Copied from mozilla docs
      for (const [key, value] of Object.entries(appointment)) {
        console.log(`${key}: ${value}`);
        formData.append(key, value);
      }

      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }

      fetch(`${API_BASE_URL}/appointments/${id}`, {
        body: formData,
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      }).then(async (res) => {
        if (res.ok) {
          toast.success(`Appointment Updated Successfully`);
          let data = await res.json();
          console.log('data', data);
          setAppointments((st) => st.map((el) => (el._id === id ? data.appointment : el)));
        } else {
          handleCatch(res);
        }
      });
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

  const deleteDoctor = async (id, callBack) => {
    try {
      const resData = await makeReq(`/users/${id}`, {}, 'DELETE');
      console.log(`resData`, resData);
      toast.success(`Doctor ${resData.user.fullNname} Deleted Successfully`);
      callBack();
      setDoctors((st) => st.filter((el) => el._id !== id));
    } catch (err) {
      handleCatch(err);
    }
  };

  const deleteAppointment = async (id, callBack) => {
    try {
      const resData = await makeReq(`/appointments/${id}`, {}, 'DELETE');
      console.log(`resData`, resData);
      toast.success(`Appointment  Deleted Successfully`);
      callBack();
      setAppointments((st) => st.filter((el) => el._id !== id));
    } catch (err) {
      handleCatch(err);
    }
  };

  return (
    <DataContext.Provider
      displayName="Data Context"
      value={{
        doctors,
        patients,
        deleteDoctor,
        addNewDoctor,
        editDoctor,
        appointments,
        editAppointment,
        addNewAppointment,
        deleteAppointment,
        invoices,
        addNewInvoice
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
