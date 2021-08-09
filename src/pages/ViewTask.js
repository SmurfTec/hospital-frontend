// material
import { Box, Grid, Container, Typography, Button } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { AuthContext } from 'contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import RateReviewIcon from '@material-ui/icons/RateReview';
import StagesAccordian from './StagesAccordian';
// components
import Page from '../components/Page';
import {
  AppTodos,
  AppEmploys,
  AppGroups,
  AppTasks,
  AppNewsUpdate,
  AppManagers,
  AppOrderTimeline,
  AppCurrentTasks,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../components/_dashboard/app';
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
      console.clear();
      console.log(`resData`, resData);
      setTask(resData.task);
    })();
    (async () => {
      const resData = await makeReq(`/task/getTaskReviews/${id}`);
      console.clear();
      console.log(`resData`, resData);
      setTaskReviews(resData.reviews);
    })();
  }, [id]);

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
                color={`${task && task.status === 'complete' ? 'success' : 'error'}`}
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
                    task.group.employees.map((employee) => (
                      <Grid item xs={12} sm={6} key={employee._id}>
                        <Typography variant="h6">{employee.name}</Typography>
                        <Typography variant="p">{employee.email}</Typography>
                        {user &&
                          user.role !== 'Admin' &&
                          taskReviews &&
                          !taskReviews.find((item) => item._id._id === employee._id) && (
                            <Button
                              variant="outlined"
                              color="primary"
                              style={{
                                marginTop: 10
                              }}
                              startIcon={<RateReviewIcon color="primary" />}
                              onClick={() => handleReview(employee._id)}
                            >
                              Review
                            </Button>
                          )}
                      </Grid>
                    ))}
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6} justifyContent="center">
                <Typography paddingBottom={5} variant="h4" textAlign="center">
                  Manager
                </Typography>
                <Grid container justifyContent="center">
                  <Grid item xs={12} sm={6} key={task.manager._id}>
                    <Typography variant="h6">{task.manager.name}</Typography>
                    <Typography variant="p">{task.manager.email}</Typography>
                  </Grid>
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
          {taskReviews
            ? taskReviews.map((review, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <Typography variant="h5">{review._id.name}</Typography>
                  <Box component="fieldset" mb={3} borderColor="transparent">
                    <Typography component="legend">Average Rating</Typography>
                    <Rating
                      name="half-rating-read"
                      defaultValue={review.avgRating}
                      precision={0.5}
                      readOnly
                    />
                  </Box>
                  <Box component="fieldset" mb={3} borderColor="transparent">
                    <Typography component="legend">Minimum Rating</Typography>
                    <Rating
                      name="half-rating-read"
                      defaultValue={review.minRating}
                      precision={0.5}
                      readOnly
                    />
                  </Box>
                  <Box component="fieldset" mb={3} borderColor="transparent">
                    <Typography component="legend">Maximum Rating</Typography>
                    <Rating
                      name="half-rating-read"
                      defaultValue={review.maxRating}
                      precision={0.5}
                      readOnly
                    />
                  </Box>
                  <Box component="fieldset" mb={3} borderColor="transparent">
                    <Typography component="legend">Total Ratings</Typography>
                    <Typography component="legend">{review.totalRating}</Typography>
                  </Box>
                  <Box component="fieldset" mb={3} borderColor="transparent">
                    <Typography component="legend">Total Reviews</Typography>
                    <Typography component="legend">{review.totalReviews}</Typography>
                  </Box>
                </Grid>
              ))
            : [1, 2].map((el) => (
                <Grid item xs={12} sm={6}>
                  <Typography variant="h5">
                    <Skeleton />
                  </Typography>
                  <Box component="fieldset" mb={3} borderColor="transparent">
                    <Typography component="legend">
                      <Skeleton />
                    </Typography>
                    <Skeleton />
                  </Box>
                  <Box component="fieldset" mb={3} borderColor="transparent">
                    <Typography component="legend">
                      <Skeleton />
                    </Typography>
                    <Skeleton />
                  </Box>
                  <Box component="fieldset" mb={3} borderColor="transparent">
                    <Typography component="legend">
                      <Skeleton />
                    </Typography>
                    <Skeleton />
                  </Box>
                  <Box component="fieldset" mb={3} borderColor="transparent">
                    <Typography component="legend">
                      <Skeleton />
                    </Typography>
                    <Typography component="legend">
                      <Skeleton />
                    </Typography>
                  </Box>
                  <Box component="fieldset" mb={3} borderColor="transparent">
                    <Typography component="legend">
                      <Skeleton />
                    </Typography>
                    <Typography component="legend">
                      <Skeleton />
                    </Typography>
                  </Box>
                </Grid>
              ))}
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
