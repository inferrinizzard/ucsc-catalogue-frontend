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

export interface CourseDrawerProps {
  open: boolean;
  closeDetail: () => void;
}
export interface CourseDrawerState {}

const linerWidth = 30;
const Spacer = styled.div`
  margin-top: ${linerWidth}px;
`;
const ScrollDrawer = styled(({ width, ...other }) => (
  <Drawer classes={{ paper: 'paper' }} {...other} />
))<any>`
  & .paper {
    width: 50%;
  }
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
      <ScrollDrawer
        anchor="right"
        open={this.props.open}
        variant="persistent"
        elevation={1}
      >
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
        <FloatButton onClick={this.props.closeDetail}>BACK</FloatButton>
      </ScrollDrawer>
    );
  }
}

export default CourseDrawer;
