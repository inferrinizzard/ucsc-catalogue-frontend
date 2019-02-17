import ky from 'ky';

import * as model from '../models/course.model';
import * as ApiResponseModel from '../models/api.model';

function convertAndMergeCourse(
  subject: string,
  t: ApiResponseModel.TermsApiCourse,
  c: ApiResponseModel.CourseApiCourse
): model.Course {
  return {
    code: t.c,
    classSection: t.s,
    name: t.n,
    description: c.desc,
    number: t.num,
    settings: !!t.loct
      ? t.loct
          .filter(x => x.loc && x.t)
          .map(x => ({
            day: x.t.day,
            time: x.t.time,
            location: x.loc,
          }))
      : null,
    capacity: t.cap,
    instructor: t.ins
      ? {
          display: t.ins.d,
          first: t.ins.f,
          last: t.ins.l,
          middle: t.ins.m,
        }
      : null,
    subject,
    type: c.ty,
    credit: c.cr,
    ge: c.ge,
    prerequisites: c.re,
    combinedSections: c.com,
    sections: c.sec.map<model.Section>(s => ({
      number: s.num,
      classSection: s.sec,
      settings: !!t.loct
        ? t.loct
            .filter(x => x.loc && x.t)
            .map(x => ({
              day: x.t.day,
              time: x.t.time,
              location: x.loc,
            }))
        : null,
      instructor: s.ins,
      capacity: s.cap,
    })),
    subjectCode:
      subject +
      ' ' +
      (
        '00' +
        (t.c.endsWith('0') ||
        t.c.endsWith('1') ||
        t.c.endsWith('2') ||
        t.c.endsWith('3') ||
        t.c.endsWith('4') ||
        t.c.endsWith('5') ||
        t.c.endsWith('6') ||
        t.c.endsWith('7') ||
        t.c.endsWith('8') ||
        t.c.endsWith('9')
          ? t.c + '0'
          : t.c)
      ).slice(-4),
    level: (() => {
      const n = parseInt(t.c);
      return n < 100
        ? 'Lower Div'
        : n >= 100 && n < 200
        ? 'Upper Div'
        : 'Graduate';
    })(),
  };
}

function convertTracking(
  rawResults: ApiResponseModel.trackingApiData[]
): model.CourseEnrollment[] {
  return rawResults.map<model.CourseEnrollment>(x => ({
    termId: x.termId,
    courseNum: x.courseNum,
    date: x.date,
    status: x.status,
    available: x.avail,
    capacity: x.cap,
    enrolled: x.enrolled,
    waitlistCapacity: x.waitCap,
    waitlistTotal: x.waitTotal,
    sections: x.sections.map<model.SectionEnrollment>(s => ({
      capacity: s.cap,
      number: s.num,
      name: s.sec,
      waitlist: s.wait,
      status: s.status,
      enrolled: s.enrolled,
      waitlistCapacity: s.waitTotal,
    })),
  }));
}

class _API {
  private endpoint = 'https://andromeda.miragespace.net/slugsurvival';
  private coursesCache?: model.Course[];
  public async courses(termId: string | number): Promise<model.Course[]> {
    if (this.coursesCache) {
      return this.coursesCache;
    }
    const [termsData, coursesData] = await Promise.all([
      ky
        .get(`${this.endpoint}/data/fetch/terms/${termId}.json`)
        .json() as Promise<ApiResponseModel.TermsApiResponse>,
      ky
        .get(`${this.endpoint}/data/fetch/courses/${termId}.json`)
        .json() as Promise<ApiResponseModel.CoursesApiResponse>,
    ]);
    return (this.coursesCache = Object.entries(termsData).reduce<
      model.Course[]
    >((prev, [subject, rawTermCourses]) => {
      return [
        ...prev,
        ...rawTermCourses.map((x: any) =>
          convertAndMergeCourse(subject, x, coursesData[x.num])
        ),
      ];
    }, []));
  }
  public async tracking(
    courseNum: number,
    termId: string
  ): Promise<model.CourseEnrollment[]> {
    const res = (await ky
      .get(
        `${
          this.endpoint
        }/tracking/fetch?termId=${termId}&courseNum=${courseNum}`
      )
      .json()) as any;
    if (!res.ok) {
      throw new Error('Error fetching tracking data');
    }
    return convertTracking(res.results);
  }
}

const API = new _API();
(window as any)['API'] = API; // TODO: remove it
export default API;
