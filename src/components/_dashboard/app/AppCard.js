import { Icon } from '@iconify/react';
import windowsFilled from '@iconify/icons-ant-design/windows-filled';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Card, Typography } from '@material-ui/core';
import { fShortenNumber } from 'utils/formatNumber';
// utils

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme, ownerState }) => {
  const { color } = ownerState;
  return {
    boxShadow: 'none',
    textAlign: 'center',
    padding: theme.spacing(5, 0),
    color: theme.palette?.[color].darker,
    backgroundColor: theme.palette?.[color].lighter
  };
});

const IconWrapperStyle = styled('div')(({ theme, ownerState }) => {
  const { color } = ownerState;
  console.log('color', color);
  return {
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    color: theme.palette?.[color].dark,
    backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette?.[color].dark, 0)} 0%, ${alpha(
      theme.palette?.[color].dark,
      0.24
    )} 100%)`
  };
});

// ----------------------------------------------------------------------

export default function AppItemOrders({ num = 0, title, icon, color }) {
  return (
    <RootStyle ownerState={{ color }}>
      <IconWrapperStyle ownerState={{ color }}>
        <Icon icon={icon} width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(num)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {title}
      </Typography>
    </RootStyle>
  );
}
