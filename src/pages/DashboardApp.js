// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
import { AuthContext } from 'contexts/AuthContext';
import { DataContext } from 'contexts/DataContext';
import { useContext } from 'react';
// components
import Page from '../components/Page';
import { AppCard } from '../components/_dashboard/app';
import checkIcon from '@iconify/icons-ant-design/usergroup-add';
import publishedIcon from '@iconify/icons-ant-design/android-filled';
import archievedIcon from '@iconify/icons-ant-design/customer-service-filled';
import peopleFill from '@iconify/icons-eva/people-fill';
import clipboardFill from '@iconify/icons-eva/clipboard-fill';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const { user } = useContext(AuthContext);
  const { doctors, patients, appointments } = useContext(DataContext);
  return (
    <Page title="Dashboard | Task Manager App">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3} style={{ justifyContent: 'center' }}>
          {user && user.role === 'admin' && (
            <Grid item xs={12} sm={6} md={3}>
              <AppCard
                num={doctors?.length || 0}
                icon={peopleFill}
                title="Doctors"
                color="success"
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={3}>
            <AppCard
              num={patients?.length || 0}
              icon={peopleFill}
              title="Patients"
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppCard
              num={appointments?.length || 0}
              icon={clipboardFill}
              title="Appointments"
              color="secondary"
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
