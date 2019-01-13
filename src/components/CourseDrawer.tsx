import * as React from 'react';
import styled from 'styled-components';
import Drawer from '@material-ui/core/Drawer';

import DescCard from './DescCard';
import EnrollCard from './EnrollCard';
import GradesCard from './GradesCard';
import ProfCard from './ProfCard';
import MajorCard from './MajorCard';
import LocCard from './LocCard';

export interface CourseDrawerProps {}
export interface CourseDrawerState {}

const linerWidth = 30;
const Spacer = styled.div`
  margin-top: ${linerWidth}px;
`;
const Third = styled.span`
  width: 33.3%;
  display: inline-block;
`;

class CourseDrawer extends React.Component<
  CourseDrawerProps,
  CourseDrawerState
> {
  render() {
    return (
      <Drawer anchor="right" open={true} variant="persistent">
        <Spacer />
        <DescCard />
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
      </Drawer>
    );
  }
}

export default CourseDrawer;
