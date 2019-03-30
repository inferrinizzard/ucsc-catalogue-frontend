import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import styled from 'styled-components';

import Plotly from 'plotly.js-basic-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plot = createPlotlyComponent(Plotly);

import { CourseEnrollment } from '../../models/course.model';
import TextBlock from '../Pieces/TextBlock';

export interface EnrollCardProps {
  tracking: CourseEnrollment[];
  start: Date;
  quarter: number;
}

const StyleCard = styled(Card)<any>`
  margin: 0.5em;
  overflow: visible !important;
`;

const EnrollCard: React.SFC<EnrollCardProps> = props => {
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
        step.setUTCMilliseconds(cur.date.getTime());
        step.setDate(step.getDate() + 1);
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
  return (
    <StyleCard>
      <CardHeader title="Enrollment" />
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
            //   type: 'scatter',
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
              range:
                tracking.length > 0
                  ? [
                      0,
                      Math.max(
                        tracking[0].capacity,
                        tracking.reduce((max: number, val) => {
                          return max >
                            Math.max(
                              val.enrolled + val.waitlistTotal,
                              val.capacity
                            )
                            ? max
                            : Math.max(
                                val.enrolled + val.waitlistTotal,
                                val.capacity
                              );
                        }, tracking[0].capacity)
                      ),
                    ]
                  : undefined,
            },
            margin: { l: 25, r: 25, b: 50, t: 10 },
          }}
          config={{
            displayModeBar: false,
          }}
          useResizeHandler
        />
      </div>
      <Divider />
      <CardContent>
        <TextBlock
          text={
            'Enrolled: ' +
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
              : '')
          }
          type={'h5'}
        />
        <TextBlock
          text={
            'Waitlisted: ' +
            (tracking.length > 0
              ? tracking[0].waitlistTotal +
                '/' +
                tracking[0].waitlistCapacity +
                (tracking[0].waitlistCapacity != 0
                  ? ' - ' +
                    (
                      (tracking[0].waitlistTotal /
                        tracking[0].waitlistCapacity) *
                      100
                    ).toFixed(0) +
                    '%'
                  : '')
              : '')
          }
          type={'h5'}
        />
      </CardContent>
    </StyleCard>
  );
};

export default EnrollCard;
