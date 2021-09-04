import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { AuthContext } from 'contexts/AuthContext';
import { handleCatch, makeReq } from 'utils/constants';
import { Box } from '@material-ui/system';
import { Button, Grid, Popover, Typography } from '@material-ui/core';
import Skeleton from 'react-loading-skeleton';
import { Add } from '@material-ui/icons';
import { DatePicker } from 'react-trip-date';
import { useTheme } from '@emotion/react';
import MeetingScheduleDialog from 'dialogs/MeetingSchedule';
import { toast } from 'react-toastify';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Label from 'components/Label';
import {
  Card,
  Table,
  Stack,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination
} from '@material-ui/core';
import { UserListHead, UserListToolbar } from 'components/_dashboard/user';
import uuid from 'uuid/dist/v4';
import EventIcon from '@material-ui/icons/Event';

const useStyles = makeStyles((theme) => ({
  upcomingMeetingBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${theme.palette.grey[400]}`
  }
}));

const ManagerMeeting = ({ user, classes }) => {
  const theme = useTheme();
  const initialState = {
    startTime: '',
    endTime: '',
    days: []
  };

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const toggleScheduleOpen = () => {
    setIsScheduleModalOpen((st) => !st);
  };

  const [meeting, setMeeting] = useState();
  const [upcomingMeetings, setUpcomingMeetings] = useState();
  const [state, setState] = useState(initialState);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedMeetingDays, setSelectedMeetingDays] = useState();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState();
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handlePopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectAllClick = (event) => {};

  const [tableHeadings, setTableHeadings] = useState([
    { id: 'number', label: 'No #', alignRight: false },
    { id: 'timings', label: 'Timings', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'employee', label: 'Employee', alignRight: false }
  ]);

  useEffect(() => {
    if (!meeting) return;
    const days = meeting.days.map((el) => el.date.slice(0, el.date.indexOf('T')));
    setSelectedMeetingDays(days);
    // setSelectedMeetingDays(days);
  }, [meeting]);

  const toggleFetching = () => {
    setIsFetching((st) => !st);
  };

  useEffect(() => {
    (async () => {
      try {
        const resData = await makeReq('/meeting');
        setMeeting(resData.meeting);

        const resData2 = await makeReq('/meeting/slots', {}, 'GET');
        if (resData2.meetings.length > 0) {
          setUpcomingMeetings(resData2.meetings);
        }
      } catch (err) {
      } finally {
        toggleFetching();
      }
    })();
  }, [user]);

  const handleSchedule = async (body) => {
    try {
      let resData;

      if (!meeting) resData = await makeReq('/meeting/schedule', { body: { ...body } }, 'POST');
      else resData = await makeReq('/meeting/schedule', { body: { ...body } }, 'PATCH');
      console.log(`resData`, resData);

      setMeeting(resData.meeting);
      toggleScheduleOpen();
      toast.success('Success');
    } catch (err) {
      handleCatch(err);
    }
  };

  const isPopoverOpen = Boolean(anchorEl);

  const togglePopover = () => {
    setAnchorEl(null);
  };

  const id = isPopoverOpen ? 'schedule-popover' : undefined;

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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const emptyRows =
    page > 0 && upcomingMeetings
      ? Math.max(0, (1 + page) * rowsPerPage - upcomingMeetings.length)
      : 0;
  const isUserNotFound = upcomingMeetings ? upcomingMeetings.length === 0 : 0;

  return (
    <Box>
      <Box>
        {!isFetching ? (
          <Box display="flex" justifyContent="space-around" alignItems="center">
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <AccessTimeIcon style={{ marginRight: 10 }} />
              <Typography variant="h5">Timings : </Typography>

              <Typography variant="h6" fontWeight="normal" marginLeft={1}>
                {meeting ? (
                  new Date(meeting.startTime).toTimeString().slice(0, 5)
                ) : (
                  <Label variant="ghost" color="error">
                    Not Set yet
                  </Label>
                )}
                {'-'}
                {meeting && new Date(meeting.endTime).toTimeString().slice(0, 5)}
              </Typography>
            </div>
            <div>
              <Button
                aria-describedby={id}
                variant="contained"
                color="primary"
                onClick={handlePopover}
                endIcon={<DateRangeIcon />}
                disabled={!meeting}
              >
                View Schedule
              </Button>
              <Popover
                id={id}
                open={isPopoverOpen}
                anchorEl={anchorEl}
                onClose={togglePopover}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
              >
                <DatePicker
                  theme={theme}
                  handleChange={() => {}}
                  onChange={() => {}}
                  jalali={false}
                  numberOfMonths={1}
                  selectedDays={selectedMeetingDays}
                  numberOfSelectableDays={30} // number of days you need
                  disabledBeforeToday
                  // disabledAfterDate={new Date()}
                  autoResponsive={false}
                  disabled // disable calendar
                />
              </Popover>
            </div>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={toggleScheduleOpen}
            >
              {meeting ? 'Update' : 'Create'} Meeting Schedule
            </Button>
          </Box>
        ) : (
          <Skeleton height={30} width={250} />
        )}

        <Typography variant="h5" marginTop={5}>
          Upcoming Meetings
        </Typography>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <UserListHead
              order={order}
              orderBy={orderBy}
              headLabel={tableHeadings}
              rowCount={upcomingMeetings ? upcomingMeetings.length : 0}
              numSelected={0}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />

            <TableBody>
              {upcomingMeetings
                ? upcomingMeetings
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, idx) => {
                      const { _id, employee, startTime, endTime } = row;

                      return (
                        <TableRow
                          hover
                          key={_id}
                          tabIndex={-1}
                          selected={false}
                          aria-checked={false}
                        >
                          <TableCell padding="checkbox"></TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            {idx + 1}
                          </TableCell>
                          <TableCell align="left">
                            {new Date(startTime).toTimeString().slice(0, 5)}
                            {'-'}
                            {new Date(endTime).toTimeString().slice(0, 5)}
                          </TableCell>

                          <TableCell align="left">{new Date(startTime).toDateString()}</TableCell>

                          <TableCell align="left">{employee.name}</TableCell>
                        </TableRow>
                      );
                    })
                : Array(5)
                    .fill()
                    .map(() => (
                      <TableRow key={uuid()}>
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
                      </TableRow>
                    ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            {upcomingMeetings && isUserNotFound && (
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
      </Box>
      <MeetingScheduleDialog
        open={isScheduleModalOpen}
        closeDialog={toggleScheduleOpen}
        meeting={meeting}
        user={user}
        success={handleSchedule}
      />
    </Box>
  );
};

const MeetingsEmployee = ({ user }) => {
  const [meeting, setMeeting] = useState();
  const [isFetching, setIsFetching] = useState(true);

  const handleReqMeeting = async () => {
    try {
      const resData = await makeReq('/meeting/request-meeting', {}, 'PATCH');
      setSlots((st) => [...st, resData.slot]);
      toast.success('Success');
    } catch (err) {
      handleCatch(err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const resData = await makeReq('/meeting/slots', {}, 'GET');
        if (resData.meetings.length > 0) {
          setMeeting(resData.meetings[0]);
        }
      } catch (err) {
        handleCatch(err);
      } finally {
        setIsFetching(false);
      }
    })();
  }, [user]);

  return (
    <Box>
      {meeting && (
        <Typography variant="h6" style={{ margin: 'auto' }} fontWeight="normal">
          Upcoming Meeting
        </Typography>
      )}
      <Box
        style={{ width: '100%' }}
        display="flex"
        justifyContent="space-around"
        alignItems="center"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <AccessTimeIcon style={{ marginRight: 10 }} />
          <Typography variant="h5">Timings : </Typography>

          <Typography variant="h6" fontWeight="normal" marginLeft={1}>
            {meeting ? (
              new Date(meeting.startTime).toTimeString().slice(0, 5)
            ) : (
              <Label variant="ghost" color="error">
                Not Set yet
              </Label>
            )}
            {'-'}
            {meeting && new Date(meeting.endTime).toTimeString().slice(0, 5)}
          </Typography>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <EventIcon style={{ marginRight: 10 }} />
          <Typography variant="h5">Date : </Typography>

          <Typography variant="h6" fontWeight="normal" marginLeft={1}>
            {meeting && new Date(meeting.startTime).toDateString()}
          </Typography>
        </div>
        <Button
          disabled={isFetching || !!meeting}
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleReqMeeting}
        >
          Request Meeting
        </Button>
      </Box>
    </Box>
  );
};

const Meeting = () => {
  const { user } = useContext(AuthContext);
  const classes = useStyles();

  return (
    <div>
      {user.role === 'Manager' ? (
        <ManagerMeeting user={user} classes={classes} />
      ) : (
        <MeetingsEmployee user={user} />
      )}
    </div>
  );
};

export default Meeting;
