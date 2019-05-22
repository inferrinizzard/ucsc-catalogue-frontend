import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

import { CourseEnrollment } from '../../models/course.model';

export interface EnrollCardProps {
  tracking: CourseEnrollment[];
  prevStart: Date;
  quarter: number;
}

const TextBlock = styled(Typography)<any>`
  display: inline-block !important;
  width: 50%;
`;

const EnrollCard: React.SFC<EnrollCardProps> = props => {
  if (props.tracking.length <= 0) {
    return (
      <React.Fragment>
        <CardHeader
          title={
            'Tracking Data' +
            (!props.quarter.toString().endsWith('4') ? ' not yet ' : ' Un') +
            'available for this term'
          }
        />
      </React.Fragment>
    );
  }
  const tracking = props.tracking.reduce(
    (data, cur) => {
      let temp = new Date(0);
      temp.setUTCMilliseconds(cur.date.getTime());
      temp.setDate(temp.getDate() + 1);
      const next = data[data.length - 1];
      if (
        data.length < 1 ||
        next.date.getDate() === cur.date.getDate() ||
        next.date.getDate() === temp.getDate()
      )
        return data.concat([cur]);
      else {
        let dates = [] as CourseEnrollment[];
        let step = new Date(0);
        step.setUTCMilliseconds(temp.getTime());
        while (step.getDate() != next.date.getDate()) {
          const d = new Date(0);
          d.setUTCMilliseconds(step.getTime());
          dates.unshift({ ...next, date: d });
          step.setDate(step.getDate() + 1);
        }
        return data.concat([...dates, cur]);
      }
    },
    [] as CourseEnrollment[]
  );
  const dates = tracking.reduceRight((x: string[], val) => {
    return x.concat(val.date.toDateString().substr(4));
  }, []);
  const maxHeight =
    tracking.length > 0
      ? Math.max(
          tracking[0].capacity,
          tracking.reduce((max: number, val) => {
            return max >
              Math.max(val.enrolled + val.waitlistTotal, val.capacity)
              ? max
              : Math.max(val.enrolled + val.waitlistTotal, val.capacity);
          }, tracking[0].capacity)
        )
      : 0;

  let firstPass = new Date(0);
  firstPass.setUTCMilliseconds(props.prevStart.getTime());
  firstPass.setDate(
    props.prevStart.getDate() + (props.prevStart.getMonth() === 8 ? 49 : 50)
  );
  let secondPass = new Date(0);
  secondPass.setUTCMilliseconds(firstPass.getTime());
  secondPass.setDate(secondPass.getDate() + 8);

  return (
    <React.Fragment>
      <div style={{ marginBottom: '5px' }}>
        <Plot
          //dates:
          //enrollment for fall is 51 days after start of previous spring
          //enrollment for spring is 51 days after winter
          //enrollment for winter is 53 days after fall
          //second pass 8 days after
          data={[
            {
              x: dates,
              y: tracking.reduceRight((x: number[], val) => {
                return x.concat(val.enrolled);
              }, []),
              type: 'scatter',
              fill: 'tozeroy',
              name: 'Enrolled',
            },
            {
              x: dates,
              y: tracking.reduceRight((x: number[], val) => {
                return x.concat(val.enrolled + val.waitlistTotal);
              }, []),
              type: 'scatter',
              fill: 'tonexty',
              name: 'Waitlisted',
              hoverinfo: 'x+text+name' as 'x+text', //requires 'x+text+name' type in @types/plotly.js/index.d.ts
              text: tracking.reduceRight((x: string[], val) => {
                return x.concat(val.waitlistTotal.toString());
              }, []),
              line: { color: 'rgb(44, 160, 44)' },
            },
            {
              x: dates,
              y: tracking.reduceRight((x: number[], val) => {
                return x.concat(val.capacity);
              }, []),
              type: 'scatter',
              name: 'Capacity',
              hoverlabel: { bordercolor: '#FFF' },
              line: { color: 'rgb(255, 127, 14)' },
            },
            // {
            //   x: [
            //     props.start.toDateString().substr(4),
            //     new Date(props.start.getDate() + 51).toDateString().substr(4),
            //   ],
            //   y: [0, 0],
            //   type: 'line',
            //   hoverinfo: 'skip',
            //   // type: 'rect',
            // },
          ]}
          style={{ width: 'calc(100% - 20px)', height: '100%' }}
          layout={{
            fixedrange: true,
            showlegend: false,
            xaxis: {
              fixedrange: true,
              hoverformat: '',
              // tickangle: 45
            },
            yaxis: {
              fixedrange: true,
              range: tracking.length > 0 ? [0, maxHeight] : undefined,
            },
            annotations: [
              ...(tracking[0].date.getTime() > firstPass.getTime()
                ? [
                    {
                      x: ((firstPass: Date) => {
                        let d = new Date(0);
                        d.setUTCMilliseconds(firstPass.getTime());
                        d.setDate(firstPass.getDate() + 1);
                        return d;
                      })
                        .call(firstPass, firstPass)
                        .toDateString()
                        .substr(4),
                      y: maxHeight * 0.9,
                      text: 'First Pass',
                      textangle: 90,
                      showarrow: false,
                    },
                  ]
                : []),
              ...(tracking[0].date.getTime() > secondPass.getTime()
                ? [
                    {
                      x: ((secondPass: Date) => {
                        let d = new Date(0);
                        d.setUTCMilliseconds(secondPass.getTime());
                        d.setDate(secondPass.getDate() + 1);
                        return d;
                      })
                        .call(secondPass, secondPass)
                        .toDateString()
                        .substr(4),
                      y: maxHeight * 0.9,
                      text: 'Second Pass',
                      textangle: 90,
                      showarrow: false,
                    },
                  ]
                : []),
            ],
            margin: { l: 25, r: 25, b: 50, t: 10 },
            shapes: [
              ...(tracking[0].date.getTime() > firstPass.getTime()
                ? [
                    {
                      type: 'line',
                      x0: firstPass.toDateString().substr(4),
                      y0: 0,
                      x1: firstPass.toDateString().substr(4),
                      y1: maxHeight,
                      line: {
                        hoverlabel: 'First Pass',
                      },
                    },
                  ]
                : []),
              ...(tracking[0].date.getTime() > secondPass.getTime()
                ? [
                    {
                      type: 'line',
                      x0: secondPass.toDateString().substr(4),
                      y0: 0,
                      x1: secondPass.toDateString().substr(4),
                      y1: maxHeight,
                      line: {
                        hoverlabel: 'Second Pass',
                      },
                    },
                  ]
                : []),
            ],
          }}
          config={{
            displayModeBar: false,
          }}
          useResizeHandler
        />
      </div>
      <Divider />
      <CardContent>
        <TextBlock variant={'h5'}>
          {'Enrolled: ' +
            (tracking.length > 0
              ? tracking[0].enrolled +
                '/' +
                tracking[0].capacity +
                (tracking[0].capacity != 0
                  ? ' - ' +
                    (
                      (tracking[0].enrolled / tracking[0].capacity) *
                      100
                    ).toFixed(0) +
                    '%'
                  : '')
              : '')}
        </TextBlock>
        <TextBlock variant={'h5'}>
          {'Waitlisted: ' +
            (tracking.length > 0
              ? tracking[0].waitlistTotal +
                '/' +
                tracking[0].capacity +
                (tracking[0].capacity != 0
                  ? ' - ' +
                    (
                      (tracking[0].waitlistTotal / tracking[0].capacity) *
                      100
                    ).toFixed(0) +
                    '% Over'
                  : '')
              : '')}
        </TextBlock>
      </CardContent>
    </React.Fragment>
  );
};

export default EnrollCard;
