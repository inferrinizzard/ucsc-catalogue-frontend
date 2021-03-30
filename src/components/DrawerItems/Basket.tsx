import React, { useContext } from 'react';

import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';

import BasketCard from './BasketCard';
import { ActiveCourseContext } from '../../App';
import { Course, CourseEnrollment } from '../../models/course.model';
import { CourseEpics } from '../../store/course';

export interface BasketProps {
	basketOpen: boolean;
	courses: Course[];
	cardHeight: number;
	openDetail: (c: Course) => void;
	tracking: CourseEnrollment[];
	scrollTo: (row: number) => void;
}

const Basket: React.FC<BasketProps> = props => {
	const activeCourse = useContext(ActiveCourseContext); // move down to basketcard eventually
	return (
		<Drawer
			variant="persistent"
			anchor="bottom"
			open={props.basketOpen}
			elevation={1}
			PaperProps={{
				style: {
					// maxHeight: props.cardHeight + 0.5 + 'em',
					width: (activeCourse ? 52 : 100) + '%',
				},
			}}>
			<div
				style={{
					flexDirection: 'row',
					width: props.courses.length > 4 ? 'max-content' : 'auto',
				}}>
				{props.courses.map(course => {
					return (
						<BasketCard
							key={'basket-' + course.subjectCode}
							active={activeCourse}
							courseData={course}
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
