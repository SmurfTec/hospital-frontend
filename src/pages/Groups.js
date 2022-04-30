import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Checkbox
} from '@material-ui/core';
// components
import Page from '../components/Page';
// import Skeleton from '@material-ui/lab/Skeleton';
import Skeleton from 'react-loading-skeleton';
import ConfirmDeleteModal from 'dialogs/ConfirmDelete';

import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
//

import { DataContext } from 'contexts/DataContext';
import { AuthContext } from 'contexts/AuthContext';
import AddorEditModal from 'dialogs/AddorEditModal';
import Label from 'components/Label';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'manager', label: 'Manager', alignRight: false },
  { id: 'employees', label: 'Employees', alignRight: false },
  { id: 'tasks', label: 'Tasks', alignRight: false },
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

export default function Groups() {
  const { groups, deleteGroup, addNewGroup, editGroup } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState();
  const [selectedGroup, setSelectedGroup] = useState();

  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = groups.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const toggleDelOpen = () => setIsDelOpen((st) => !st);
  const toggleEditOpen = () => setIsEditOpen((st) => !st);
  const toggleCreateOpen = () => setIsCreateOpen((st) => !st);

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

  const handleDelete = () => {
    console.log(`selected`, selected);
    deleteGroup(selected, toggleDelOpen);
    setSelected(null);
  };

  const emptyRows = page > 0 && groups ? Math.max(0, (1 + page) * rowsPerPage - groups.length) : 0;

  const isUserNotFound = filteredGroups.length === 0;

  useEffect(() => {
    if (!groups || groups === null) return;
    setFilteredGroups(applySortFilter(groups, getComparator(order, orderBy), filterName));
  }, [groups, order, orderBy, filterName]);

  const handleClick = (id) => {
    if (selectedGroup === id) setSelectedGroup(undefined);
    else setSelectedGroup(id);
  };

  return (
    <Page title="Groups | Task Manager App">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Groups
          </Typography>
          {user && user.role === 'Manager' && (
            <Button
              variant="contained"
              onClick={toggleCreateOpen}
              startIcon={<Icon icon={plusFill} />}
            >
              New Group
            </Button>
          )}
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selectedGroup ? 1 : 0}
            filterName={filterName}
            onFilterName={handleFilterByName}
            slug="Groups"
            viewLink={`/dashboard/groups/${selectedGroup}`}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={groups ? groups.length : 0}
                  numSelected={selectedGroup ? 1 : 0}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {groups
                    ? filteredGroups
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const { _id, name, manager, tasks, employees } = row;

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
                                  checked={selectedGroup === _id}
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
                              <TableCell align="left">
                                {manager ? (
                                  manager.name
                                ) : (
                                  <Label variant="ghost" color="error">
                                    No Manager
                                  </Label>
                                )}{' '}
                              </TableCell>
                              <TableCell align="left">
                                {employees && employees.length > 0 ? (
                                  employees.length
                                ) : (
                                  <Label variant="ghost" color="error">
                                    0
                                  </Label>
                                )}
                              </TableCell>
                              <TableCell align="left">
                                {tasks && tasks.length > 0 ? (
                                  tasks.length
                                ) : (
                                  <Label variant="ghost" color="error">
                                    0
                                  </Label>
                                )}
                              </TableCell>
                              {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={(status === 'banned' && 'error') || 'success'}
                            >
                              {sentenceCase(status)}
                            </Label>
                          </TableCell> */}
                              {user && user.role === 'Manager' && (
                                <TableCell align="right">
                                  <UserMoreMenu
                                    currentUser={row}
                                    toggleDelOpen={toggleDelOpen}
                                    toggleEditOpen={toggleEditOpen}
                                    setSelected={setSelected}
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
                {groups && isUserNotFound && (
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
            count={groups ? groups.length : 0}
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
        dialogTitle="Delete This Group ?"
        success={handleDelete}
      />
      <AddorEditModal
        isOpen={isCreateOpen}
        closeDialog={toggleCreateOpen}
        createNew={(...props) => {
          addNewGroup(...props, toggleCreateOpen);
        }}
        role="Group"
      />
      <AddorEditModal
        isOpen={isEditOpen}
        closeDialog={toggleEditOpen}
        updateUser={(...props) => {
          editGroup(...props, toggleEditOpen);
        }}
        editUser={selected}
        isEdit
        role="Group"
      />
    </Page>
  );
}
