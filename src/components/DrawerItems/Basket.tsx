import React from 'react';

import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';

import BasketCard from './BasketCard';
import { Course, CourseEnrollment } from '../../models/course.model';
import { CourseEpics } from '../../store/course';

export interface BasketProps {
	basketOpen: boolean;
	courses: Course[];
	active: Course | null;
	cardHeight: number;
	activeOpen: boolean;
	openDetail: (c: Course) => void;
	tracking: CourseEnrollment[];
	scrollTo: (row: number) => void;
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
				{Object.keys(props.courses).map((_, i) => {
					return (
						<BasketCard
							key={i}
							active={props.active}
							courseData={props.courses[i]}
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
