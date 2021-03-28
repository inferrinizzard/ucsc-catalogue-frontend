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
    description: c.desc ? c.desc : '',
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
    level: (n =>
      n < 100 ? 'Lower Div' : n >= 100 && n < 200 ? 'Upper Div' : 'Graduate')(
      parseInt(t.c)
    ),
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
      return d;
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
      (prev, [subject, rawTermCourses]) => [
        ...prev,
        ...rawTermCourses
          .filter(x => coursesData[x.num])
          .map((x: any) =>
            convertAndMergeCourse(subject, x, coursesData[x.num])
          ),
      ],
      []
    );
  }
  // public async latestStatus(
  //   courseNum: number | string,
  //   termId: number | string
  // ): Promise<model.CourseEnrollment[]> {}

  // https://andromeda.miragespace.net/slugsurvival/tracking/latestOne?termId=:termCode&courseNum=:courseNum

  private trackingAvailableTerms?: (number | string)[];
  private async trackingAvailable(termId: string): Promise<boolean> {
    if (!this.trackingAvailableTerms) {
      const res = (this.trackingAvailableTerms = (await ky
        .get(`${this.endpoint}/tracking/available`)
        .json()) as any);
      if (!res.ok) {
        throw new Error('Error fetching tracking available terms');
      }
      this.trackingAvailableTerms = res.results;
    }
    return this.trackingAvailableTerms!.map(x => `${x}`).includes(termId);
  }

  public async tracking(
    courseNum: number | string,
    termId: string
  ): Promise<model.CourseEnrollment[]> {
    const available: boolean =
      // await this.trackingAvailable(termId);
      ((await ky
        .get(`${this.endpoint}/tracking/available`)
        .json()) as any).results
        .toString()
        .includes(termId);
    // if (!(await this.trackingAvailable(termId))) {
    // if (!available) {
    //   console.log('not available');
    //   return [];
    // }
    const res = (await ky
      .get(
        `${
          this.endpoint
        }/tracking/fetch?termId=${termId}&courseNum=${courseNum}`
      )
      .json()) as any;
    if (available && !res.ok) {
      throw new Error('Error fetching tracking data');
    }
    return convertTracking(available ? res.results : []);
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

  public async fetchDate(term: string | number): Promise<Date> {
    return new Date(
      await ky
        .get(this.endpoint + '/data/fetch/terms.json')
        .then(x => x.text())
        .then(s => s.substr(s.indexOf(term.toString()) + 40, 8))
    );
  }

  public async getProfId(name: string): Promise<number> {
    if (name === '') return -1;
    const idString: string = await ky
      .get(this.endpoint + '/data/fetch/rmp.json')
      .then(x => x.text());
    return idString.includes(name)
      ? parseInt(idString.substr(idString.indexOf(name) + name.length + 3, 6))
      : 0;
  }

  public async rmp(profId: number): Promise<model.professorRating> {
    if (profId <= 0) return {} as model.professorRating;
    const rawString: string = await ky
      .get(this.endpoint + '/data/fetch/rmp/stats/' + profId + '.json')
      .catch(x => (x.ok ? x : ''))
      .then(x => (x ? x.text() : ''));
    if (!rawString) return {} as model.professorRating;
    const d: number = parseFloat(
      rawString.substring(
        rawString.indexOf('easy') + 6,
        rawString.indexOf('clarity') - 2
      )
    );
    const c: number = parseFloat(
      rawString.substring(
        rawString.indexOf('clarity') + 9,
        rawString.indexOf('overall') - 2
      )
    );
    const o: number = parseFloat(
      rawString.substring(
        rawString.indexOf('overall') + 9,
        rawString.indexOf('quality') - 2
      )
    );
    return {
      difficulty: d,
      clarity: c,
      overall: o,
    } as model.professorRating;
  }
}

const API = new _API();
(window as any)['API'] = API; // TODO: remove it
export default API;
