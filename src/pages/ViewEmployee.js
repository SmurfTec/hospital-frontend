// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
import { AuthContext } from 'contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// components
import Page from '../components/Page';
import Skeleton from 'react-loading-skeleton';
import { DataContext } from 'contexts/DataContext';
import { makeReq } from 'utils/constants';
import Rating from '@material-ui/lab/Rating';
import Label from 'components/Label';
import { Email } from '@material-ui/icons';

// ----------------------------------------------------------------------

const ViewEmployee = () => {
  const [currentEmployee, setCurrentEmployee] = useState();
  const { user } = useContext(AuthContext);
  const { employs } = useContext(DataContext);
  const { id } = useParams();
  const [reviews, setReviews] = useState();

  useEffect(() => {
    (async () => {
      const resData = await makeReq(`/employee/${id}`);
      setCurrentEmployee(resData.employee);
    })();
    (async () => {
      const resData = await makeReq(`/employee/${id}/reviews`);
      setReviews(resData.reviews);
    })();
  }, [id, employs]);

  return (
    <Page title="Dashboard | Task Manager App">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4" style={{ width: 'fit-content', minWidth: 200 }}>
            Employee
          </Typography>
          <br />
          <Typography variant="h5" style={{ width: 'fit-content', minWidth: 200 }}>
            Name : {currentEmployee ? currentEmployee.name : <Skeleton />}
          </Typography>
          <Typography
            variant="h6"
            style={{
              width: 'fit-content',
              minWidth: 180,
              color: '#ccc',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Email
              style={{
                marginRight: 13
              }}
            />{' '}
            {currentEmployee ? currentEmployee.email : <Skeleton />}
          </Typography>
          <Typography variant="h4" style={{ width: 'fit-content', minWidth: 200 }}>
            Managed By : {currentEmployee ? currentEmployee.manager.name : <Skeleton />}
          </Typography>
        </Box>
        <Grid container spacing={3} style={{ justifyContent: 'space-around' }}>
          {currentEmployee ? (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <AppTasks data={currentEmployee.group ? currentEmployee.group.tasks : []} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AppGroups data={currentEmployee.group ? currentEmployee.group.name : []} />
              </Grid>

              <Grid item xs={12}>
                {reviews && (
                  <>
                    <Typography variant="h4" marginBottom={5}>
                      Reviews
                    </Typography>
                    {reviews && reviews.length === 0 && (
                      <Typography variant="h5" fontWeight="normal">
                        This Employee has No Reviews Yet !
                      </Typography>
                    )}

                    {reviews.map((el) => (
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
                    ))}
                  </>
                )}
              </Grid>
            </>
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
      </Container>
    </Page>
  );
};
export default ViewEmployee;
