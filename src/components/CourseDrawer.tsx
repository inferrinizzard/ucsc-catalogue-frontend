import * as React from 'react';
import styled from 'styled-components';
import Drawer from '@material-ui/core/Drawer'

import DescCard from './DescCard';

export interface CourseDrawerProps {}
export interface CourseDrawerState {}

const linerWidth = 30;
const Spacer = styled.div`margin-top: ${linerWidth}px;`;
 
class CourseDrawer extends React.Component<CourseDrawerProps, CourseDrawerState> {
	render() { 
		return (
			<Drawer anchor="right" open={true} variant="persistent">
				<Spacer/>
				<DescCard />
			</Drawer>
		);
	}
}
 
export default CourseDrawer;