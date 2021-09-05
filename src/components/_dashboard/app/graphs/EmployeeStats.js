import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardHeader } from '@material-ui/core';
import Skeleton from 'react-loading-skeleton';
import { makeReq } from 'utils/constants';

const EmployeesStats = ({ employees }) => {
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
        categories: ['RATINGS', 'TASKS']
      }
    }
  });

  useEffect(() => {
    if (!employees) return;

    (async () => {
      let employeesWithRatings = employees.map(async (employee) => {
        const resData = await makeReq(`/employee/${employee._id}/reviews`);
        return { resData, employee };
      });

      employeesWithRatings = await Promise.all(employeesWithRatings);
      employeesWithRatings = employeesWithRatings.map((el) => ({
        ...el.employee,
        avgRating: el.resData.avgRating
      }));

      console.log(`employeesWithRatings`, employeesWithRatings);

      let employeesWithTasks = employeesWithRatings.map(async (employee) => {
        const resData = await makeReq(`/employee/${employee._id}/tasks`);
        return { resData, employee };
      });

      employeesWithTasks = await Promise.all(employeesWithTasks);
      employeesWithTasks = employeesWithTasks.map((el) => ({
        ...el.employee,
        tasks: el.resData.tasks
      }));

      console.log(`employeesWithTasks`, employeesWithTasks);

      const graphSeries = employeesWithTasks
        .sort((a, b) => (a.tasks.length > b.tasks.length ? -1 : 1))
        .slice(0, 5)
        .map((emplpoyee) => ({
          name: emplpoyee.name,
          data: [emplpoyee.avgRating, emplpoyee.tasks.length * 1]
        }));

      console.log(`graphSeries`, graphSeries);

      setState((st) => ({
        ...st,
        series: graphSeries
      }));
    })();
  }, [employees]);

  return (
    <Card>
      <CardHeader title="Employee Stats" />

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

export default EmployeesStats;
