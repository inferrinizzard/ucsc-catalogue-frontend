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
    settings: c.loct.map(x => ({
      day: x.t.day,
      time: x.t.time,
      location: x.loc,
    })),
    capacity: c.cap,
    instructor: {
      display: c.ins.d,
      first: c.ins.f,
      last: c.ins.l,
      middle: c.ins.m,
    },
    subject,
  };
}

class _API {
  private endpoint = 'https://andromeda.miragespace.net/slugsurvival';
  public async courses(termId: string): Promise<model.CourseList> {
    const res = (await ky
      .get(`${this.endpoint}/data/fetch/terms/${termId}.json`)
      .json()) as any;
    return Object.entries<any[]>(res).reduce(
      (prev, [subject, rawCourse]) => ({
        ...prev,
        convertCourse(rawCourse, subject);,
      }),
      {}
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
    return res as model.CourseEnrollment[];
  }
}

const API = new _API();
export default API;
