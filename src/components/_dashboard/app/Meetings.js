import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { AuthContext } from 'contexts/AuthContext';
import { handleCatch, makeReq } from 'utils/constants';
import { Box } from '@material-ui/system';
import { Button, Grid, Typography } from '@material-ui/core';
import Skeleton from 'react-loading-skeleton';
import { Add } from '@material-ui/icons';
import { DatePicker } from 'react-trip-date';
import { useTheme } from '@emotion/react';
import MeetingScheduleDialog from 'dialogs/MeetingSchedule';
import { toast } from 'react-toastify';
const useStyles = makeStyles((theme) => ({}));

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
  const [state, setState] = useState(initialState);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedMeetingDays, setSelectedMeetingDays] = useState();

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
      } catch (err) {
      } finally {
        toggleFetching();
      }
    })();
  }, [user]);

  const handleSchedule = async (body) => {
    try {
      const resData = await makeReq('/meeting/schedule', { body: { ...body } }, 'PATCH');
      console.log(`resData`, resData);

      setMeeting(resData.meeting);
      toggleScheduleOpen();
      toast.success('Success');
    } catch (err) {
      handleCatch(err);
    }
  };

  return (
    <Box>
      <Box style={{ width: '100%' }} display="flex" justifyContent="flex-end" alignItems="center">
        {!isFetching ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={toggleScheduleOpen}
          >
            {meeting ? 'Update' : 'Create'} Meeting Schedule
          </Button>
        ) : (
          <Skeleton height={30} width={250} />
        )}
      </Box>
      {!isFetching && (
        <Box display="flex" justifyContent="center" alignItems="flex-start" flexDirection="column">
          <Typography variant="h4" style={{ marginInline: 'auto' }} marginBottom={4}>
            {meeting ? 'Your Meeting Schedule' : `You Don't have any meeting schedule`}
          </Typography>
          {meeting && (
            <Grid container>
              <Grid item xs={12} sm={5} style={{ paddingTop: '2rem' }}>
                <Box>
                  <Typography style={{ display: 'initial' }} variant="h3">
                    Start Time :{' '}
                  </Typography>
                  <Typography
                    variant="h3"
                    style={{
                      padding: '10px',
                      backgroundColor: '#ccc',
                      marginLeft: 50,
                      width: '100px',
                      display: 'initial'
                    }}
                  >
                    {`${new Date(meeting.startTime).getHours()}:${new Date(
                      meeting.startTime
                    ).getMinutes()}`}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h3" style={{ display: 'initial' }}>
                    End Time :{' '}
                  </Typography>
                  <Typography
                    variant="h3"
                    style={{
                      padding: '10px',
                      backgroundColor: '#ccc',
                      marginLeft: 50,
                      width: '100px',
                      display: 'initial'
                    }}
                  >
                    {`${new Date(meeting.endTime).getHours()}:${new Date(
                      meeting.endTime
                    ).getMinutes()}`}
                  </Typography>
                </Box>{' '}
              </Grid>
              <Grid item xs={12} sm={5}>
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
              </Grid>
            </Grid>
          )}
        </Box>
      )}

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
  const [slots, setSlots] = useState([]);
  const theme = useTheme();

  const handleReqMeeting = async () => {
    try {
      const resData = await makeReq('/meeting/request-meeting', {}, 'PATCH');
      setSlots((st) => [...st, resData.slot]);
      toast.success('Success');
    } catch (err) {
      handleCatch(err);
    }
  };
  return (
    <Box>
      <Box style={{ width: '100%' }} display="flex" justifyContent="flex-end" alignItems="center">
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleReqMeeting}>
          Request Meeting
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" alignItems="flex-start" flexDirection="column">
        {/* <Typography variant="h4" style={{ marginInline: 'auto' }} marginBottom={4}>
            {meeting ? 'Your Meeting Schedule' : `You Don't have any meeting schedule`}
          </Typography> */}
        {slots &&
          slots.length > 0 &&
          slots.map((slot) => (
            <Grid container key={slot._id}>
              <Grid item xs={12} sm={5} style={{ paddingTop: '2rem' }}>
                <Box>
                  <Typography style={{ display: 'initial' }} variant="h3">
                    Start Time :{' '}
                  </Typography>
                  <Typography
                    variant="h3"
                    style={{
                      padding: '10px',
                      backgroundColor: '#ccc',
                      marginLeft: 50,
                      width: '100px',
                      display: 'initial'
                    }}
                  >
                    {`${new Date(slot.startTime).getHours()}:${new Date(
                      slot.startTime
                    ).getMinutes()}`}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h3" style={{ display: 'initial' }}>
                    End Time :{' '}
                  </Typography>
                  <Typography
                    variant="h3"
                    style={{
                      padding: '10px',
                      backgroundColor: '#ccc',
                      marginLeft: 50,
                      width: '100px',
                      display: 'initial'
                    }}
                  >
                    {`${new Date(slot.endTime).getHours()}:${new Date(slot.endTime).getMinutes()}`}
                  </Typography>
                </Box>{' '}
              </Grid>
              <Grid item xs={12} sm={5}>
                <Typography variant="h4">
                  Date : {new Date(slot.startTime).toDateString()}
                </Typography>
                {/*  <DatePicker
                  theme={theme}
                  handleChange={() => {}}
                  onChange={() => {}}
                  jalali={false}
                  numberOfMonths={1}
                  selectedDays={slot.startTime.toString()}
                  numberOfSelectableDays={30} // number of days you need
                  disabledBeforeToday
                  // disabledAfterDate={new Date()}
                  autoResponsive={false}
                  disabled // disable calendar
                />*/}
              </Grid>
            </Grid>
          ))}
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
