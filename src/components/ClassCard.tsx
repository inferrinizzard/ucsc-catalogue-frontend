import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { Course } from '../models/course.model';

const StyleCard = styled(Card)<any>`
  margin: 0.15em 0.25em
	min-width: 200px;
  display: inline-block;
`;

export interface ClassCardProps {
  openDetail: (course: Course) => void;
  courseData: Course;
}

const ClassCard: React.SFC<ClassCardProps> = props => {
  return (
    <StyleCard>
      <CardActionArea onClick={event => props.openDetail(props.courseData)}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.courseData.subject + ' ' + props.courseData.code}
          </Typography>
          <Typography component="p">{props.courseData.name}</Typography>
        </CardContent>
      </CardActionArea>
    </StyleCard>
  );
};

export default ClassCard;
