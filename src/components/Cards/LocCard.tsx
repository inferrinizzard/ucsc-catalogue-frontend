import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

export interface LocCardProps {
  location: string;
}
export interface LocCardState {}

const StyleCard = styled(Card)<any>`
  margin: 0.5em;
  margin-left: 0.25em;
  overflow: visible !important;
`;

class LocCard extends React.Component<LocCardProps, LocCardState> {
  render() {
    return (
      <StyleCard>
        <CardHeader title="Location" />
        {/* <CardMedia /> */}
        {/* <div>image goes here</div> */}
        <CardContent>
          <Typography>{'Location: ' + this.props.location}</Typography>
          <div>Google Maps this</div>
        </CardContent>
      </StyleCard>
    );
  }
}

export default LocCard;
