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
  const [currentGroup, setCurrentGroup] = useState();
  const { user } = useContext(AuthContext);
  const { groups } = useContext(DataContext);
  const { id } = useParams();

  useEffect(() => {
    if (!groups || groups === null) return;
    const tmp = groups.find((el) => el._id === id);
    setCurrentGroup(tmp);
    console.clear();
  }, [id, groups]);

  return (
    <Page title="Dashboard | Task Manager App">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4" style={{ width: 'fit-content', minWidth: 200 }}>
            Group
          </Typography>
          <br />
          <Typography variant="h5" style={{ width: 'fit-content', minWidth: 200 }}>
            {currentGroup ? currentGroup.name : <Skeleton />}
          </Typography>
        </Box>
        <Grid container spacing={3} style={{ justifyContent: 'space-around' }}>
          {currentGroup ? (
            <></>
          ) : (
            <>
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
