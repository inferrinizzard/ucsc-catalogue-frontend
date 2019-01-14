import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import styled from 'styled-components';

import TextBlock from './TextBlock';

export interface EnrollCardProps {
  // enrollData: {
  // 	enrolled: number;
  // 	capacity: number;
  // 	waitlist: number;
  // 	waitlistCap: number;
  // 	history: object;
  // }
}

const StyleCard = styled(Card)<any>`
  margin: 0.5em;
`;

const EnrollCard: React.SFC<EnrollCardProps> = () => {
  return (
    <StyleCard>
      <CardHeader title="Enrollment" />
      <CardMedia />
      <div>graph goes here</div>
      <CardContent>
        <TextBlock text="Enrolled: " type={'h5'} />
        <TextBlock text="Waitlisted: " type={'h5'} />
      </CardContent>
    </StyleCard>
  );
};

export default EnrollCard;
