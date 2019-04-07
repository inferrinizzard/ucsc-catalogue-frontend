import * as React from 'react';
import styled from 'styled-components';
import Drawer from '@material-ui/core/Drawer';
import Fab from '@material-ui/core/Fab';

import DescCard from './Cards/DescCard';
import EnrollCard from './Cards/EnrollCard';
import GradesCard from './Cards/GradesCard';
import ProfCard from './Cards/ProfCard';
import MajorCard from './Cards/MajorCard';
import LocCard from './Cards/LocCard';
import SectionCard from './Cards/SectionCard';

import {
  Course,
  CourseEnrollment,
  professorRating,
  Setting,
} from '../models/course.model';

export interface CourseDrawerProps {
  addBasket: (c: Course) => void;
  removeBasket: (c: Course) => void;
  basketCourses: Course[];
  open: boolean;
  closeDetail: () => void;
  course: Course | null;
  tracking: CourseEnrollment[];
  prevStart: Date;
  quarter: number;
  loading: boolean;
  rmp: professorRating;
}
export interface CourseDrawerState {}

const linerWidth = 30;
const Spacer = styled.div`
  margin-top: ${linerWidth}px;
`;

const Third = styled.span`
  width: 33.3%;
  display: inline-block;
`;

const FloatButton = styled(Fab)<any>`
  position: sticky !important;
  bottom: 25px;
  left: 85%;
`;

class CourseDrawer extends React.Component<
  CourseDrawerProps,
  CourseDrawerState
> {
  render() {
    return (
      <Drawer
        anchor="right"
        open={Boolean(this.props.course)}
        variant="persistent"
        elevation={1}
        PaperProps={{
          style: {
            width: '48%',
          },
        }}
      >
        <Spacer />
        <DescCard
          basketCourses={this.props.basketCourses}
          courseData={this.props.course}
          tracking={this.props.tracking[0]}
          addBasket={this.props.addBasket}
          removeBasket={this.props.removeBasket}
        />
        <EnrollCard
          tracking={this.props.tracking}
          prevStart={this.props.prevStart}
          quarter={this.props.quarter}
        />
        {this.props.tracking[0] &&
          this.props.course &&
          this.props.tracking[0].sections.length > 0 && (
            <SectionCard
              section={this.props.tracking[0].sections}
              setting={
                this.props.course.settings
                  ? this.props.course.settings.slice(1)
                  : []
              }
            />
          )}
        <GradesCard />
        <div>
          <Third>
            <ProfCard
              rmp={this.props.rmp}
              name={
                this.props.course && this.props.course.instructor
                  ? this.props.course.instructor.first +
                    ' ' +
                    this.props.course.instructor.last
                  : ''
              }
            />
          </Third>
          <Third>
            <MajorCard />
          </Third>
          <Third>
            <LocCard
              location={
                this.props.course && this.props.course!.settings!.length > 0
                  ? this.props.course!.settings![0].location
                  : 'TBA'
              }
            />
          </Third>
        </div>
        {/* <FloatButton onClick={this.props.closeDetail}>BACK</FloatButton> */}
      </Drawer>
    );
  }
}

export default CourseDrawer;
