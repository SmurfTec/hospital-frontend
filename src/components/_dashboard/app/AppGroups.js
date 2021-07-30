import { Icon } from '@iconify/react';
import bugFilled from '@iconify/icons-ant-design/bug-filled';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
import { useContext } from 'react';
import { DataContext } from 'contexts/DataContext';
import Loader from 'react-loader-spinner';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.error.darker,
  backgroundColor: theme.palette.error.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.error.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0)} 0%, ${alpha(
    theme.palette.error.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

export default function AppBugReports() {
  const { groups } = useContext(DataContext);
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Icon icon={bugFilled} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">
        {groups ? (
          fShortenNumber(groups.length)
        ) : (
          <Loader
            type="Oval"
            color="#00BFFF"
            height={40}
            width={40}
            timeout={3000} // 3 secs
          />
        )}
      </Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Groups
      </Typography>
    </RootStyle>
  );
}
