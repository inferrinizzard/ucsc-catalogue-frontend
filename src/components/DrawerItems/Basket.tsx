import React from 'react';

import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';

import ClassCard from './ClassCard';
import { ActiveCourseContext } from '../../App';
import { Course, CourseEnrollment } from '../../models/course.model';
import { CourseEpics } from '../../store/course';

export interface BasketProps {
	basketOpen: boolean;
	courses: Course[];
	cardHeight: number;
	openDetail: (c: Course) => void;
	tracking: CourseEnrollment[];
	activeOpen: boolean;
}

const Basket: React.FC<BasketProps> = props => {
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
