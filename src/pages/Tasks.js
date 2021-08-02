import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import { ConfirmDialog as ConfirmDeleteModal } from 'mui-confirm-dialog';
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
import AddToTableModal from 'dialogs/AddToManagerModal';
import AddToGroupModal from 'dialogs/AddToGroupModal';
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
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'manager', label: 'Manager', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'deadline', label: 'Deadline', alignRight: false },
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

const Tasks = () => {
  const {
    tasks,
    assignTaskToManager,
    unAssignTaskFromManger,
    managers,
    deleteTask,
    addNewTask,
    updateTask,
    groups,
    assignTaskToGroup,
    unAssignTaskFromGroup
  } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [filteredtasks, setFilteredtasks] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState();
  const [selectedTask, setSelectedTask] = useState();
  const [orderBy, setOrderBy] = useState('name');
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddToOpen, setIsAddToOpen] = useState(false);
  const [isRemoveFromOpen, setIsRemoveFromOpen] = useState(false);
  const [isAddToOpen2, setIsAddToOpen2] = useState(false);
  const [isRemoveFromOpen2, setIsRemoveFromOpen2] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tasks.map((n) => n.name);
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
  const toggleAddToOpen2 = () => setIsAddToOpen2((st) => !st);
  const toggleRemoveFromOpen2 = () => setIsRemoveFromOpen2((st) => !st);

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

  const emptyRows = page > 0 && tasks ? Math.max(0, (1 + page) * rowsPerPage - tasks.length) : 0;

  const isUserNotFound = filteredtasks.length === 0;

  useEffect(() => {
    if (!tasks || tasks === null) return;
    setFilteredtasks(applySortFilter(tasks, getComparator(order, orderBy), filterName));
  }, [tasks, order, orderBy, filterName]);

  const handleDelete = () => {
    toggleDelOpen();
    deleteTask(selected);
  };

  const getFormattedDate = (date) => {
    const dt = new Date(date);
    return dt.toDateString();
  };

  return (
    <Page title="Tasks | Task Manager App">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Tasks
          </Typography>
          {user && user.role === 'Admin' && (
            <Button
              variant="contained"
              onClick={toggleCreateOpen}
              startIcon={<Icon icon={plusFill} />}
            >
              New Task
            </Button>
          )}
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={0}
            filterName={filterName}
            onFilterName={handleFilterByName}
            slug="Tasks"
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tasks ? tasks.length : 0}
                  numSelected={0}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {tasks
                    ? filteredtasks
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const { _id, description, name, manager, status, deadLine, group } = row;
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
                                {/* <Checkbox
                                  checked={isItemSelected}
                                  onChange={(event) => handleClick(event, name)}
                                /> */}
                              </TableCell>
                              <TableCell component="th" scope="row" padding="none">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  {/* <Avatar
                                    alt={name}
                                    src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${name
                                      .split(' ')
                                      .join('%20')}`}
                                  /> */}
                                  <Typography variant="subtitle2" noWrap>
                                    {name}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{description}</TableCell>
                              <TableCell align="left">
                                {manager ? (
                                  manager.name
                                ) : (
                                  <Label variant="ghost" color="error">
                                    Not Assigned
                                  </Label>
                                )}
                              </TableCell>
                              <TableCell align="left">
                                {status === 'inProgress' ? (
                                  <Label variant="ghost" color="warning">
                                    {status}
                                  </Label>
                                ) : (
                                  <Label variant="ghost" color="success">
                                    {status}
                                  </Label>
                                )}
                              </TableCell>
                              <TableCell align="left">
                                {deadLine && getFormattedDate(deadLine)}
                              </TableCell>
                              {user && user.role === 'Admin' && (
                                <TableCell align="right">
                                  <UserMoreMenu
                                    currentUser={row}
                                    toggleDelOpen={toggleDelOpen}
                                    toggleEditOpen={toggleEditOpen}
                                    setSelected={setSelected}
                                    addToTable={!manager}
                                    toggleAddToOpen={() => {
                                      setSelectedTask(_id);
                                      toggleAddToOpen();
                                    }}
                                    addToSlug="Assign to Manager"
                                    removeFromTable={!!manager}
                                    handleRemoveFrom={() => {
                                      console.clear();
                                      console.log(`row`, row);
                                      console.log(`_id`, _id);
                                      console.log(`manager._id`, manager._id);
                                      const managerId = manager._id || manager;
                                      unAssignTaskFromManger(_id, managerId);
                                    }}
                                    removeFromSlug="UnAssign"
                                  />
                                </TableCell>
                              )}
                              {user && user.role === 'Manager' && (
                                <TableCell align="right">
                                  <UserMoreMenu
                                    currentUser={row}
                                    setSelected={setSelected}
                                    addToTable={!group}
                                    toggleAddToOpen={() => {
                                      setSelectedTask(_id);
                                      toggleAddToOpen2();
                                    }}
                                    addToSlug="Assign to Group"
                                    removeFromTable={!group}
                                    handleRemoveFrom={() => {
                                      console.clear();
                                      console.log(`row`, row);
                                      console.log(`_id`, _id);
                                      console.log(`group._id`, group._id);
                                      const groupId =group ? group._id : group;
                                      unAssignTaskFromGroup(_id, groupId);
                                    }}
                                    removeFromSlug="UnAssign"
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
                {tasks && isUserNotFound && (
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
            count={tasks ? tasks.length : 0}
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
        dialogTitle="Delete This Task ?"
        success={handleDelete}
      />
      <AddorEditModal
        isOpen={isCreateOpen}
        closeDialog={toggleCreateOpen}
        createNew={addNewTask}
        role="Task"
      />
      <AddorEditModal
        isOpen={isEditOpen}
        closeDialog={toggleEditOpen}
        updateUser={updateTask}
        editUser={selected}
        isEdit
        role="Task"
      />
      <AddToTableModal
        isOpen={isAddToOpen}
        closeDialog={toggleAddToOpen}
        targetId={selectedTask}
        addAction={assignTaskToManager}
        data={managers}
        slug="Assign"
      />
      <AddToTableModal
        isOpen={isRemoveFromOpen}
        closeDialog={toggleRemoveFromOpen}
        targetId={selectedTask}
        addAction={unAssignTaskFromManger}
        data={managers}
        slug="unAssign"
      />
      <AddToGroupModal
        isOpen={isAddToOpen2}
        closeDialog={toggleAddToOpen2}
        targetId={selectedTask}
        addAction={assignTaskToGroup}
        data={groups}
        slug="Assign"
        resource="Task"
      />
      <AddToGroupModal
        isOpen={isRemoveFromOpen2}
        closeDialog={toggleRemoveFromOpen2}
        targetId={selectedTask}
        addAction={unAssignTaskFromGroup}
        data={groups}
        slug="unAssign"
        resource="Task"
      />
    </Page>
  );
};

export default Tasks;
