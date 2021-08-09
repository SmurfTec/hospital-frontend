// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
import { AuthContext } from 'contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// components
import Page from '../components/Page';
import { AppEmploys, AppGroups, AppTasks, AppManagers } from '../components/_dashboard/app';
import Skeleton from 'react-loading-skeleton';
import { DataContext } from 'contexts/DataContext';
import { makeReq } from 'utils/constants';

// ----------------------------------------------------------------------

export default function ViewManager() {
  const [currentEmployee, setCurrentEmployee] = useState();
  const { user } = useContext(AuthContext);
  const { employs } = useContext(DataContext);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const resData = await makeReq(`/employee/${id}`);
      setCurrentEmployee(resData.employee);
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
            {currentEmployee ? currentEmployee.name : <Skeleton />}
          </Typography>
          <Typography variant="h6" style={{ width: 'fit-content', minWidth: 180, color: '#ccc' }}>
            {currentEmployee ? currentEmployee.email : <Skeleton />}
          </Typography>
        </Box>
        <Grid container spacing={3} style={{ justifyContent: 'space-around' }}>
          {currentEmployee ? (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <AppEmploys data={currentEmployee.employees} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AppTasks data={currentEmployee.tasks} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AppGroups data={currentEmployee.groups} />
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
            </>
          )}
        </Grid>
      </Container>
    </Page>
  );
}
