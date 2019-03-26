import * as React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import KeyboardArrowDownRounded from '@material-ui/icons/KeyboardArrowDownRounded';
import Typography from '@material-ui/core/Typography';
import Bookmark from '@material-ui/icons/Bookmark';
import BookmarkBorder from '@material-ui/icons/BookmarkBorder';

import TextBlock from '../Pieces/TextBlock';
import { Course, CourseEnrollment } from '../../models/course.model';

const StyleCard = styled(Card)<any>`
  margin: 0.5em;
  overflow: visible !important;
`;

export interface DescCardProps {
  basketCourses: Course[];
  courseData: Course | null;
  tracking: CourseEnrollment;
  addBasket: (c: Course) => void;
  removeBasket: (c: Course) => void;
}

const DescCard: React.SFC<DescCardProps> = props => {
  let course = props.courseData;
  let tracking = props.tracking;
  let inBasket =
    course &&
    props.basketCourses
      .reduce((numbers: number[], cur: Course) => [...numbers, cur.number], [])
      .includes(course!.number);
  return (
    <StyleCard>
      {course && (
        <CardHeader
          title={course.subject + ' ' + course.code}
          subheader={course.fullName ? course.fullName : course.name}
          action={
            <Button
              variant="outlined"
              onClick={event =>
                inBasket
                  ? props.removeBasket(course as Course)
                  : props.addBasket(course as Course)
              }
              style={{ paddingRight: '10px' }}
            >
              {inBasket ? 'Remove' : 'Bookmark'}
              {inBasket ? <Bookmark /> : <BookmarkBorder />}
            </Button>
          }
        />
      )}
      <Divider />
      {course && (
        <CardContent>
          <TextBlock
            type="body2"
            text={
              'Date and Time: ' +
              (course.settings!.length > 0
                ? course.settings![0].day.reduce((d, s, i) => {
                    return (i === 0 ? '' : d) + s.substring(0, 2);
                  }, '') +
                  ' ' +
                  course.settings![0].time.start +
                  '-' +
                  course.settings![0].time.end
                : 'TBA')
            }
          />
          <TextBlock type="body2" text={'Class type: ' + course.type} />
          <div />
          <TextBlock
            type="body2"
            text={
              'GE: ' +
              (course.ge.length > 0
                ? course.ge.reduce((x, c) => {
                    return x + c + ' ';
                  })
                : 'N/a')
              // 	+
              // ', ' +
              // 'Credits: ' +
              // course.credit
            }
          />
          <TextBlock type="body2" text={'Course Number: ' + course.number} />
          <div />
          <TextBlock
            type="body2"
            text={
              'Number Enrolled: ' + tracking.enrolled + '/' + tracking.capacity
            }
          />
          <TextBlock
            type="body2"
            text={
              'Number Waitlist: ' +
              tracking.waitlistTotal +
              '/' +
              tracking.waitlistCapacity
            }
          />
          <div />
          <TextBlock
            type="body2"
            text={
              'Professor: ' +
              (course.instructor && course.instructor.first
                ? course.instructor!.first +
                  ' ' +
                  (course.instructor!.middle
                    ? course.instructor!.middle + ' '
                    : '') +
                  course.instructor!.last
                : 'STAFF')
            }
          />
          <TextBlock
            type="body2"
            text={
              // 'Grade Average'
              'Credits: ' + course.credit
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
                <Typography>{course.description}</Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel disabled={!course.prerequisites}>
              <ExpansionPanelSummary>
                <Typography variant="body2">Prerequisites </Typography>
                {course.prerequisites && <KeyboardArrowDownRounded />}
                {!course.prerequisites && (
                  <Typography variant="body2"> - None</Typography>
                )}
              </ExpansionPanelSummary>
              {course.prerequisites && (
                <ExpansionPanelDetails>
                  <Typography>{course.prerequisites}</Typography>
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
