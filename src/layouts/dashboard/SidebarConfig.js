import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import listFill from '@iconify/icons-eva/list-fill';
import logOutFill from '@iconify/icons-eva/log-out-fill';
import videoFill from '@iconify/icons-eva/video-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

export const adminConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Managers',
    path: '/dashboard/managers',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Employees',
    path: '/dashboard/employees',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Groups',
    path: '/dashboard/groups',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Tasks',
    path: '/dashboard/tasks',
    icon: getIcon(listFill)
  },
  // {
  //   title: 'User',
  //   path: '/dashboard/users',
  //   icon: getIcon(listFill)
  // },
  {
    title: 'logout',
    path: '/logout',
    icon: getIcon(logOutFill)
  }
];
export const managerConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },

  {
    title: 'Employees',
    path: '/dashboard/employees',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Groups',
    path: '/dashboard/groups',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Tasks',
    path: '/dashboard/tasks',
    icon: getIcon(listFill)
  },
  {
    title: 'Meetings',
    path: '/dashboard/meetings',
    icon: getIcon(videoFill)
  },
  {
    title: 'logout',
    path: '/logout',
    icon: getIcon(logOutFill)
  }
];
export const employeeConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },

  {
    title: 'Employees',
    path: '/dashboard/employees',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Groups',
    path: '/dashboard/groups',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Tasks',
    path: '/dashboard/tasks',
    icon: getIcon(listFill)
  },

  {
    title: 'logout',
    path: '/logout',
    icon: getIcon(logOutFill)
  }
];
