import React, { useContext } from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';

import { ActiveCourseContext } from '../App';
import DescCard from './Cards/DescCard';
import EnrollCard from './Cards/EnrollCard';
import GradesCard from './Cards/GradesCard';
import ProfCard from './Cards/ProfCard';
import MajorCard from './Cards/MajorCard';
import LocCard from './Cards/LocCard';
import SectionCard from './Cards/SectionCard';
import NotchedOutline from './DrawerItems/NotchedOutline';

import { isMobileOnly } from 'react-device-detect';

import { Course, CourseEnrollment, professorRating } from '../models/course.model';
import { Typography } from '@material-ui/core';

export interface CourseDrawerProps {
	addBasket: (c: Course) => void;
	removeBasket: (c: Course) => void;
	basketCourses: Course[];
	closeDetail: () => void;
	tracking: CourseEnrollment[];
	prevStart: Date;
	curStart: Date;
	quarter: number;
	loading: boolean;
	rmp: professorRating;
}

const Spacer = styled.div`
	margin-top: 30px;
`;

const FloatButton = styled(Fab)`
	position: sticky !important;
	bottom: 25px;
	left: 85%;
`;

const CourseDrawer: React.FC<CourseDrawerProps> = ({ tracking, ...props }) => {
	const course = useContext(ActiveCourseContext);
	return (
		<Drawer
			anchor={isMobileOnly ? 'bottom' : 'right'}
			open={!!course}
			variant="persistent"
			elevation={1}
			PaperProps={{
				style: {
					width: isMobileOnly ? '100%' : '48%',
					height: isMobileOnly ? '50%' : undefined,
				},
			}}>
			{isMobileOnly ? (
				<Button
					fullWidth
					onClick={e => props.closeDetail()}
					style={{
						backgroundColor: 'aliceblue',
						position: 'sticky',
						top: 0,
					}}>
					<Typography>{'Close'}</Typography>
				</Button>
			) : (
				<Spacer />
			)}
			<Card className="styleCard">
				<NotchedOutline width={52} title={'Details'}>
					<DescCard
						basketCourses={props.basketCourses}
						courseData={course}
						tracking={tracking.length ? tracking[0] : null}
						addBasket={props.addBasket}
						removeBasket={props.removeBasket}
					/>
				</NotchedOutline>
			</Card>
			<Card className="styleCard">
				<NotchedOutline width={74} title={'Enrollment'}>
					<EnrollCard
						tracking={tracking}
						prevStart={props.prevStart}
						curStart={props.curStart}
						quarter={props.quarter}
					/>
				</NotchedOutline>
			</Card>
			{course && tracking.length && tracking[0]?.sections.length && (
				<Card className="styleCard">
					<NotchedOutline width={66} title={'Sections'}>
						<SectionCard section={tracking[0].sections} setting={course.settings?.slice(1) ?? []} />
					</NotchedOutline>
				</Card>
			)}
			<Card className="styleCard">
				<NotchedOutline width={50} title={'Grades'} inner={<GradesCard />} />
			</Card>
			<div>
				<span className="third">
					<Card className="styleCard">
						<NotchedOutline width={72} title={'Professor'}>
							<ProfCard
								rmp={props.rmp}
								name={
									(course?.instructor?.first + ' ' + course?.instructor?.last).trim() || 'STAFF'
								}
							/>
						</NotchedOutline>
					</Card>
				</span>
				<span className="third">
					<Card className="styleCard">
						<NotchedOutline width={50} title={'Major'}>
							<MajorCard />
						</NotchedOutline>
					</Card>
				</span>
				<span className="third">
					<Card className="styleCard">
						<NotchedOutline width={66} title={'Location'}>
							<LocCard location={course?.settings?.length ? course.settings[0].location : 'TBA'} />
						</NotchedOutline>
					</Card>
				</span>
			</div>
			{/* <FloatButton onClick={props.closeDetail}>BACK</FloatButton> */}
		</Drawer>
	);
};

export default CourseDrawer;
