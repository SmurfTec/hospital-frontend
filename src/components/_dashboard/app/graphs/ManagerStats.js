import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardHeader } from '@material-ui/core';
import Skeleton from 'react-loading-skeleton';

const ManagerStats = ({ managers }) => {
  const [state, setState] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 430
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top'
          }
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#fff']
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff']
      },
      tooltip: {
        shared: true,
        intersect: false
      },
      xaxis: {
        categories: ['TASKS', 'EMPLOYEES', 'GROUPS']
      }
    }
  });

  useEffect(() => {
    if (!managers) return;

    const graphSeries = managers
      .sort((a, b) => (a.employees.length > b.employees.length ? -1 : 1))
      .slice(0, 5)
      .map((manager) => ({
        name: manager.name,
        data: [manager.tasks.length, manager.employees.length, manager.groups.length]
      }));

    console.log(`graphSeries`, graphSeries);

    setState((st) => ({
      ...st,
      series: graphSeries
    }));
  }, [managers]);

  return (
    <Card>
      <CardHeader title="Managers Stats" />

      {state.series.length > 0 ? (
        <ReactApexChart options={state.options} series={state.series} type="bar" height={430} />
      ) : (
        <>
          <Skeleton height={100} />
          <Skeleton height={100} />
          <Skeleton height={100} />
        </>
      )}
    </Card>
  );
};

export default ManagerStats;
