import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useContext, useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import PublishIcon from '@material-ui/icons/Publish';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton
} from '@material-ui/core';
// components
import Page from '../components/Page';
// import Skeleton from '@material-ui/lab/Skeleton';
import Skeleton from 'react-loading-skeleton';

import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//

import { DataContext } from 'contexts/DataContext';
import AddorEditModal from 'dialogs/AddorEditModal';
import { AuthContext } from 'contexts/AuthContext';
import Label from 'components/Label';
import ConfirmDeleteModal from 'dialogs/ConfirmDelete';
import AddToTableModal from 'dialogs/AddToGroupModal';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'patient', label: 'Patient', alignRight: false },
  { id: 'doctor', label: 'Doctor', alignRight: false },
  { id: 'symptoms', label: 'Symptoms', alignRight: false },
  { id: 'patientStatus', label: 'PatientStatus', alignRight: false },
  { id: 'dischargePaper', label: 'DischargePaper', alignRight: false },
  { id: 'prescription', label: 'Prescription', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'actions', label: 'Actions', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query, key = 'fullName') {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user[key].toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Appointments() {
  const { appointments, deleteAppointment, doctors, editAppointment, addNewAppointment } =
    useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState();
  const [selectedAppointment, setSelectedAppointment] = useState();
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedApointment, setSelectedApointment] = useState(null);

  const toggleAddToOpen = () => {
    setIsAddOpen((sy) => !sy);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleAssign = (targetid, selectedId) => {
    editAppointment(targetid, { doctor: selectedId, status: 'accepted' });
  };

  const toggleDelOpen = () => setIsDelOpen((st) => !st);
  const toggleEditOpen = () => setIsEditOpen((st) => !st);
  const toggleCreateOpen = () => setIsCreateOpen((st) => !st);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = appointments.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 && appointments ? Math.max(0, (1 + page) * rowsPerPage - appointments.length) : 0;

  const isUserNotFound = filteredAppointments.length === 0;

  useEffect(() => {
    if (!appointments || appointments === null) return;
    setFilteredAppointments(
      applySortFilter(appointments, getComparator(order, orderBy), filterName, 'symptoms')
    );
  }, [appointments, order, orderBy, filterName]);

  const handleDelete = () => {
    // toggleDelOpen();
    console.log(`selected`, selected);
    deleteAppointment(selected, toggleDelOpen);
    setSelected(null);
  };

  const handleClick = (id) => {
    if (selectedAppointment === id) setSelectedAppointment(undefined);
    else setSelectedAppointment(id);
  };

  return (
    <Page title="Appointments | Task Appointment App">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Appointments
          </Typography>
          {user && user.role === 'patient' && (
            <Button
              variant="contained"
              onClick={toggleCreateOpen}
              startIcon={<Icon icon={plusFill} />}
            >
              New Appointment
            </Button>
          )}
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selectedAppointment ? 1 : 0}
            filterName={filterName}
            onFilterName={handleFilterByName}
            slug="Appointments"
            viewLink={`/dashboard/appointments/${selectedAppointment}`}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={appointments ? appointments.length : 0}
                  numSelected={selectedAppointment ? 1 : 0}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {appointments
                    ? filteredAppointments
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const {
                            _id,
                            patient,
                            doctor,
                            status,
                            patientStatus,
                            dischargePaper,
                            prescription,
                            symptoms
                          } = row;

                          return (
                            <TableRow
                              hover
                              key={_id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={selectedAppointment === _id}
                              aria-checked={false}
                            >
                              <TableCell padding="checkbox"></TableCell>
                              <TableCell component="th" scope="row" padding="none">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Avatar
                                    alt={patient?.fullName}
                                    src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${patient?.fullName
                                      ?.split(' ')
                                      .join('%20')}`}
                                  />
                                  <Typography variant="subtitle2" noWrap>
                                    {patient?.fullName}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{doctor?.fullName}</TableCell>
                              <TableCell align="left">{symptoms}</TableCell>
                              <TableCell align="left">{patientStatus}</TableCell>
                              <TableCell
                                style={{ cursor: 'pointer' }}
                                align="left"
                                onClick={() => window.open(dischargePaper)}
                              >
                                {dischargePaper}
                              </TableCell>
                              <TableCell align="left">{prescription}</TableCell>
                              <TableCell align="left">
                                <Label
                                  variant="ghost "
                                  color={
                                    status === 'pending'
                                      ? 'warning'
                                      : status === 'accepted'
                                      ? 'success'
                                      : 'error'
                                  }
                                >
                                  {status}
                                </Label>
                              </TableCell>

                              {user && user.role === 'admin' && (
                                <TableCell align="left">
                                  <UserMoreMenu
                                    currentUser={row}
                                    toggleEditOpen={() => {
                                      console.log('toggleEditOpen');
                                      if (status === 'pending') {
                                        setSelectedApointment(_id);
                                        toggleAddToOpen();
                                      } else editAppointment(_id, { patientStatus: 'discharged' });
                                    }}
                                    toggleDelOpen={() => {
                                      console.log('toggleDelOpen');
                                      if (status === 'pending') {
                                        editAppointment(_id, {
                                          status: 'rejected'
                                        });
                                      } else editAppointment(_id, { status: 'rejected' });
                                    }}
                                    setSelected={setSelected}
                                    role="Appointment"
                                    status={status}
                                    noDelete
                                    noEdit
                                  />
                                </TableCell>
                              )}
                              {user && user.role === 'doctor' && (
                                <TableCell align="left">
                                  <UserMoreMenu
                                    currentUser={row}
                                    toggleDelOpen={() => deleteAppointment(_id)}
                                    setSelected={setSelected}
                                    noEdit
                                  />
                                  <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    id="dischargePaper"
                                    onChange={(e) => {
                                      editAppointment(_id, {
                                        dischargePaper: e.target.files[0]
                                      });
                                    }}
                                  />
                                  <label for="dischargePaper">
                                    <PublishIcon />
                                  </label>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })
                    : Array(5)
                        .fill()
                        .map(() => (
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                            <TableCell>
                              <Skeleton />
                            </TableCell>
                          </TableRow>
                        ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {appointments && isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={appointments ? appointments.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <ConfirmDeleteModal
        open={isDelOpen}
        toggleDialog={toggleDelOpen}
        dialogTitle="Delete This Appointment ?"
        success={handleDelete}
      />
      <AddorEditModal
        isOpen={isCreateOpen}
        createNew={(...props) => {
          addNewAppointment(...props, toggleCreateOpen);
        }}
        closeDialog={toggleCreateOpen}
        role="Appointment"
      />
      <AddorEditModal
        isOpen={isEditOpen}
        closeDialog={toggleEditOpen}
        updateUser={(id, body) => {
          editAppointment(id, body, toggleEditOpen);
        }}
        editUser={selected}
        isEdit
        role="Appointment"
      />
      <AddToTableModal
        isOpen={isAddOpen}
        closeDialog={toggleAddToOpen}
        targetId={selectedApointment}
        addAction={handleAssign}
        data={doctors}
        slug="Assign"
        resource="Appointment"
      />
    </Page>
  );
}
