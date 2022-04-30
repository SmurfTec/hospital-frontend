import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useContext, useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
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
  TablePagination
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fullName', label: 'Name', alignRight: false },
  { id: 'email', label: 'email', alignRight: false },
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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Patients() {
  const { patients, deletePatient, editPatient, addNewPatient } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState();
  const [selectedPatient, setSelectedPatient] = useState();
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const toggleDelOpen = () => setIsDelOpen((st) => !st);
  const toggleEditOpen = () => setIsEditOpen((st) => !st);
  const toggleCreateOpen = () => setIsCreateOpen((st) => !st);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = patients.map((n) => n.name);
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
    page > 0 && patients ? Math.max(0, (1 + page) * rowsPerPage - patients.length) : 0;

  const isUserNotFound = filteredPatients.length === 0;

  useEffect(() => {
    if (!patients || patients === null) return;
    setFilteredPatients(applySortFilter(patients, getComparator(order, orderBy), filterName));
  }, [patients, order, orderBy, filterName]);

  const handleDelete = () => {
    // toggleDelOpen();
    console.log(`selected`, selected);
    deletePatient(selected, toggleDelOpen);
    setSelected(null);
  };

  const handleClick = (id) => {
    if (selectedPatient === id) setSelectedPatient(undefined);
    else setSelectedPatient(id);
  };

  return (
    <Page title="Patients | Task Patient App">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Patients
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selectedPatient ? 1 : 0}
            filterName={filterName}
            onFilterName={handleFilterByName}
            slug="Patients"
            viewLink={`/dashboard/patients/${selectedPatient}`}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={patients ? patients.length : 0}
                  numSelected={selectedPatient ? 1 : 0}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {patients
                    ? filteredPatients
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const { _id, fullName, email } = row;

                          return (
                            <TableRow
                              hover
                              key={_id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={selectedPatient === _id}
                              aria-checked={false}
                            >
                              <TableCell padding="checkbox"></TableCell>
                              <TableCell component="th" scope="row" padding="none">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Avatar
                                    alt={fullName}
                                    src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${fullName
                                      .split(' ')
                                      .join('%20')}`}
                                  />
                                  <Typography variant="subtitle2" noWrap>
                                    {fullName}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{email}</TableCell>

                              {/* {user && user.role === 'admin' && (
                                <TableCell align="left">
                                  <UserMoreMenu
                                    currentUser={row}
                                    toggleDelOpen={toggleDelOpen}
                                    toggleEditOpen={toggleEditOpen}
                                    setSelected={setSelected}
                                  />
                                </TableCell>
                              )} */}
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
                {patients && isUserNotFound && (
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
            count={patients ? patients.length : 0}
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
        dialogTitle="Delete This Patient ?"
        success={handleDelete}
      />
      <AddorEditModal
        isOpen={isCreateOpen}
        createNew={(...props) => {
          addNewPatient(...props, toggleCreateOpen);
        }}
        closeDialog={toggleCreateOpen}
        role="Patient"
      />
      <AddorEditModal
        isOpen={isEditOpen}
        closeDialog={toggleEditOpen}
        updateUser={(id, body) => {
          editPatient(id, body, toggleEditOpen);
        }}
        editUser={selected}
        isEdit
        role="Patient"
      />
    </Page>
  );
}
