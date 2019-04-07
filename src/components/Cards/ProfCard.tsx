import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import styled from 'styled-components';

import { professorRating } from '../../models/course.model';
import { Typography } from '@material-ui/core';

export interface ProfCardProps {
  rmp: professorRating;
}
export interface ProfCardState {}

const StyleCard = styled(Card)<any>`
  margin: 0.5em;
  margin-right: 0.25em;
  overflow: visible !important;
`;

class ProfCard extends React.Component<ProfCardProps, ProfCardState> {
  render() {
    return (
      <StyleCard>
        <CardHeader title="Professor" />
        <CardContent>
          <Typography>{'Difficulty'}</Typography>
          <div>{this.props.rmp.difficulty}</div>
          <Typography>{'Clarity'}</Typography>
          <div>{this.props.rmp.clarity}</div>
          <Typography>{'Overall'}</Typography>
          <div>{this.props.rmp.overall}</div>
        </CardContent>
      </StyleCard>
    );
  }
}

export default ProfCard;
