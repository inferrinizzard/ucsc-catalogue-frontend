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
      <CardMedia />
      <Divider />
      <CardContent>
        <Block>
          <Typography>Grade Average</Typography>
        </Block>
        <Block>
          <Typography>Unit count, course code</Typography>
          {/* <Typography>{props.courseData.credits+" "+props.courseData.number}}</Typography> */}
        </Block>
        <div />
        <Block>
          <Typography>Number Enrolled</Typography>
          {/* <Typography>{props.courseData.}</Typography> */}
        </Block>
        <Block>
          <Typography>Number Waitlist</Typography>
        </Block>
        <div />
        <Block>
          <Typography>Date and Time, class type</Typography>
          {/* <Typography>{props.courseData.day}</Typography> */}
        </Block>
        <Block>
          <Typography>Professor</Typography>
          {/* <Typography>{props.courseData.instructor.display}</Typography> */}
        </Block>
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
