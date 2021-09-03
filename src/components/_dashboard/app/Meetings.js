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
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: 350
                  }}
                >
                  <Typography style={{ display: 'initial' }} variant="h3">
                    Start Time :{' '}
                  </Typography>
                  <Typography
                    variant="h3"
                    style={{
                      padding: '10px',
                      backgroundColor: '#ccc',
                      display: 'initial'
                    }}
                  >
                    {new Date(meeting.startTime).toTimeString().slice(0, 5)}
                  </Typography>
                </Box>
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: 350
                  }}
                >
                  <Typography variant="h3" style={{ display: 'initial' }}>
                    End Time :{' '}
                  </Typography>
                  <Typography
                    variant="h3"
                    style={{
                      padding: '10px',
                      backgroundColor: '#ccc',
                      display: 'initial'
                    }}
                  >
                    {new Date(meeting.endTime).toTimeString().slice(0, 5)}
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
          {upcomingMeetings?.length > 0 && (
            <Typography variant="h4" style={{ margin: 'auto', marginBottom: '2rem' }}>
              Upcoming Meetings
            </Typography>
          )}
          <Grid container spacing={4}>
            {upcomingMeetings &&
              upcomingMeetings.map((slot) => (
                <Grid key={slot._id} item xs={12} sm={5} style={{ paddingTop: '2rem' }}>
                  <Box className={classes.upcomingMeetingBox}>
                    <Box>
                      <Typography variant="h4">
                        Date : {new Date(slot.startTime).toDateString()}
                      </Typography>
                      <Box
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          maxWidth: 350
                        }}
                      >
                        <Typography style={{ display: 'initial' }} variant="h4">
                          Start Time :{' '}
                        </Typography>
                        <Typography
                          variant="h4"
                          style={{
                            padding: '10px',
                            backgroundColor: '#ccc',
                            display: 'initial'
                          }}
                        >
                          {new Date(slot.startTime).toTimeString().slice(0, 5)}
                        </Typography>
                      </Box>
                      <Box
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          maxWidth: 350
                        }}
                      >
                        <Typography variant="h4" style={{ display: 'initial' }}>
                          End Time :{' '}
                        </Typography>
                        <Typography
                          variant="h4"
                          style={{
                            padding: '10px',
                            backgroundColor: '#ccc',
                            display: 'initial'
                          }}
                        >
                          {new Date(slot.endTime).toTimeString().slice(0, 5)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
          </Grid>
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
      <Box style={{ width: '100%' }} display="flex" justifyContent="flex-end" alignItems="center">
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

      <Box display="flex" justifyContent="center" alignItems="flex-start" flexDirection="column">
        <Typography variant="h4" style={{ marginInline: 'auto' }} marginBottom={4}>
          {meeting ? 'Your Upcoming Meeting' : `You Don't have any upcoming meeting `}
        </Typography>
        {meeting && (
          <Grid container>
            <Grid item xs={12} sm={5} style={{ paddingTop: '2rem' }}>
              <Typography variant="h4">
                Date : {new Date(meeting.startTime).toDateString()}
              </Typography>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  maxWidth: 350
                }}
              >
                <Typography style={{ display: 'initial' }} variant="h3">
                  Start Time :{' '}
                </Typography>
                <Typography
                  variant="h3"
                  style={{
                    padding: '10px',
                    backgroundColor: '#ccc',
                    display: 'initial'
                  }}
                >
                  {new Date(meeting.startTime).toTimeString().slice(0, 5)}
                </Typography>
              </Box>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  maxWidth: 350
                }}
              >
                <Typography variant="h3" style={{ display: 'initial' }}>
                  End Time :{' '}
                </Typography>
                <Typography
                  variant="h3"
                  style={{
                    padding: '10px',
                    backgroundColor: '#ccc',
                    display: 'initial'
                  }}
                >
                  {new Date(meeting.endTime).toTimeString().slice(0, 5)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
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
