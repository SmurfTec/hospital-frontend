import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Card, CardHeader, Typography } from '@material-ui/core';
// utils
import { fNumber } from 'utils/formatNumber';
//
import { BaseOptionChart } from 'components/charts';
import { useContext, useState, useEffect } from 'react';
import { DataContext } from 'contexts/DataContext';
import Skeleton from 'react-loading-skeleton';
import { AuthContext } from 'contexts/AuthContext';
// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

// ----------------------------------------------------------------------

// const chartData = [4344, 5435, 1443, 4443];

const TasksGraph = () => {
  const theme = useTheme();
  const { tasks } = useContext(DataContext);
  const { user } = useContext(AuthContext);
  const [chartData, setChartDate] = useState([]);

  useEffect(() => {
    if (!tasks) return;
    // * Calculate tasks length
    const unAssignedTasks = tasks.filter((task) => !task.manager);
    const notStartedTasks = tasks.filter((task) => !task.group);
    const inProgressTasks = tasks.filter(
      (task) => task.manager && task.group && task.status === 'inProgress'
    );
    const completedTasks = tasks.filter((task) => task.status === 'complete');

    console.log(`unAssignedTasks`, unAssignedTasks);
    console.log(`notStartedTasks`, notStartedTasks);
    console.log(`inProgressTasks`, inProgressTasks);
    console.log(`completedTasks`, completedTasks);

    switch (user.role) {
      case 'Admin':
        setChartDate([
          completedTasks.length,
          inProgressTasks.length,
          notStartedTasks.length,
          unAssignedTasks.length
        ]);
        break;

      case 'Manager':
        setChartDate([completedTasks.length, inProgressTasks.length, notStartedTasks.length]);
        break;

      default:
        setChartDate([completedTasks.length, inProgressTasks.length]);
        break;
    }
  }, [tasks]);

  const base_colors = [theme.palette.primary.main, theme.palette.info.main];

  const base_labels = ['Completed', 'In Progress'];

  const chartOptions = merge(BaseOptionChart(), {
    colors:
      user.role === 'Admin'
        ? [...base_colors, theme.palette.error.main, theme.palette.warning.main]
        : user.role === 'Manager'
        ? [...base_colors, theme.palette.warning.main]
        : base_colors,
    labels:
      user.role === 'Admin'
        ? [...base_labels, 'Not Started', 'Not Assigned']
        : user.role === 'Manager'
        ? [...base_labels, 'Not Started']
        : base_labels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  });

  return (
    <Card style={{ height: 497 }}>
      <CardHeader title="Current Tasks" />
      {chartData ? (
        !!chartData.some((item) => item !== 0) ? (
          <ChartWrapperStyle dir="ltr">
            <ReactApexChart type="pie" series={chartData} options={chartOptions} height={280} />
          </ChartWrapperStyle>
        ) : (
          <Typography
            variant="h5"
            color="textSecondary"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            No Tasks to Show Graph
          </Typography>
        )
      ) : (
        <Skeleton height={200} />
      )}
    </Card>
  );
};

export default TasksGraph;
