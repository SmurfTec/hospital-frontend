import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import listFill from '@iconify/icons-eva/list-fill';
import logOutFill from '@iconify/icons-eva/log-out-fill';
import videoFill from '@iconify/icons-eva/video-fill';
import settingsFill from '@iconify/icons-eva/settings-2-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

export const adminConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Doctors',
    path: '/dashboard/doctors',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Patients',
    path: '/dashboard/Patients',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Appointments',
    path: '/dashboard/Appointments',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Invoices',
    path: '/dashboard/invoices',
    icon: getIcon(listFill)
  },
  // {
  //   title: 'User',
  //   path: '/dashboard/users',
  //   icon: getIcon(listFill)
  // },
  {
    title: 'Settings',
    path: '/dashboard/settings',
    icon: getIcon(settingsFill)
  },
  {
    title: 'logout',
    path: '/logout',
    icon: getIcon(logOutFill)
  }
];
export const patientConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Appointments',
    path: '/dashboard/Appointments',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Invoices',
    path: '/dashboard/invoices',
    icon: getIcon(listFill)
  },
  {
    title: 'Settings',
    path: '/dashboard/settings',
    icon: getIcon(settingsFill)
  },
  {
    title: 'logout',
    path: '/logout',
    icon: getIcon(logOutFill)
  }
];
export const doctorConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },

  {
    title: 'Patients',
    path: '/dashboard/patients',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Appointments',
    path: '/dashboard/appointments',
    icon: getIcon(peopleFill)
  },

  {
    title: 'Settings',
    path: '/dashboard/settings',
    icon: getIcon(settingsFill)
  },
  {
    title: 'logout',
    path: '/logout',
    icon: getIcon(logOutFill)
  }
];
