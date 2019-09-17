import * as React from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { Course } from '../../models/course.model';
import { isMobileOnly } from 'react-device-detect';

export interface ClassCardProps {
  openDetail: (course: Course, k: number) => void;
  courseData: Course;
  active: Course | null;
  row: number;
}

const ClassCard: React.SFC<ClassCardProps> = props => (
  <Card
    style={{
      margin: '0.15em 0.25em',
      width: isMobileOnly ? 'calc(50vw - 0.6em)' : '200px',
      display: 'inline-block',
    }}
  >
    <CardActionArea
      style={{
        backgroundColor:
          props.active && props.active.number === props.courseData.number
            ? '#92c2ff'
            : 'transparent',
      }}
      onClick={e => props.openDetail(props.courseData, props.row)}
    >
      <CardContent>
        <div
        // style={{ backgroundColor: 'aliceblue' }}
        >
          <Typography gutterBottom variant="h5" component="h2">
            {props.courseData.subject + ' ' + props.courseData.code}
          </Typography>
        </div>
        <Typography style={{ overflow: 'hidden', maxHeight: '20.444px' }}>
          {props.courseData.name}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default ClassCard;
