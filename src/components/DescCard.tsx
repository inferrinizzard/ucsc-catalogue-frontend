import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import styled from 'styled-components';

import TextBlock from './TextBlock';

const StyleCard = styled(Card)<any>`
  margin: 0.5em;
  overflow: visible !important;
`;

export interface DescCardProps {
  // courseData: {
  //   code: string;
  //   section: string;
  //   name: string;
  //   number: number;
  //   capacity: number | null;
  //   // instructor: Instructor | null;
  // 	subject: string;
  // 	description: string;
  //   day: string[];
  //   time: {
  //     start: string;
  //     end: string;
  //   };
  //   location: string;
  //   grade: string;
  //   type: string;
  //   credits: number;
  //   ge: string;
  // };
}

const DescCard: React.SFC<DescCardProps> = props => {
  return (
    <StyleCard>
      {/* <CardHeader title={props.courseData.subject+" "+props.courseData.code} subheader={this.props.courseData.name} /> */}
      <CardHeader title="AMS 5" subheader="Statistics" />
      {/* <CardMedia /> */}
      <Divider />
      <CardContent>
        <TextBlock type="body2" text={'Grade Average'} />
        <TextBlock type="body2" text={'Unit count, course code'} />
        {/* <TextBlock type="body2" text={props.courseData.credits+" "+props.courseData.number} /> */}
        <div />
        <TextBlock type="body2" text={'Number Enrolled'} />
        {/* <TextBlock type="body2" text={props.courseData.} /> */}
        <TextBlock type="body2" text={'Number Waitlist'} />
        <div />
        <TextBlock type="body2" text={'Date and Time, class type'} />
        {/* <TextBlock type="body2" text={props.courseData.day} /> */}
        <TextBlock type="body2" text={'Professor'} />
        {/* <TextBlock type="body2" text={props.courseData.instructor.display} /> */}
        <Divider />
        <div>
          <Typography>Description: {'{}'}</Typography>
          {/* <Typography>Description: {props.courseData.description}</Typography> */}
          <Typography>Prereqs: {'{}'}</Typography>
          {/* <Typography>Prereqs: {props.courseData.prereq}</Typography> */}
        </div>
      </CardContent>
    </StyleCard>
  );
};

export default DescCard;
