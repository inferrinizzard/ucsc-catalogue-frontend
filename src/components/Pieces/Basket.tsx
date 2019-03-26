import * as React from 'react';
import styled from 'styled-components';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
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
          // maxHeight: props.cardHeight + 0.5 + 'em',
          width: (props.activeOpen ? 52 : 100) + '%',
          flexDirection: 'row',
        },
      }}
    >
      {props.courses.map((course, index) => {
        return (
          <ClassCard
            key={index}
            k={index}
            active={props.active}
            courseData={course}
            openDetail={props.openDetail}
          />
        );
      })}
    </Drawer>
  );
};

export default Basket;
