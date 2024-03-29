import React, { useContext } from 'react';
import styled, { ThemeContext } from 'styled-components';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Drawer from '@material-ui/core/Drawer';
import Close from '@material-ui/icons/CloseRounded';

import { CourseContext } from '../App';
import DescCard from './Cards/DescCard';
import EnrollCard from './Cards/EnrollCard';
import GradesCard from './Cards/GradesCard';
import ProfCard from './Cards/ProfCard';
import MajorCard from './Cards/MajorCard';
import LocCard from './Cards/LocCard';
import SectionCard from './Cards/SectionCard';
import Skeleton from './Cards/Skeleton';
import NotchedOutline from './DrawerItems/NotchedOutline';

import { isMobileOnly } from 'react-device-detect';

import { Course, CourseEnrollment, professorRating } from '../models/course.model';
import { Typography } from '@material-ui/core';

export interface CourseDrawerProps {
	addBasket: (c: Course) => void;
	removeBasket: (c: Course) => void;
	basketCourses: Course[];
	closeDetail: () => void;
	tracking: { fetching: boolean; data: CourseEnrollment[] };
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

const DrawerHeader = styled.div`
	position: sticky;
	top: 0;
	width: auto;
	display: flex;
	justify-content: space-between;
	padding: 0.25rem 0.5rem;
	z-index: ${p => p.theme.cardHeightPlus1};
	background-color: ${p => p.theme.cardBlue};
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
					height: `calc(100% - ${theme.topLinerHeight})`,
					marginTop: isMobileOnly ? 0 : theme.topLinerHeight,
				},
			}}>
			<DrawerHeader>
				<Typography variant={isMobileOnly ? 'h6' : 'h5'} style={{ display: 'inline-block' }}>
					Course Details
				</Typography>
				<Button
					onClick={props.closeDetail}
					style={{
						padding: '3px',
						height: 'fit-content',
						minWidth: 'fit-content',
						marginRight: '1rem',
					}}>
					<Close fontSize={isMobileOnly ? 'default' : 'large'} />
				</Button>
			</DrawerHeader>
			<StyledCard>
				<NotchedOutline width={52} title={'Details'}>
					<DescCard
						basketCourses={props.basketCourses}
						courseData={activeCourse}
						tracking={{
							fetching: tracking.fetching,
							data: tracking.data.length ? tracking.data[0] : null,
						}}
						addBasket={props.addBasket}
						removeBasket={props.removeBasket}
					/>
				</NotchedOutline>
			</StyledCard>
			<StyledCard>
				<NotchedOutline width={74} title={'Enrollment'}>
					{tracking.fetching && <Skeleton variant="rect" />}{' '}
					{!tracking.fetching && <EnrollCard tracking={tracking.data} />}
				</NotchedOutline>
			</StyledCard>
			{tracking.fetching ? (
				<StyledCard>
					<NotchedOutline width={66} title={'Sections'}>
						<Skeleton variant="rect" height={50} />
					</NotchedOutline>
				</StyledCard>
			) : (
				tracking.data.length &&
				tracking.data[0]?.sections.length > 0 && (
					<StyledCard>
						<NotchedOutline width={66} title={'Sections'}>
							<SectionCard
								section={tracking.data[0].sections}
								setting={activeCourse!.settings?.slice(1) ?? []}
							/>
						</NotchedOutline>
					</StyledCard>
				)
			)}
			<StyledCard>
				<NotchedOutline width={50} title={'Grades'} inner={<GradesCard />} />
			</StyledCard>
			<div>
				<InlineStyledCard n={isMobileOnly ? 1 : 3}>
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
				<InlineStyledCard n={isMobileOnly ? 1 : 3}>
					<NotchedOutline width={50} title={'Major'}>
						<MajorCard />
					</NotchedOutline>
				</InlineStyledCard>
				<InlineStyledCard n={isMobileOnly ? 1 : 3}>
					<NotchedOutline width={66} title={'Location'}>
						<LocCard
							location={activeCourse?.settings?.length ? activeCourse.settings[0].location : 'TBA'}
						/>
					</NotchedOutline>
				</InlineStyledCard>
			</div>
		</Drawer>
	);
};

export default CourseDrawer;
