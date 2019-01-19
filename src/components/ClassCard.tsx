import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import { Course } from '../models/course.model';

const StyleCard = styled(Card)<any>`
  margin: 0.5em;
  min-width: 200px;
  display: inline-block;
`;

export interface ClassCardProps {
  openDetail: () => void;
  courseData: Course;
}

const ClassCard: React.SFC<ClassCardProps> = props => {
  return (
    <StyleCard>
      <CardActionArea onClick={props.openDetail}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.courseData.name}
          </Typography>
          <Typography component="p">
            {props.courseData.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </StyleCard>
  );
};

export default ClassCard;
