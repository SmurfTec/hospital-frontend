// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
import { AuthContext } from 'contexts/AuthContext';
import { DataContext } from 'contexts/DataContext';
import { useContext } from 'react';
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

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const { user } = useContext(AuthContext);
  const { employs, managers, tasks, groups } = useContext(DataContext);
  return (
    <Page title="Dashboard | Task Manager App">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3} style={{ justifyContent: 'center' }}>
          {user && user.role === 'Admin' && (
            <Grid item xs={12} sm={6} md={3}>
              <AppManagers data={managers} />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={3}>
            <AppEmploys data={employs} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppTasks data={tasks} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppGroups data={groups} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentTasks />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTodos />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
