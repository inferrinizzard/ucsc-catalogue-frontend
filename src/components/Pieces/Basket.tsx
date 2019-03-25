import * as React from 'react';
import styled from 'styled-components';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';

import ClassCard from './ClassCard';
import { Course } from '../../models/course.model';

export interface BasketProps {
  basketOpen: boolean;
  courses: Course[];
  active: Course | null;
  cardHeight: number;
  activeOpen: boolean;
  openDetail: (c: Course) => void;
}

const Basket: React.SFC<BasketProps> = props => {
  return (
    <Drawer
      variant="persistent"
      anchor="bottom"
      open={props.basketOpen}
      elevation={1}
      PaperProps={{
        style: {
          // height: props.cardHeight + 'em',
          width: (props.activeOpen ? 52 : 100) + '%',
        },
      }}
    >
      <Typography>
        {props.courses.map((course, index) => {
          return (
            <ClassCard
              k={index}
              active={props.active}
              courseData={course}
              openDetail={props.openDetail}
            />
          );
        })}
      </Typography>
    </Drawer>
  );
};

export default Basket;
