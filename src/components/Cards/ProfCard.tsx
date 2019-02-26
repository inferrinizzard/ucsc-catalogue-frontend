import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import styled from 'styled-components';

export interface ProfCardProps {}
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
        {/* <CardMedia /> */}
        <div style={{ textAlign: 'center', fontFamily: 'Roboto' }}>
          Work in progress, to be implemented soon!
        </div>
        {/* <CardContent>
          <div>name</div>
        </CardContent> */}
      </StyleCard>
    );
  }
}

export default ProfCard;
