import * as React from 'react';
import styled from 'styled-components';
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

import {
  Course,
  CourseEnrollment,
  professorRating,
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

const StyleCard = styled(Card)<any>`
  margin: 0.5em;
  overflow: visible !important;
  box-shadow: none !important;
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
        <StyleCard>
          <NotchedOutline
            width={52}
            title={'Details'}
            inner={
              <DescCard
                basketCourses={this.props.basketCourses}
                courseData={this.props.course}
                tracking={this.props.tracking[0]}
                addBasket={this.props.addBasket}
                removeBasket={this.props.removeBasket}
              />
            }
          />
        </StyleCard>
        <StyleCard>
          <NotchedOutline
            width={74}
            title={'Enrollment'}
            inner={
              <EnrollCard
                tracking={this.props.tracking}
                prevStart={this.props.prevStart}
                quarter={this.props.quarter}
              />
            }
          />
        </StyleCard>
        {this.props.tracking[0] &&
          this.props.course &&
          this.props.tracking[0].sections.length > 0 && (
            <StyleCard>
              <NotchedOutline
                width={66}
                title={'Sections'}
                inner={
                  <SectionCard
                    section={this.props.tracking[0].sections}
                    setting={
                      this.props.course.settings
                        ? this.props.course.settings.slice(1)
                        : []
                    }
                  />
                }
              />
            </StyleCard>
          )}
        <StyleCard>
          <NotchedOutline width={50} title={'Grades'} inner={<GradesCard />} />
        </StyleCard>
        <div>
          <Third>
            <StyleCard>
              <NotchedOutline
                width={72}
                title={'Professor'}
                inner={
                  <ProfCard
                    rmp={this.props.rmp}
                    name={
                      this.props.course &&
                      this.props.course.instructor &&
                      this.props.course.instructor.first &&
                      this.props.course.instructor.last
                        ? this.props.course.instructor.first +
                          ' ' +
                          this.props.course.instructor.last
                        : 'STAFF'
                    }
                  />
                }
              />
            </StyleCard>
          </Third>
          <Third>
            <StyleCard>
              <NotchedOutline
                width={50}
                title={'Major'}
                inner={<MajorCard />}
              />
            </StyleCard>
          </Third>
          <Third>
            <StyleCard>
              <NotchedOutline
                width={66}
                title={'Location'}
                inner={
                  <LocCard
                    location={
                      this.props.course &&
                      this.props.course!.settings!.length > 0
                        ? this.props.course!.settings![0].location
                        : 'TBA'
                    }
                  />
                }
              />
            </StyleCard>
          </Third>
        </div>
        {/* <FloatButton onClick={this.props.closeDetail}>BACK</FloatButton> */}
      </Drawer>
    );
  }
}

export default CourseDrawer;
