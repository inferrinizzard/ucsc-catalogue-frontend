import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const StyleCard = styled(Card)<any>`
  margin: 0.5em;
  min-width: 200px;
`;

export interface ClassCardProps {
  openDetail: () => void;
  courseData: {
    course: string;
    name: string;
    grade: string;
  };
}

const ClassCard: React.SFC<ClassCardProps> = props => {
  return (
    <React.Fragment>
      <StyleCard>
        <CardActionArea action={props.openDetail}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {props.courseData.course}
            </Typography>
            <Typography component="p">
              {props.courseData.name + ' ' + props.courseData.grade}
            </Typography>
          </CardContent>
        </CardActionArea>
      </StyleCard>
    </React.Fragment>
  );
};

export default ClassCard;
