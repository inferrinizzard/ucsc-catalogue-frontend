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
    date: [x.date].map(s => {
      let d = new Date(0);
      d.setUTCSeconds(s);
      return d.toDateString();
    })[0],
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
  public async courses(termId: string | number): Promise<model.Course[]> {
    const [termsData, coursesData] = await Promise.all([
      ky
        .get(`${this.endpoint}/data/fetch/terms/${termId.toString()}.json`)
        .json() as Promise<ApiResponseModel.TermsApiResponse>,
      ky
        .get(`${this.endpoint}/data/fetch/courses/${termId.toString()}.json`)
        .json() as Promise<ApiResponseModel.CoursesApiResponse>,
    ]);
    return Object.entries(termsData).reduce<model.Course[]>(
      (prev, [subject, rawTermCourses]) => {
        return [
          ...prev,
          ...rawTermCourses.map((x: any) =>
            convertAndMergeCourse(subject, x, coursesData[x.num])
          ),
        ];
      },
      []
    );
  }
  public async tracking(
    courseNum: number | string,
    termId: number | string
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
  public async fetchName(
    course: number | string,
    quarter: number | string
  ): Promise<string> {
    return fetch(
      'https://cors-anywhere.herokuapp.com/https://pisa.ucsc.edu/cs9/prd/sr9_2013/index.php',
      {
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'accept-language': 'ja,en-US;q=0.9,en;q=0.8,es;q=0.7',
          'cache-control': 'no-cache',
          'content-type': 'application/x-www-form-urlencoded',
          pragma: 'no-cache',
          'upgrade-insecure-requests': '1',
        },
        referrer: 'https://pisa.ucsc.edu/cs9/prd/sr9_2013/index.php',
        referrerPolicy: 'no-referrer-when-downgrade',
        body:
          'action=detail&class_data%5B%3ASTRM%5D=' +
          quarter +
          '&class_data%5B%3ACLASS_NBR%5D=' +
          course +
          '&binds%5B%3Aterm%5D=' +
          quarter +
          '&binds%5B%3Areg_status%5D=O&binds%5B%3Asubject%5D=&binds%5B%3Acatalog_nbr_op%5D=%3D&binds%5B%3Acatalog_nbr%5D=&binds%5B%3Atitle%5D=&binds%5B%3Ainstr_name_op%5D=%3D&binds%5B%3Ainstructor%5D=&binds%5B%3Age%5D=&binds%5B%3Acrse_units_op%5D=%3D&binds%5B%3Acrse_units_from%5D=&binds%5B%3Acrse_units_to%5D=&binds%5B%3Acrse_units_exact%5D=&binds%5B%3Adays%5D=&binds%5B%3Atimes%5D=&binds%5B%3Aacad_career%5D=&binds%5B%3Asession_code%5D=&rec_start=0&rec_dur=25',
        method: 'POST',
        mode: 'cors',
      }
    )
      .then(x => x.text())
      .then(s =>
        s.substr(
          s.indexOf('<h2 style="margin:0px;">') + 24,
          s.substr(s.indexOf('<h2 style="margin:0px;">') + 24).indexOf('</h2>')
        )
      )
      .then(s => s.substr(s.lastIndexOf(';') + 1).trim());
  }
}

const API = new _API();
(window as any)['API'] = API; // TODO: remove it
export default API;
