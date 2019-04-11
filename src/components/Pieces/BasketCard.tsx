import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { Course, CourseEnrollment } from '../../models/course.model';

export interface BasketCardProps {
  openDetail: (course: Course) => void;
  courseData: Course;
  active: Course | null;
  tracking: CourseEnrollment;
  scrollTo: (row: number) => void;
}

export interface BasketCardState {
  enrolled: number;
  capacity: number;
  waitlist: number;
}

class BasketCard extends React.Component<BasketCardProps, BasketCardState> {
  state = {
    enrolled: this.props.tracking.enrolled,
    capacity: this.props.tracking.capacity,
    waitlist: this.props.tracking.waitlistTotal,
  };
  render() {
    return (
      <Card
        style={{
          margin: '0.15em 0.25em',
          width: '200px',
          display: 'inline-block',
        }}
      >
        <CardActionArea
          style={{
            backgroundColor:
              this.props.active &&
              this.props.active.number === this.props.courseData.number
                ? '#92c2ff'
                : 'transparent',
          }}
          onClick={event => this.props.openDetail(this.props.courseData)}
        >
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {this.props.courseData.subject + ' ' + this.props.courseData.code}
            </Typography>
            <Typography component="p" gutterBottom>
              {this.props.courseData.name}
            </Typography>
            <Divider />
            <Typography variant={'h6'}>
              {this.state.enrolled < this.state.capacity
                ? 'Enrolled: ' + this.state.enrolled + '/' + this.state.capacity
                : 'Waitlisted: ' + this.state.waitlist}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default BasketCard;
