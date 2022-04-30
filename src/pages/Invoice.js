import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useContext, useEffect, useRef, useState } from 'react';
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
import { CloudDownload } from '@material-ui/icons';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import GenInvoice from './genInvoice';
import { getDaysInMonth } from 'date-fns/fp';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'appointment', label: 'Appointment', alignRight: false },
  { id: 'medicineCost', label: 'MedicineCost', alignRight: false },
  { id: 'roomCharges', label: 'RoomCharges', alignRight: false },
  { id: 'doctorCharges', label: 'DoctorCharges', alignRight: false },
  { id: 'otherCharges', label: 'OtherCharges', alignRight: false },
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
    return filter(
      array,
      (_user) => _user.appointment?.symptoms?.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Invoices() {
  const { invoices, deleteInvoice, editInvoice, addNewInvoice } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState();
  const [selectedInvoice, setSelectedInvoice] = useState();
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [genInvoice, setGenInvoice] = useState(null);

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
      const newSelecteds = invoices.map((n) => n.name);
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
    page > 0 && invoices ? Math.max(0, (1 + page) * rowsPerPage - invoices.length) : 0;

  const isUserNotFound = filteredInvoices.length === 0;

  useEffect(() => {
    if (!invoices || invoices === null) return;
    setFilteredInvoices(applySortFilter(invoices, getComparator(order, orderBy), filterName));
  }, [invoices, order, orderBy, filterName]);

  const handleDelete = () => {
    // toggleDelOpen();
    console.log(`selected`, selected);
    deleteInvoice(selected, toggleDelOpen);
    setSelected(null);
  };

  const handleClick = (id) => {
    if (selectedInvoice === id) setSelectedInvoice(undefined);
    else setSelectedInvoice(id);
  };
  const componentRef = useRef();

  const handleDownload = (el) => {
    setGenInvoice(el);
    console.log('el', el);
    setTimeout(() => {
      handlePrint();
    }, 1500);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  return (
    <Page title="Invoices | Task Invoice App">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Invoices
          </Typography>
          {user && user.role === 'admin' && (
            <Button
              variant="contained"
              onClick={toggleCreateOpen}
              startIcon={<Icon icon={plusFill} />}
            >
              New Invoice
            </Button>
          )}
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selectedInvoice ? 1 : 0}
            filterName={filterName}
            onFilterName={handleFilterByName}
            slug="Invoices"
            viewLink={`/dashboard/invoices/${selectedInvoice}`}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={invoices ? invoices.length : 0}
                  numSelected={selectedInvoice ? 1 : 0}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {invoices
                    ? filteredInvoices
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                          const {
                            _id,
                            appointment,
                            medicineCost,
                            roomCharges,
                            doctorCharges,
                            otherCharges
                          } = row;

                          return (
                            <TableRow
                              hover
                              key={_id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={selectedInvoice === _id}
                              aria-checked={false}
                            >
                              <TableCell padding="checkbox"></TableCell>
                              <TableCell component="th" scope="row" padding="none">
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography variant="subtitle2" noWrap>
                                    {appointment?.symptoms}
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell align="left">{medicineCost}</TableCell>
                              <TableCell align="left">{roomCharges}</TableCell>
                              <TableCell align="left">{doctorCharges}</TableCell>
                              <TableCell align="left">{otherCharges}</TableCell>
                              <TableCell>
                                <IconButton onClick={() => handleDownload(row)}>
                                  <CloudDownload />
                                </IconButton>
                              </TableCell>
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
                {invoices && isUserNotFound && (
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

          <Container ref={componentRef}>
            {genInvoice && (
              <>
                <Typography variant="h5">Invoice</Typography>

                <Typography variant="h5">
                  Appointment : {genInvoice.appointment?.symptoms}
                </Typography>
                <Typography variant="h5">MedicineCost : {genInvoice.medicineCost}</Typography>
                <Typography variant="h5">RoomCharges : {genInvoice.roomCharges}</Typography>
                <Typography variant="h5">DoctorCharges : {genInvoice.doctorCharges}</Typography>
                <Typography variant="h5">OtherCharges : {genInvoice.otherCharges}</Typography>
              </>
            )}
          </Container>
          {/* <GenInvoice invoice={genInvoice} ref={componentRef} /> */}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={invoices ? invoices.length : 0}
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
        dialogTitle="Delete This Invoice ?"
        success={handleDelete}
      />
      <AddorEditModal
        isOpen={isCreateOpen}
        createNew={(...props) => {
          addNewInvoice(...props, toggleCreateOpen);
        }}
        closeDialog={toggleCreateOpen}
        role="Invoice"
      />
      <AddorEditModal
        isOpen={isEditOpen}
        closeDialog={toggleEditOpen}
        updateUser={(id, body) => {
          editInvoice(id, body, toggleEditOpen);
        }}
        editUser={selected}
        isEdit
        role="Invoice"
      />
    </Page>
  );
}
