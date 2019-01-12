import ky from 'ky';

import * as model from '../model';

function convertCourse(
  c: {
    c: string;
    l: string;
    n: string;
    s: string;
    cap: number | null;
    ins: {
      d: string[];
      f: string;
      l: string;
      m?: string;
    };
    num: number;
    loct: {
      t: {
        day: string[];
        time: {
          end: string;
          start: string;
        };
      };
      loc: string;
    }[];
  },
  subject: string
): model.Course {
  return {
    code: c.c,
    section: c.s,
    name: c.n,
    number: c.num,
    settings: !!c.loct
      ? c.loct
          .filter(x => x.loc && x.t)
          .map(x => ({
            day: x.t.day,
            time: x.t.time,
            location: x.loc,
          }))
      : null,
    capacity: c.cap,
    instructor: c.ins
      ? {
          display: c.ins.d,
          first: c.ins.f,
          last: c.ins.l,
          middle: c.ins.m,
        }
      : null,
    subject,
  };
}

function convertTracking(
  rawResults: {
    termId: string;
    courseNum: number;
    date: number;
    status: model.EnrollmentStatus;
    avail: 0;
    cap: number;
    enrolled: number;
    waitCap: number;
    waitTotal: number;
    sections: {
      cap: number;
      num: number;
      sec: string;
      wait: number;
      status: string;
      enrolled: number;
      waitTotal: number;
    }[];
  }[]
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
  public async courses(termId: string): Promise<model.Course[]> {
    const res = (await ky
      .get(`${this.endpoint}/data/fetch/terms/${termId}.json`)
      .json()) as any[];
    return Object.entries(res).reduce<model.Course[]>(
      (prev, [subject, rawCourses]) => {
        return [
          ...prev,
          ...rawCourses.map((x: any) => convertCourse(x, subject)),
        ];
      },
      []
    );
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
