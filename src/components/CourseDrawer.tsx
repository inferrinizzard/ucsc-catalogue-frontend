import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';

import { CourseContext } from '../App';
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

const StyledCard = styled(Card)`
	margin: 0.5rem;
	&& {
		overflow: visible;
		box-shadow: none;
	}
`;
const InlineStyledCard = styled(StyledCard).attrs((p: { n?: number }) => ({ n: p.n || 3 }))`
	width: ${p => `calc(${100 / p.n}% - 1rem)`};
	display: inline-block;
`;

const Spacer = styled.div`
	margin-top: 30px;
`;

const FloatButton = styled(Fab)`
	position: sticky !important;
	bottom: 25px;
	left: 85%;
`;

const CourseDrawer: React.FC<CourseDrawerProps> = ({ tracking, ...props }) => {
	const activeCourse = useContext(CourseContext).active;
	const theme = useContext(ThemeContext);

	return (
		<Drawer
			anchor={isMobileOnly ? 'bottom' : 'right'}
			open={!!activeCourse}
			variant="persistent"
			elevation={1}
			PaperProps={{
				style: {
					width: isMobileOnly ? '100%' : `${(100 - theme.selectDrawerWidth) / 2}%`,
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
			<StyledCard>
				<NotchedOutline width={52} title={'Details'}>
					<DescCard
						basketCourses={props.basketCourses}
						courseData={activeCourse}
						tracking={tracking.length ? tracking[0] : null}
						addBasket={props.addBasket}
						removeBasket={props.removeBasket}
					/>
				</NotchedOutline>
			</StyledCard>
			<StyledCard>
				<NotchedOutline width={74} title={'Enrollment'}>
					<EnrollCard
						tracking={tracking}
						prevStart={props.prevStart}
						curStart={props.curStart}
						quarter={props.quarter}
					/>
				</NotchedOutline>
			</StyledCard>
			{activeCourse && tracking.length && tracking[0]?.sections.length && (
				<StyledCard>
					<NotchedOutline width={66} title={'Sections'}>
						<SectionCard
							section={tracking[0].sections}
							setting={activeCourse.settings?.slice(1) ?? []}
						/>
					</NotchedOutline>
				</StyledCard>
			)}
			<StyledCard>
				<NotchedOutline width={50} title={'Grades'} inner={<GradesCard />} />
			</StyledCard>
			<div>
				<InlineStyledCard n={3}>
					<NotchedOutline width={72} title={'Professor'}>
						<ProfCard
							rmp={props.rmp}
							name={
								(activeCourse?.instructor?.first + ' ' + activeCourse?.instructor?.last).trim() ||
								'STAFF'
							}
						/>
					</NotchedOutline>
				</InlineStyledCard>
				<InlineStyledCard n={3}>
					<NotchedOutline width={50} title={'Major'}>
						<MajorCard />
					</NotchedOutline>
				</InlineStyledCard>
				<InlineStyledCard n={3}>
					<NotchedOutline width={66} title={'Location'}>
						<LocCard
							location={activeCourse?.settings?.length ? activeCourse.settings[0].location : 'TBA'}
						/>
					</NotchedOutline>
				</InlineStyledCard>
			</div>
			{/* <FloatButton onClick={props.closeDetail}>BACK</FloatButton> */}
		</Drawer>
	);
};

export default CourseDrawer;
