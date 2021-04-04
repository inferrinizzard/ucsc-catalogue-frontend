import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';

import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';

import ClassCard from './ClassCard';
import { CourseContext } from '../../App';
import { Course, CourseEnrollment } from '../../models/course.model';
import { CourseEpics } from '../../store/course';

export interface BasketProps {
	courses: Course[];
	openDetail: (c: Course) => void;
	tracking: CourseEnrollment[];
	activeOpen: boolean;
}

const Basket: React.FC<BasketProps> = props => {
	const theme = useContext(ThemeContext);

	return (
		<Drawer
			variant="persistent"
			anchor="bottom"
			open={!!props.courses.length}
			elevation={1}
			PaperProps={{
				style: {
					// maxHeight: props.cardHeight + 0.5 + 'em',
					width: (props.activeOpen ? 50 + theme.selectDrawerWidth / 2 : 100) + '%',
				},
			}}>
			<div
				style={{
					flexDirection: 'row',
					width: props.courses.length > 4 ? 'max-content' : 'auto',
				}}>
				{props.courses.map(course => {
					return (
						<ClassCard
							key={'basket-' + course.subjectCode}
							courseData={course}
							width={25}
							openDetail={props.openDetail}
							tracking={props.tracking[0]}
						/>
					);
				})}
			</div>
		</Drawer>
	);
};

export default Basket;
