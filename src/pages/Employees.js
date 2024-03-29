import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import ConfirmDeleteModal from 'dialogs/ConfirmDelete';

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
import AddToTableModal from 'dialogs/AddToGroupModal';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//

import { DataContext } from 'contexts/DataContext';
import { AuthContext } from 'contexts/AuthContext';
import AddorEditModal from 'dialogs/AddorEditModal';
import { makeStyles } from '@material-ui/styles';
import Label from 'components/Label';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'groups', label: 'Groups', alignRight: false },
  { id: 'manager', label: 'Manager', alignRight: false },
  // { id: 'isVerified', label: 'Verified', alignRight: false },
  // { id: 'status', label: 'Status', alignRight: false },
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

const useStyles = makeStyles((theme) => ({
  redTableCell: {
    color: `${theme.palette.error.main} !important`
  }
}));

const Employees = () => {
  const classes = useStyles();
  const {
    employs,
    deleteEmployee,
    addNewEmployee,
    editEmployee,
    groups,
    addEmployeeToGroups,
    removeEmployeeGroup
  } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [filteredEmploys, setFilteredEmploys] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState();
  const [selectedEmploy, setSelectedEmploy] = useState();
  const [orderBy, setOrderBy] = useState('name');
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddToOpen, setIsAddToOpen] = useState(false);
  const [isRemoveFromOpen, setIsRemoveFromOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = employs.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const toggleDelOpen = () => setIsDelOpen((st) => !st);
  const toggleEditOpen = () => setIsEditOpen((st) => !st);
  const toggleCreateOpen = () => setIsCreateOpen((st) => !st);
  const toggleAddToOpen = () => setIsAddToOpen((st) => !st);
  const toggleRemoveFromOpen = () => setIsRemoveFromOpen((st) => !st);

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
    page > 0 && employs ? Math.max(0, (1 + page) * rowsPerPage - employs.length) : 0;

  const isUserNotFound = filteredEmploys.length === 0;

  useEffect(() => {
    if (!employs || employs === null) return;
    setFilteredEmploys(applySortFilter(employs, getComparator(order, orderBy), filterName));
  }, [employs, order, orderBy, filterName]);

  const handleDelete = () => {
    console.log(`selected`, selected);
    deleteEmployee(selected, toggleDelOpen);
    setSelected(null);
  };

  const handleClick = (id) => {
    if (selectedEmploy === id) setSelectedEmploy(undefined);
    else setSelectedEmploy(id);
  };

  return (
    <Page title="Employees | Task Manager App">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Employees
          </Typography>
          {user && user.role === 'Manager' && (
            <Button
              variant="contained"
              onClick={toggleCreateOpen}
              startIcon={<Icon icon={plusFill} />}
            >
              New Employee
            </Button>
          )}
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selectedEmploy ? 1 : 0}
            filterName={filterName}
            onFilterName={handleFilterByName}
            slug="Employees"
            viewLink={`/dashboard/employees/${selectedEmploy}`}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={employs ? employs.length : 0}
                  numSelected={selectedEmploy ? 1 : 0}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {employs
                    ? filteredEmploys
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const { _id, name, email, group, manager } = row;

                          return (
                            <TableRow
                              hover
                              key={_id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={false}
                              aria-checked={false}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  checked={selectedEmploy === _id}
                                  onChange={() => handleClick(_id)}
                                />
                              </TableCell>
                              <TableCell component="th" scope="row" padding="none">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Avatar
                                    alt={name}
                                    src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${name
                                      .split(' ')
                                      .join('%20')}`}
                                  />
                                  <Typography variant="subtitle2" noWrap>
                                    {name}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{email}</TableCell>
                              <TableCell align="left">
                                {group ? (
                                  group.name
                                ) : (
                                  <Label variant="ghost" color="error">
                                    No Group
                                  </Label>
                                )}
                              </TableCell>
                              <TableCell align="left">
                                {manager ? (
                                  manager.name
                                ) : (
                                  <Label variant="ghost" color="error">
                                    No Manager
                                  </Label>
                                )}
                              </TableCell>
                              {user && user.role === 'Manager' && (
                                <TableCell align="right">
                                  <UserMoreMenu
                                    currentUser={row}
                                    toggleDelOpen={toggleDelOpen}
                                    toggleEditOpen={toggleEditOpen}
                                    setSelected={setSelected}
                                    addToTable={!group}
                                    toggleAddToOpen={() => {
                                      setSelectedEmploy(_id);
                                      toggleAddToOpen();
                                    }}
                                    addToSlug="Add to Group"
                                    removeFromTable={!!group}
                                    handleRemoveFrom={() => {
                                      setSelectedEmploy(_id);
                                      toggleRemoveFromOpen();
                                    }}
                                    removeFromSlug="Remove from Group"
                                  />
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
                {employs && isUserNotFound && (
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
            count={employs ? employs.length : 0}
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
        dialogTitle="Delete This Employee ?"
        success={handleDelete}
      />
      <AddorEditModal
        isOpen={isCreateOpen}
        createNew={(...props) => {
          addNewEmployee(...props, toggleCreateOpen);
        }}
        closeDialog={addNewEmployee}
        role="Employee"
      />
      <AddorEditModal
        isOpen={isEditOpen}
        closeDialog={toggleEditOpen}
        updateUser={(...props) => {
          editEmployee(...props, toggleEditOpen);
        }}
        editUser={selected}
        isEdit
        role="Employee"
      />
      <AddToTableModal
        isOpen={isAddToOpen}
        closeDialog={toggleAddToOpen}
        targetId={selectedEmploy}
        addAction={addEmployeeToGroups}
        data={groups}
        slug="Add"
        resource="Employee"
      />
      <AddToTableModal
        isOpen={isRemoveFromOpen}
        closeDialog={toggleRemoveFromOpen}
        targetId={selectedEmploy}
        addAction={removeEmployeeGroup}
        data={groups}
        slug="Remove"
        resource="Employee"
      />
    </Page>
  );
};

export default Employees;
