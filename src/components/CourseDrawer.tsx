import * as React from 'react';
import styled from 'styled-components';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';

import DescCard from './Cards/DescCard';
import EnrollCard from './Cards/EnrollCard';
import GradesCard from './Cards/GradesCard';
import ProfCard from './Cards/ProfCard';
import MajorCard from './Cards/MajorCard';
import LocCard from './Cards/LocCard';

import { Course } from '../models/course.model';

export interface CourseDrawerProps {
  open: boolean;
  closeDetail: () => void;
  course: Course | null;
}
export interface CourseDrawerState {}

const linerWidth = 30;
const Spacer = styled.div`
  margin-top: ${linerWidth}px;
`;

const Third = styled.span`
  width: 33.3%;
  display: inline-block;
`;

const FloatButton = styled(Fab)<any>`
  position: sticky !important;
  bottom: 25px;
  left: 85%;
`;

class CourseDrawer extends React.Component<
  CourseDrawerProps,
  CourseDrawerState
> {
  render() {
    return (
      <Drawer
        anchor="right"
        open={Boolean(this.props.course)}
        variant="persistent"
        elevation={1}
        PaperProps={{
          style: {
            width: '50%',
          },
        }}
      >
        <Spacer />
        <DescCard courseData={this.props.course} />
        <EnrollCard />
        <GradesCard />
        <div>
          <Third>
            <ProfCard />
          </Third>
          <Third>
            <MajorCard />
          </Third>
          <Third>
            <LocCard />
          </Third>
        </div>
        <FloatButton onClick={this.props.closeDetail}>BACK</FloatButton>
      </Drawer>
    );
  }
}

export default CourseDrawer;
