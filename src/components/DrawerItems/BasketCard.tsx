import React, { useState } from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { Course, CourseEnrollment } from '../../models/course.model';

export interface BasketCardProps {
	openDetail: (course: Course) => void;
	courseData: Course;
	active: Course | null;
	tracking: CourseEnrollment;
	scrollTo: (row: number) => void;
}

const BasketCard: React.FC<BasketCardProps> = props => {
	// const [tracking, setTracking] = useState(props.tracking);

	return (
		<Card
			style={{
				margin: '0.15em 0.25em',
				width: '200px',
				display: 'inline-block',
			}}>
			<CardActionArea
				style={{
					backgroundColor:
						props.active?.number === props.courseData.number ? '#92c2ff' : 'transparent',
				}}
				onClick={event => props.openDetail(props.courseData)}>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						{props.courseData.subject + ' ' + props.courseData.code}
					</Typography>
					<Typography component="p" gutterBottom>
						{props.courseData.name}
					</Typography>
					<Divider />
					<Typography variant={'h6'}>
						{props.tracking.enrolled < props.tracking.capacity
							? 'Enrolled: ' + props.tracking.enrolled + '/' + props.tracking.capacity
							: 'Waitlisted: ' + props.tracking.waitlistTotal}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default BasketCard;
