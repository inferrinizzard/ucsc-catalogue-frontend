import React, { useState, useContext } from 'react';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { CourseContext } from '../../App';
import { Course, CourseEnrollment } from '../../models/course.model';
import { isMobileOnly } from 'react-device-detect';

export interface ClassCardProps {
	openDetail: (course: Course, k?: number) => void;
	width: number;
	courseData: Course;
	row?: number;
	tracking?: CourseEnrollment;
}

const ClassCard: React.FC<ClassCardProps> = ({ width, courseData, ...props }) => {
	const [tracking, setTracking] = useState(props.tracking);
	const activeCourse = useContext(CourseContext).active;

	const margin = { x: 0.25, y: 0.15 };
	return (
		<Card
			style={{
				margin: `${margin.y}rem ${margin.x}rem`,
				width: isMobileOnly ? 'calc(50% - 0.6em)' : `calc(${width}% - ${margin.x * 2}rem)`,
				display: 'inline-block',
			}}>
			<CardActionArea
				style={{
					backgroundColor: activeCourse?.number === courseData.number ? '#92c2ff' : 'transparent',
				}}
				onClick={e => props.openDetail(courseData, props.row)}>
				<CardContent>
					<div
					// style={{ backgroundColor: 'aliceblue' }}
					>
						<Typography gutterBottom variant="h5" component="h2">
							{courseData.subject + ' ' + courseData.code}
						</Typography>
					</div>
					<Typography style={{ overflow: 'hidden', maxHeight: '20.444px' }}>
						{courseData.name}
					</Typography>
					{tracking && (
						<>
							<Divider />
							<Typography variant={'h6'}>
								{tracking.enrolled < tracking.capacity
									? 'Enrolled: ' + tracking.enrolled + '/' + tracking.capacity
									: 'Waitlisted: ' + tracking.waitlistTotal}
							</Typography>
						</>
					)}
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default ClassCard;
