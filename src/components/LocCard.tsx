import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import styled from 'styled-components';

export interface LocCardProps {}
export interface LocCardState {}

const StyleCard = styled(Card)<any>`
  margin: 0.5em;
  margin-right: 0.25em;
`;

class LocCard extends React.Component<LocCardProps, LocCardState> {
  render() {
    return (
      <StyleCard>
        <CardHeader title="Location" />
        <CardMedia />
        <div>image goes here</div>
        <CardContent>
          <div>reqs</div>
        </CardContent>
      </StyleCard>
    );
  }
}

export default LocCard;
