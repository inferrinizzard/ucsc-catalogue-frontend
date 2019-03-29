import * as React from 'react';
import styled from 'styled-components';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';

import BasketCard from './BasketCard';
import { Course, CourseEnrollment } from '../../models/course.model';
import { CourseEpics } from '../../store/course';

export interface BasketProps {
  basketOpen: boolean;
  courses: { c: Course; r: number }[];
  active: Course | null;
  cardHeight: number;
  activeOpen: boolean;
  openDetail: (c: Course, row: number) => void;
  tracking: CourseEnrollment[];
  scrollTo: (row: number) => void;
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
        },
      }}
    >
      <div
        style={{
          flexDirection: 'row',
          width: props.courses.length > 4 ? 'max-content' : 'auto',
        }}
      >
        {Object.keys(props.courses).map((key, index) => {
          return (
            <BasketCard
              key={index}
              row={props.courses[index].r}
              active={props.active}
              courseData={props.courses[index].c}
              openDetail={props.openDetail}
              tracking={props.tracking[0]}
              scrollTo={props.scrollTo}
            />
          );
        })}
      </div>
    </Drawer>
  );
};

export default Basket;
