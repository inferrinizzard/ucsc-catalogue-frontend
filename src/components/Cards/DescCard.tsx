import * as React from 'react';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';

import TextBlock from '../TextBlock';
import { Course } from '../../models/course.model';

const StyleCard = styled(Card)<any>`
  margin: 0.5em;
  overflow: visible !important;
`;

export interface DescCardProps {
  courseData: Course | null;
}

const DescCard: React.SFC<DescCardProps> = props => {
  return (
    <StyleCard>
      {props.courseData && (
        <CardHeader
          title={props.courseData.subject + ' ' + props.courseData.code}
          subheader={props.courseData.name}
        />
      )}
      {/* <CardMedia /> */}
      <Divider />'
      {props.courseData && (
        <CardContent>
          <TextBlock type="body2" text={'Grade Average'} />
          {/* <TextBlock type="body2" text={'Unit count, course code'} /> */}
          <TextBlock
            type="body2"
            text={
              'Credits: ' +
              props.courseData.credit +
              ' Course Number:' +
              props.courseData.number
            }
          />
          <div />
          <TextBlock type="body2" text={'Number Enrolled'} />
          {/* <TextBlock type="body2" text={props.courseData.} /> */}
          <TextBlock type="body2" text={'Number Waitlist'} />
          <div />
          <TextBlock type="body2" text={'Date and Time, class type'} />
          {/* <TextBlock type="body2" text={props.courseData.day} /> */}
          <TextBlock
            type="body2"
            text={
              props.courseData.instructor
                ? props.courseData.instructor.first +
                  ' ' +
                  props.courseData.instructor.middle
                  ? props.courseData.instructor.middle + ' '
                  : '' + props.courseData.instructor.last
                : 'STAFF'
            }
          />
          <Divider />
          <div>
            <Typography>Description: {props.courseData.description}</Typography>
            <Typography>Prereqs: {props.courseData.prerequirements}</Typography>
          </div>
        </CardContent>
      )}
    </StyleCard>
  );
};

export default DescCard;
