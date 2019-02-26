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
  return (
    <StyleCard>
      <CardHeader title="Enrollment" />
      <div>
        <Plot
          //dates:
          //enrollment for fall is 51 days after start of previous spring
          //enrollment for spring is 51 days after winter
          //enrollment for winter is 53 days after fall
          //second pass 8 days after
          data={[
            {
              x: props.tracking.reduceRight((x: string[], val) => {
                return x.concat(val.date.substr(4));
              }, []),
              y: props.tracking.reduceRight((x: number[], val) => {
                return x.concat(val.enrolled);
              }, []),
              type: 'scatter',
              fill: 'tozeroy',
              name: 'Enrolled',
            },
            {
              x: props.tracking.reduceRight((x: string[], val) => {
                return x.concat(val.date.substr(4));
              }, []),
              y: props.tracking.reduceRight((x: number[], val) => {
                return x.concat(val.enrolled + val.waitlistTotal);
              }, []),
              type: 'scatter',
              fill: 'tonexty',
              name: 'Waitlisted',
              hoverinfo: 'x+text+name' as 'x+text', //requires 'x+text+name' type in @types/plotly.js/index.d.ts
              text: props.tracking.reduceRight((x: string[], val) => {
                return x.concat(val.waitlistTotal.toString());
              }, []),
              line: { color: 'rgb(44, 160, 44)' },
            },
            {
              x: props.tracking.reduceRight((x: string[], val) => {
                return x.concat(val.date.substr(4));
              }, []),
              y: props.tracking.reduceRight((x: number[], val) => {
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
                props.tracking.length > 0
                  ? [
                      0,
                      Math.max(
                        props.tracking[0].capacity,
                        props.tracking.reduce((max: number, val) => {
                          return max > val.enrolled + val.waitlistTotal
                            ? max
                            : val.enrolled + val.waitlistTotal;
                        }, 0)
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
      <CardContent>
        <TextBlock
          text={
            'Enrolled: ' +
            (props.tracking.length > 0
              ? props.tracking[0].enrolled +
                '/' +
                props.tracking[0].capacity +
                (props.tracking[0].capacity != 0
                  ? ' - ' +
                    (
                      (props.tracking[0].enrolled /
                        props.tracking[0].capacity) *
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
            (props.tracking.length > 0
              ? props.tracking[0].waitlistTotal +
                '/' +
                props.tracking[0].waitlistCapacity +
                (props.tracking[0].waitlistCapacity != 0
                  ? ' - ' +
                    (
                      (props.tracking[0].waitlistTotal /
                        props.tracking[0].waitlistCapacity) *
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
