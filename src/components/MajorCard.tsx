import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import styled from 'styled-components';

export interface MajorCardProps {}
export interface MajorCardState {}

const StyleCard = styled(Card)<any>`
  margin: 0.5em 0.25em;
  overflow: visible !important;
`;

class MajorCard extends React.Component<MajorCardProps, MajorCardState> {
  render() {
    return (
      <StyleCard>
        <CardHeader title="Major" />
        <CardMedia />
        <div>image goes here</div>
        <CardContent>
          <div>reqs</div>
        </CardContent>
      </StyleCard>
    );
  }
}

export default MajorCard;
