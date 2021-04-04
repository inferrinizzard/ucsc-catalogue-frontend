import React from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import KeyboardArrowDownRounded from '@material-ui/icons/KeyboardArrowDownRounded';
import Typography from '@material-ui/core/Typography';
import Bookmark from '@material-ui/icons/Bookmark';
import BookmarkBorder from '@material-ui/icons/BookmarkBorder';

import Skeleton from './Skeleton';
import { Course, CourseEnrollment } from '../../models/course.model';

export interface DescCardProps {
	basketCourses: Course[];
	courseData: Course | null;
	tracking: { fetching: boolean; data: CourseEnrollment | null };
	addBasket: (c: Course) => void;
	removeBasket: (c: Course) => void;
}

const TextBlock = styled(Typography)`
	&& {
		display: inline-block;
	}
	width: 50%;
`;

const DescCard: React.FC<DescCardProps> = ({
	courseData: course,
	tracking: { fetching: fetchTracking, data: tracking },
	...props
}) => {
	let inBasket = course && props.basketCourses.some(cur => cur.number === course!.number);
	return (
		<React.Fragment>
			{course && (
				<CardHeader
					title={course.subject + ' ' + course.code}
					subheader={(course.fullName !== 'DUMMY' ? course.fullName : '') || course.name}
					action={
						<Button
							variant="outlined"
							onClick={event => (inBasket ? props.removeBasket(course!) : props.addBasket(course!))}
							style={{ paddingRight: '10px' }}>
							{inBasket ? 'Remove' : 'Bookmark'}
							{inBasket ? <Bookmark /> : <BookmarkBorder />}
						</Button>
					}
				/>
			)}
			<Divider />
			{course && (
				<CardContent>
					<TextBlock variant="body2">
						{'Day and Time: ' +
							(course.settings?.length
								? course.settings[0].day.map(d => d.substring(0, 2)).join('') +
								  ' ' +
								  course.settings[0].time.start +
								  '-' +
								  course.settings[0].time.end
								: 'TBA')}
					</TextBlock>
					<TextBlock variant="body2">{'Class Type: ' + course.type}</TextBlock>
					<div />
					<TextBlock variant="body2">
						{'GE: ' + (course.ge.length ? course.ge.join(' ') : 'N/a')}
					</TextBlock>
					<TextBlock variant="body2">{'Course Number: ' + course.number}</TextBlock>
					<div />
					<TextBlock variant="body2">
						{'Number Enrolled: '}
						{fetchTracking && <Skeleton width={'5rem'} style={{ display: 'inline-block' }} />}
						{!fetchTracking &&
							(tracking ? tracking.enrolled + '/' + tracking.capacity : 'Unavailable')}
					</TextBlock>
					<TextBlock variant="body2">
						{'Number Waitlisted: '}
						{fetchTracking && <Skeleton width={'5rem'} style={{ display: 'inline-block' }} />}
						{!fetchTracking &&
							(tracking ? tracking.waitlistTotal + '/' + tracking.waitlistCapacity : 'Unavailable')}
					</TextBlock>
					<div />
					<TextBlock variant="body2">
						{'Professor: ' +
							(course.instructor?.first
								? course.instructor.first +
								  ' ' +
								  (course.instructor!.middle ? course.instructor!.middle + ' ' : '') +
								  course.instructor!.last
								: 'STAFF')}
					</TextBlock>
					<TextBlock variant="body2">
						{
							// 'Grade Average'
							'Credits: ' + course.credit
						}
					</TextBlock>
					<Divider />
					<div>
						<Accordion>
							<AccordionSummary>
								<Typography variant="body2">Description</Typography>
								<KeyboardArrowDownRounded />
							</AccordionSummary>
							<AccordionDetails>
								<Typography>{course.description}</Typography>
							</AccordionDetails>
						</Accordion>
						<Accordion disabled={!course.prerequisites}>
							<AccordionSummary>
								<Typography variant="body2">Prerequisites </Typography>
								{course.prerequisites && <KeyboardArrowDownRounded />}
								{!course.prerequisites && <Typography variant="body2"> - None</Typography>}
							</AccordionSummary>
							{course.prerequisites && (
								<AccordionDetails>
									<Typography>{course.prerequisites}</Typography>
								</AccordionDetails>
							)}
						</Accordion>
					</div>
				</CardContent>
			)}
		</React.Fragment>
	);
};

export default DescCard;
