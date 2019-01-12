import ky from 'ky';

import * as model from '../model';

class _API {
  private endpoint = 'https://andromeda.miragespace.net/slugsurvival';
  public async courses(termId: string): Promise<model.CourseList> {
    const result = (await ky
      .get(`${this.endpoint}/data/fetch/terms/${termId}.json`)
      .json()) as model.CourseList;
    return result;
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
