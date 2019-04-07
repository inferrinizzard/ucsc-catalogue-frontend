import * as React from 'react';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import KeyboardArrowDownRounded from '@material-ui/icons/KeyboardArrowDownRounded';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import TextBlock from '../Pieces/TextBlock';
import { Course, CourseEnrollment } from '../../models/course.model';

const StyleCard = styled(Card)<any>`
  margin: 0.5em;
  overflow: visible !important;
`;

export interface DescCardProps {
  courseData: Course | null;
  tracking: CourseEnrollment;
}

const DescCard: React.SFC<DescCardProps> = props => {
  return (
    <StyleCard>
      {props.courseData && (
        <CardHeader
          title={props.courseData.subject + ' ' + props.courseData.code}
          subheader={
            props.courseData.fullName
              ? props.courseData.fullName
              : props.courseData.name
          }
        />
      )}
      {/* <CardMedia /> */}
      <Divider />
      {props.courseData && (
        <CardContent>
          <TextBlock
            type="body2"
            text={
              'Date and Time: ' +
              (props.courseData.settings!.length > 0
                ? props.courseData.settings![0].day.reduce((d, s, i) => {
                    return (i === 0 ? '' : d) + s.substring(0, 2);
                  }, '') +
                  ' ' +
                  props.courseData.settings![0].time.start +
                  '-' +
                  props.courseData.settings![0].time.end
                : 'TBA')
            }
          />
          <TextBlock
            type="body2"
            text={'Class type: ' + props.courseData.type}
          />
          <div />
          <TextBlock
            type="body2"
            text={
              'GE: ' +
              (props.courseData.ge.length > 0
                ? props.courseData.ge.reduce((x, c) => {
                    return x + c + ' ';
                  })
                : 'N/a')
              // 	+
              // ', ' +
              // 'Credits: ' +
              // props.courseData.credit
            }
          />
          <TextBlock
            type="body2"
            text={'Course Number: ' + props.courseData.number}
          />
          <div />
          <TextBlock
            type="body2"
            text={
              'Number Enrolled: ' +
              props.tracking.enrolled +
              '/' +
              props.tracking.capacity
            }
          />
          <TextBlock
            type="body2"
            text={
              'Number Waitlist: ' +
              props.tracking.waitlistTotal +
              '/' +
              props.tracking.waitlistCapacity
            }
          />
          <div />
          <TextBlock
            type="body2"
            text={
              'Professor: ' +
              (props.courseData.instructor && props.courseData.instructor.first
                ? props.courseData.instructor!.first +
                  ' ' +
                  (props.courseData.instructor!.middle
                    ? props.courseData.instructor!.middle + ' '
                    : '') +
                  props.courseData.instructor!.last
                : 'STAFF')
            }
          />
          <TextBlock
            type="body2"
            text={
              // 'Grade Average'
              'Credits: ' + props.courseData.credit
            }
          />
          <Divider />
          <div>
            <ExpansionPanel>
              <ExpansionPanelSummary>
                <Typography variant="body2">Description</Typography>
                <KeyboardArrowDownRounded />
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>{props.courseData.description}</Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel disabled={!props.courseData.prerequisites}>
              <ExpansionPanelSummary>
                <Typography variant="body2">Prerequisites </Typography>
                {props.courseData.prerequisites && <KeyboardArrowDownRounded />}
                {!props.courseData.prerequisites && (
                  <Typography variant="body2"> - None</Typography>
                )}
              </ExpansionPanelSummary>
              {props.courseData.prerequisites && (
                <ExpansionPanelDetails>
                  <Typography>{props.courseData.prerequisites}</Typography>
                </ExpansionPanelDetails>
              )}
            </ExpansionPanel>
          </div>
        </CardContent>
      )}
    </StyleCard>
  );
};

export default DescCard;
