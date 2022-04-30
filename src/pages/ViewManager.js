// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
import { AuthContext } from 'contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// components
import Page from '../components/Page';
import Skeleton from 'react-loading-skeleton';
import { DataContext } from 'contexts/DataContext';

// ----------------------------------------------------------------------

export default function ViewManager() {
  const [currentManager, setCurrentManager] = useState();
  const { user } = useContext(AuthContext);
  const { managers } = useContext(DataContext);
  const { id } = useParams();

  useEffect(() => {
    if (!managers || managers === null) return;
    const tmp = managers.find((el) => el._id === id);
    setCurrentManager(tmp);
    console.clear();
  }, [id, managers]);

  return (
    <Page title="Dashboard | Task Manager App">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4" style={{ width: 'fit-content', minWidth: 200 }}>
            Manager
          </Typography>
          <br />
          <Typography variant="h5" style={{ width: 'fit-content', minWidth: 200 }}>
            {currentManager ? currentManager.name : <Skeleton />}
          </Typography>
          <Typography variant="h6" style={{ width: 'fit-content', minWidth: 180, color: '#ccc' }}>
            {currentManager ? currentManager.email : <Skeleton />}
          </Typography>
        </Box>
        <Grid container spacing={3} style={{ justifyContent: 'space-around' }}>
          {currentManager ? (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <AppTasks data={currentManager.tasks} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AppGroups data={currentManager.groups} />
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
}
