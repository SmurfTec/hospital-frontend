// material
import { Box, Grid, Container, Typography, Button } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { AuthContext } from 'contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import RateReviewIcon from '@material-ui/icons/RateReview';
import StagesAccordian from './StagesAccordian';
// components
import Page from '../components/Page';

import Skeleton from 'react-loading-skeleton';
import { makeReq } from 'utils/constants';
import { useParams } from 'react-router-dom';
import Label from 'components/Label';
import { withStyles } from '@material-ui/styles';
import AddReviewModal from 'dialogs/AddReviewModal';
import { DataContext } from 'contexts/DataContext';
// ----------------------------------------------------------------------

const Styles = {
  Dialog: {
    '& .MuiDialog-paper': {
      // minWidth: 700,
      // minHeight: 320,
      width: 600,
      borderRadius: 15,
      padding: 0,
      minHeight: 420
    },
    '& .MuiDialog-paperWidthSm': {
      maxWidth: 'unset'
    },
    '& .MuiDialogTitle-root': {
      padding: '10px 20px',
      '& .MuiTypography-root': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& svg': {
          cursor: 'pointer'
        },
        '& p': {
          margin: 0
        }
      }
    },
    '& .MuiDialogContent-root': {
      padding: '0 !important'
    }
  },
  formContainer: {
    '& .react-datepicker-wrapper': {
      '& input': {
        width: 200,
        textAlign: 'center'
      }
    },
    '& .react-datepicker__time-box': {
      width: '100px !important'
    }
  },
  textField: {
    margin: '20px 0px'
  },
  MoreMenu: {
    zIndex: '222212 !important',
    '& .MuiMenu-paper': {
      transform: 'translate(-5px, 45px) !important',
      borderRadius: 15,
      '& li': {
        color: '#3d474d !important',
        marginBottom: 15,
        width: 250,
        '& svg': {
          marginRight: 10,
          color: '#3d474d !important'
        }
      }
    }
  },
  StatsTypo: {
    width: '50%',
    padding: 10,
    borderRadius: 15,
    border: '1px solid #ccc',
    color: '#fff',
    textAlign: 'center'
  },
  RightNavItem: {
    backgroundColor: '#E0F2F1',

    padding: 15,
    minHeight: 264,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& .MuiFormControl-root': {
      width: '100%'
    },
    '@media (min-width: 768px)': {
      maxHeight: 500
    }
  },
  LeftNavItem: {
    backgroundColor: '#E1F5FE',
    padding: 15,
    '@media (min-width: 768px)': {
      maxHeight: 500
    }
    // borderRight: '1px solid silver',
  }
};

const ViewTask = ({ classes }) => {
  const { user } = useContext(AuthContext);
  const { addNewReview } = useContext(DataContext);
  const [task, setTask] = useState();
  // const [taskReviews, setTaskReviews] = useState();
  const [taskReviews, setTaskReviews] = useState();
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [currentEmployeeId, setCurrentEmployeeId] = useState();

  const toggleAddReviewOpen = () => {
    setIsAddReviewOpen(!isAddReviewOpen);
  };

  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const resData = await makeReq(`/task/${id}`);
      console.log(`resData`, resData);
      setTask(resData.task);
    })();
    // (async () => {
    //   const resData = await makeReq(`/task/getTaskReviews/${id}`);
    //   console.clear();
    //   console.log(`resData`, resData);
    //   setTaskReviews(resData.reviews);
    // })();
    (async () => {
      const resData = await makeReq(`/users/${id}/reviews`);
      console.log(`resData`, resData);
      // setTaskReviews(resData.reviews)
    })();
  }, [id]);

  useEffect(() => {
    console.log(`task`, task);
    if (task) {
      console.log(`task?.group`, task.group);
    }
    (async () => {
      if (!task || !task.group || !task.group.employees) return;

      console.log(`task.group.employees.length`, task.group.employees.length);
      let employeeRatings = task.group.employees.map(async (el) => {
        console.log(`el`, el);
        const resData = await makeReq(`/employee/${el._id}/reviews`);
        console.log(`resData employeeRatings`, resData);
        return resData;
      });

      console.clear();
      employeeRatings = await Promise.all(employeeRatings);
      console.log(`employeeRatings`, employeeRatings);

      employeeRatings = employeeRatings.map((el) => el.reviews);
      employeeRatings = [].concat.apply([], employeeRatings);
      employeeRatings = employeeRatings.filter((el) => el.task === id);
      console.log(`employeeRatings`, employeeRatings);

      setTaskReviews(employeeRatings);
    })();
  }, [task]);

  const handleReview = (id) => {
    setCurrentEmployeeId(id);
    toggleAddReviewOpen();
  };
  const handleAddReview = (review, rating) => {
    addNewReview(currentEmployeeId, id, { review, rating });
    setCurrentEmployeeId(undefined);
    toggleAddReviewOpen();
  };

  return (
    <Page title="Dashboard | Task Manager App">
      <Container maxWidth="xl">
        <Grid container spacing={3} style={{ justifyContent: 'center' }}>
          <Grid item xs={12}>
            <Typography paddingBottom={5} variant="h3" textAlign="center">
              Task Details
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={6} style={{ padding: 15 }} className={classes.LeftNavItem}>
            <Box textAlign="center">
              <Typography variant="h4">Name</Typography>
              <Typography variant="h6">{task ? task.name : <Skeleton />}</Typography>
              <br />
              <Typography variant="h4">Description</Typography>
              <Typography variant="h6">{task ? task.description : <Skeleton />}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.RightNavItem}>
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              style={{ width: '100%' }}
            >
              <Label
                variant="ghost"
                color={task && task.status === 'complete' ? 'info' : 'warning'}
                style={{
                  alignSelf: 'end'
                }}
              >
                {task ? (
                  new Date(
                    task.status === 'complete' ? task.completionDate : task.deadLine
                  ).toDateString()
                ) : (
                  <Skeleton />
                )}
              </Label>
              <Label
                variant="ghost"
                color={`${task && task.status === 'complete' ? 'success' : 'warning'}`}
                style={{
                  alignSelf: 'end'
                }}
              >
                {task ? task.status : <Skeleton />}
              </Label>
            </Box>
            <Box>
              <Typography variant="h4">Manager</Typography>
              <Typography variant="h6">
                {task ? (
                  <>
                    {task.manager ? (
                      task.manager.name
                    ) : (
                      <Label variant="ghost" color="error">
                        Not Assigned
                      </Label>
                    )}
                  </>
                ) : (
                  <Skeleton />
                )}
              </Typography>
            </Box>
            {/* </Grid> */}
            {/* <Grid item md={4} sm={6} xs={12}> */}
            <br />
            <Box>
              <Typography variant="h4">Group</Typography>
              <Typography variant="h6">
                {task ? (
                  <>
                    {task.group ? (
                      task.group.name
                    ) : (
                      <Label variant="ghost" color="error">
                        Not Assigned
                      </Label>
                    )}
                  </>
                ) : (
                  <Skeleton />
                )}
              </Typography>
            </Box>
          </Grid>

          <Grid
            xs={12}
            style={{
              marginTop: 40
            }}
          >
            <Typography variant="h4" textAlign="center">
              Stages
            </Typography>

            {task && task.stages ? (
              <StagesAccordian stages={task.stages} taskId={id} />
            ) : (
              <Skeleton height={200} />
            )}
          </Grid>
        </Grid>
        <Grid container marginTop={5}>
          {task ? (
            <>
              <Grid item xs={12} sm={6} justifyContent="center">
                <Typography paddingBottom={5} variant="h4" textAlign="center">
                  Employees
                </Typography>
                <Grid container textAlign="center">
                  {task.group &&
                    task.group.employees &&
                    task.group.employees.map((el) => (
                      <Grid item xs={12} key={el._id}>
                        <Typography variant="h6">{el.name}</Typography>
                        <Typography variant="p">{el.email}</Typography>
                        {user &&
                          user.role !== 'Admin' &&
                          taskReviews &&
                          !!!taskReviews.find(
                            (item) => item.user._id === user._id && item.employee === el._id
                          ) && (
                            <Button
                              variant="outlined"
                              color="primary"
                              style={{
                                marginTop: 10,
                                marginLeft: 20
                              }}
                              startIcon={<RateReviewIcon color="primary" />}
                              onClick={() => handleReview(el._id)}
                            >
                              Review
                            </Button>
                          )}
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            </>
          ) : (
            <Skeleton />
          )}
        </Grid>

        <Grid container>
          <Grid item xs={12}>
            <Typography marginTop={5} paddingBottom={5} variant="h4" textAlign="center">
              Task Reviews
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" marginBottom={5}>
              Reviews
            </Typography>
            {taskReviews ? (
              taskReviews.map((el) => (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="space-around"
                  justifyContent="center"
                  marginBottom={5}
                >
                  <Typography variant="h5">{el.user.name}</Typography>
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-around"
                    width="fit-content"
                  >
                    <Rating
                      name="half-rating-read"
                      defaultValue={el.rating}
                      precision={0.5}
                      readOnly
                    />
                    <Label
                      variant="ghost"
                      color="info"
                      style={{
                        alignSelf: 'end'
                      }}
                    >
                      {new Date(el.created_At).toDateString()}
                    </Label>
                  </Box>
                  <Typography variant="p">{el.review}</Typography>
                </Box>
              ))
            ) : (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <Skeleton width={251} height={235} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Skeleton width={251} height={235} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Skeleton width={251} height={235} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Skeleton width={251} height={235} />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
      <AddReviewModal
        isOpen={isAddReviewOpen}
        closeDialog={toggleAddReviewOpen}
        addReview={handleAddReview}
      />
    </Page>
  );
};

export default withStyles(Styles)(ViewTask);
