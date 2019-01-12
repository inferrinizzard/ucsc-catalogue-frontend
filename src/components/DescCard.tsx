import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import styled from 'styled-components';

const StyleCard = styled(Card)<any>`
  margin: 0.5em;
`;
const Block = styled.div`
  display: inline-block;
  width: 50%;
`;

export interface DescCardProps {}
export interface DescCardState {}

class DescCard extends React.Component<DescCardProps, DescCardState> {
  render() {
    return (
      <StyleCard>
        <CardHeader title="AMS 5" subheader="Statistics" />
        <CardMedia />
        <Divider />
        <CardContent>
          <Block>
            <Typography>Grade Average</Typography>
          </Block>
          <Block>
            <Typography>Unit count, course code</Typography>
          </Block>
          <div />
          <Block>
            <Typography>Number Enrolled</Typography>
          </Block>
          <Block>
            <Typography>Number Waitlist</Typography>
          </Block>
          <div />
          <Block>
            <Typography>Date and Time, class type</Typography>
          </Block>
          <Block>
            <Typography>Professor</Typography>
          </Block>
          <Divider />
          <div>
            <Typography>Description: {'{}'}</Typography>
            <Typography>Prereqs: {'{}'}</Typography>
          </div>
        </CardContent>
      </StyleCard>
    );
  }
}

export default DescCard;
