import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import styled from 'styled-components';
import Plot from 'react-plotly.js';

import { CourseEnrollment } from '../../models/course.model';
import TextBlock from '../Pieces/TextBlock';

export interface EnrollCardProps {
  tracking: CourseEnrollment[];
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
          data={[
            {
              x: Object.keys(props.tracking),
              y: props.tracking.reduceRight((x: number[], val) => {
                return x.concat(val.enrolled);
              }, []),
              type: 'scatter',
              fill: 'tozeroy',
            },
          ]}
          style={{ width: '100%', height: '100%' }}
          layout={{
            showlegend: false,
            // 'yaxis.range': [0, props.tracking[0].capacity],
          }}
          config={{ displayModeBar: false }}
        />
      </div>
      <CardContent>
        <TextBlock text="Enrolled: " type={'h5'} />
        <TextBlock text="Waitlisted: " type={'h5'} />
      </CardContent>
    </StyleCard>
  );
};

export default EnrollCard;
