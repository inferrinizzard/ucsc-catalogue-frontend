import React from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';

import DescCard from './Cards/DescCard';
import EnrollCard from './Cards/EnrollCard';
import GradesCard from './Cards/GradesCard';
import ProfCard from './Cards/ProfCard';
import MajorCard from './Cards/MajorCard';
import LocCard from './Cards/LocCard';
import SectionCard from './Cards/SectionCard';
import NotchedOutline from './Pieces/NotchedOutline';

import { isMobileOnly } from 'react-device-detect';

import { Course, CourseEnrollment, professorRating } from '../models/course.model';
import { Typography } from '@material-ui/core';

export interface CourseDrawerProps {
	addBasket: (c: Course) => void;
	removeBasket: (c: Course) => void;
	basketCourses: Course[];
	open: boolean;
	closeDetail: () => void;
	course: Course | null;
	tracking: CourseEnrollment[];
	prevStart: Date;
	curStart: Date;
	quarter: number;
	loading: boolean;
	rmp: professorRating;
}
export interface CourseDrawerState {}

const Spacer = styled.div`
	margin-top: 30px;
`;

const FloatButton = styled(Fab)<any>`
	position: sticky !important;
	bottom: 25px;
	left: 85%;
`;

class CourseDrawer extends React.Component<CourseDrawerProps, CourseDrawerState> {
	render() {
		let p = this.props;
		let c = p.course;
		return (
			<Drawer
				anchor={isMobileOnly ? 'bottom' : 'right'}
				open={Boolean(c)}
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
						onClick={e => this.props.closeDetail()}
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
							basketCourses={p.basketCourses}
							courseData={c}
							tracking={p.tracking.length ? p.tracking[0] : null}
							addBasket={p.addBasket}
							removeBasket={p.removeBasket}
						/>
					</NotchedOutline>
				</Card>
				<Card className="styleCard">
					<NotchedOutline width={74} title={'Enrollment'}>
						<EnrollCard
							tracking={p.tracking}
							prevStart={p.prevStart}
							curStart={p.curStart}
							quarter={p.quarter}
						/>
					</NotchedOutline>
				</Card>
				{c && p.tracking.length && p.tracking[0] && p.tracking[0].sections.length && (
					<Card className="styleCard">
						<NotchedOutline width={66} title={'Sections'}>
							<SectionCard
								section={p.tracking[0].sections}
								setting={c.settings ? c.settings.slice(1) : []}
							/>
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
									rmp={p.rmp}
									name={
										c && c.instructor && c.instructor.first && c.instructor.last
											? c.instructor.first + ' ' + c.instructor.last
											: 'STAFF'
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
								<LocCard location={c && c!.settings!.length ? c!.settings![0].location : 'TBA'} />
							</NotchedOutline>
						</Card>
					</span>
				</div>
				{/* <FloatButton onClick={p.closeDetail}>BACK</FloatButton> */}
			</Drawer>
		);
	}
}

export default CourseDrawer;
