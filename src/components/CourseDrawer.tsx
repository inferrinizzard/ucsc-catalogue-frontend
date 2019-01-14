import * as React from 'react';
import styled from 'styled-components';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';

import DescCard from './DescCard';
import EnrollCard from './EnrollCard';
import GradesCard from './GradesCard';
import ProfCard from './ProfCard';
import MajorCard from './MajorCard';
import LocCard from './LocCard';

export interface CourseDrawerProps {
  open: boolean;
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
        <Fab>butt</Fab>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus
        aspernatur quia doloremque iure veniam facere rerum quas dolor tempore
        id in, itaque a accusantium modi amet aut sapiente eum ducimus?
      </ScrollDrawer>
    );
  }
}

export default CourseDrawer;
