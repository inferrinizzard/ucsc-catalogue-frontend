import * as React from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import KeyboardArrowDownRounded from '@material-ui/icons/KeyboardArrowDownRounded';
import Typography from '@material-ui/core/Typography';
import Bookmark from '@material-ui/icons/Bookmark';
import BookmarkBorder from '@material-ui/icons/BookmarkBorder';

import { Course, CourseEnrollment } from '../../models/course.model';

export interface DescCardProps {
	basketCourses: Course[];
	courseData: Course | null;
	tracking: CourseEnrollment | null;
	addBasket: (c: Course) => void;
	removeBasket: (c: Course) => void;
}

const TextBlock = styled(Typography)<any>`
	display: inline-block !important;
	width: 50%;
`;

const DescCard: React.SFC<DescCardProps> = props => {
	let course = props.courseData;
	let tracking = props.tracking;
	let inBasket =
		course &&
		props.basketCourses
			.reduce((numbers: number[], cur: Course) => [...numbers, cur.number], [])
			.includes(course!.number);
	return (
		<React.Fragment>
			{course && (
				<CardHeader
					title={course.subject + ' ' + course.code}
					subheader={course.fullName ? course.fullName : course.name}
					action={
						<Button
							variant="outlined"
							onClick={event =>
								inBasket ? props.removeBasket(course as Course) : props.addBasket(course as Course)
							}
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
						{'Date and Time: ' +
							(course.settings!.length
								? course.settings![0].day.map(d => d.substring(0, 2)).join('') +
								  ' ' +
								  course.settings![0].time.start +
								  '-' +
								  course.settings![0].time.end
								: 'TBA')}
					</TextBlock>
					<TextBlock variant="body2">{'Class type: ' + course.type}</TextBlock>
					<div />
					<TextBlock variant="body2">
						{
							'GE: ' + (course.ge.length ? course.ge.join(' ') : 'N/a')
							// 	+
							// ', ' +
							// 'Credits: ' +
							// course.credit
						}
					</TextBlock>
					<TextBlock variant="body2">{'Course Number: ' + course.number}</TextBlock>
					<div />
					<TextBlock variant="body2">
						{'Number Enrolled: ' +
							(tracking ? tracking.enrolled + '/' + tracking.capacity : 'Unavailable')}
					</TextBlock>
					<TextBlock variant="body2">
						{'Number Waitlist: ' +
							(tracking ? tracking.waitlistTotal + '/' + tracking.waitlistCapacity : 'Unavailable')}
					</TextBlock>
					<div />
					<TextBlock variant="body2">
						{'Professor: ' +
							(course.instructor && course.instructor.first
								? course.instructor!.first +
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
						<ExpansionPanel>
							<ExpansionPanelSummary>
								<Typography variant="body2">Description</Typography>
								<KeyboardArrowDownRounded />
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Typography>{course.description}</Typography>
							</ExpansionPanelDetails>
						</ExpansionPanel>
						<ExpansionPanel disabled={!course.prerequisites}>
							<ExpansionPanelSummary>
								<Typography variant="body2">Prerequisites </Typography>
								{course.prerequisites && <KeyboardArrowDownRounded />}
								{!course.prerequisites && <Typography variant="body2"> - None</Typography>}
							</ExpansionPanelSummary>
							{course.prerequisites && (
								<ExpansionPanelDetails>
									<Typography>{course.prerequisites}</Typography>
								</ExpansionPanelDetails>
							)}
						</ExpansionPanel>
					</div>
				</CardContent>
			)}
		</React.Fragment>
	);
};

export default DescCard;
