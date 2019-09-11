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

const Spacer = styled.div`
  margin-top: 30px;
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
    let p = this.props;
    let c = p.course;
    return (
      <Drawer
        anchor="right"
        open={Boolean(c)}
        variant="persistent"
        elevation={1}
        PaperProps={{
          style: {
            width: '48%',
          },
        }}
      >
        <Spacer />
        <Card className="styleCard">
          <NotchedOutline
            width={52}
            title={'Details'}
            inner={
              <DescCard
                basketCourses={p.basketCourses}
                courseData={c}
                tracking={p.tracking.length ? p.tracking[0] : null}
                addBasket={p.addBasket}
                removeBasket={p.removeBasket}
              />
            }
          />
        </Card>
        <Card className="styleCard">
          <NotchedOutline
            width={74}
            title={'Enrollment'}
            inner={
              <EnrollCard
                tracking={p.tracking}
                prevStart={p.prevStart}
                quarter={p.quarter}
              />
            }
          />
        </Card>
        {c &&
          p.tracking.length &&
          p.tracking[0] &&
          p.tracking[0].sections.length && (
            <Card className="styleCard">
              <NotchedOutline
                width={66}
                title={'Sections'}
                inner={
                  <SectionCard
                    section={p.tracking[0].sections}
                    setting={c.settings ? c.settings.slice(1) : []}
                  />
                }
              />
            </Card>
          )}
        <Card className="styleCard">
          <NotchedOutline width={50} title={'Grades'} inner={<GradesCard />} />
        </Card>
        <div>
          <span className="third">
            <Card className="styleCard">
              <NotchedOutline
                width={72}
                title={'Professor'}
                inner={
                  <ProfCard
                    rmp={p.rmp}
                    name={
                      c &&
                      c.instructor &&
                      c.instructor.first &&
                      c.instructor.last
                        ? c.instructor.first + ' ' + c.instructor.last
                        : 'STAFF'
                    }
                  />
                }
              />
            </Card>
          </span>
          <span className="third">
            <Card className="styleCard">
              <NotchedOutline
                width={50}
                title={'Major'}
                inner={<MajorCard />}
              />
            </Card>
          </span>
          <span className="third">
            <Card className="styleCard">
              <NotchedOutline
                width={66}
                title={'Location'}
                inner={
                  <LocCard
                    location={
                      c && c!.settings!.length > 0
                        ? c!.settings![0].location
                        : 'TBA'
                    }
                  />
                }
              />
            </Card>
          </span>
        </div>
        {/* <FloatButton onClick={p.closeDetail}>BACK</FloatButton> */}
      </Drawer>
    );
  }
}

export default CourseDrawer;
