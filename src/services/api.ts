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
		description: c.desc ?? '',
		number: t.num,
		settings:
			t.loct?.filter(x => x.loc && x.t).map(({ t, loc: location }) => ({ ...t, location })) ?? null,
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
			settings:
				t.loct?.filter(x => x.loc && x.t).map(({ t, loc: location }) => ({ ...t, location })) ??
				null,
			instructor: s.ins,
			capacity: s.cap,
		})),
		subjectCode: subject + ' ' + ('00' + (isNaN(+t.c.slice(-1)) ? t.c : t.c + '_')).slice(-4),
		level: ['Lower Div', 'Upper Div', 'Graduate'][(+t.c / 100) >> 0],
	};
}

function convertTracking(rawResults: ApiResponseModel.trackingApiData[]): model.CourseEnrollment[] {
	return rawResults.map<model.CourseEnrollment>(x => ({
		termId: x.termId,
		courseNum: x.courseNum,
		date: [x.date].map(s => (d => (d.setUTCSeconds(s), d))(new Date(0)))[0],
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

// function processDates(dates: ApiResponseModel.AvailableTerm['date'] | null) {
// 	if (!dates) return { start: null, end: null };
// 	return Object.entries(dates).reduce((acc, [name, d]) => ({ ...acc, [name]: Date.parse(d) }), {});
// }

class _API {
	private endpoint = 'https://andromeda.miragespace.net/slugsurvival';
	private terms = {} as { [code: number]: { name: string; date: { start: Date; end: Date } } };
	private ready: Promise<any>;

	constructor() {
		this.ready = (ky.get(`${this.endpoint}/data/fetch/terms.json`).json() as Promise<
			ApiResponseModel.AvailableTermsResponse[]
		>).then(
			terms =>
				(this.terms = terms.reduce(
					(acc, { code, date, name }) => ({
						...acc,
						[+code]: { name, date: { start: Date.parse(date.start), end: Date.parse(date.end) } },
					}),
					{}
				)),
			rej =>
				console.error('Error fetching available terms from Andromeda Endpoint, is the host down ?') // alert here later
		);
	}

	public async getQuarter() {
		const current = new Date();
		await this.ready;
		const [latest] = Object.entries(this.terms).find(([_, { date }]) => date.end > current) ?? [-1];
		// check here later for enrollment times and default to spring over summer ?
		return +latest;
	}

	public async courses(termId: number): Promise<model.Course[]> {
		await this.ready;
		if (!(termId in this.terms)) return [];
		return Promise.all([
			ky
				.get(`${this.endpoint}/data/fetch/terms/${termId.toString()}.json`)
				.json() as Promise<ApiResponseModel.TermsApiResponse>,
			ky
				.get(`${this.endpoint}/data/fetch/courses/${termId.toString()}.json`)
				.json() as Promise<ApiResponseModel.CoursesApiResponse>,
		]).then(([termsData, coursesData]) =>
			Object.entries(termsData).reduce<model.Course[]>(
				(prev, [subject, rawTermCourses]) => [
					...prev,
					...rawTermCourses
						.filter(c => coursesData[c.num])
						.map(c => convertAndMergeCourse(subject, c, coursesData[c.num])),
				],
				[]
			)
		);
	}
	// public async latestStatus(
	//   courseNum: number | string,
	//   termId: number | string
	// ): Promise<model.CourseEnrollment[]> {}

	// https://andromeda.miragespace.net/slugsurvival/tracking/latestOne?termId=:termCode&courseNum=:courseNum

	public async tracking(
		courseNum: number | string,
		termId: string
	): Promise<model.CourseEnrollment[]> {
		await this.ready;
		if (!(termId in this.terms)) return [];
		return (ky
			.get(`${this.endpoint}/tracking/fetch?termId=${termId}&courseNum=${courseNum}`)
			.json() as Promise<ApiResponseModel.TrackingApiResponse<ApiResponseModel.trackingApiData>>)
			.then(res => convertTracking(res.results))
			.catch(
				() => (
					console.error(new Error('Error fetching tracking data for course: ' + courseNum)), []
				)
			);
	}
	public async fetchName(course: number | string, quarter: number | string): Promise<string> {
		// broken, 403 forbidden, switch to ky
		return fetch(
			'https://cors-anywhere.herokuapp.com/https://pisa.ucsc.edu/cs9/prd/sr9_2013/index.php',
			{
				headers: {
					'accept':
						'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
					'accept-language': 'ja,en-US;q=0.9,en;q=0.8,es;q=0.7',
					'cache-control': 'no-cache',
					'content-type': 'application/x-www-form-urlencoded',
					'pragma': 'no-cache',
					'upgrade-insecure-requests': '1',
				},
				referrer: 'https://pisa.ucsc.edu/cs9/prd/sr9_2013/index.php',
				referrerPolicy: 'no-referrer-when-downgrade',
				body: `action=detail&class_data%5B%3ASTRM%5D=${quarter}&class_data%5B%3ACLASS_NBR%5D=${course}&binds%5B%3Aterm%5D=${quarter}&binds%5B%3Areg_status%5D=O&binds%5B%3Asubject%5D=&binds%5B%3Acatalog_nbr_op%5D=%3D&binds%5B%3Acatalog_nbr%5D=&binds%5B%3Atitle%5D=&binds%5B%3Ainstr_name_op%5D=%3D&binds%5B%3Ainstructor%5D=&binds%5B%3Age%5D=&binds%5B%3Acrse_units_op%5D=%3D&binds%5B%3Acrse_units_from%5D=&binds%5B%3Acrse_units_to%5D=&binds%5B%3Acrse_units_exact%5D=&binds%5B%3Adays%5D=&binds%5B%3Atimes%5D=&binds%5B%3Aacad_career%5D=&binds%5B%3Asession_code%5D=&rec_start=0&rec_dur=25`,
				method: 'POST',
				mode: 'cors',
			}
		)
			.then(x => x.text())
			.then(s =>
				// console.log(s),
				s.substr(
					s.indexOf('<h2 style="margin:0px;">') + 24,
					s.substr(s.indexOf('<h2 style="margin:0px;">') + 24).indexOf('</h2>')
				)
			)
			.then(s => s.substr(s.lastIndexOf(';') + 1).trim());
	}

	public getDates = (term: number) => this.ready.then(() => this.terms[+term].date);

	public async getProfId(name: string): Promise<number> {
		if (name === '') return -1;
		return ky
			.get(`${this.endpoint}/data/fetch/rmp.json`)
			.then(res => res.text())
			.then(idString =>
				idString.includes(name) ? +idString.substr(idString.indexOf(name) + name.length + 3, 6) : 0
			);
	}

	public async rmp(profId: number): Promise<model.professorRating> {
		if (profId <= 0) return {} as model.professorRating;
		return ky
			.get(`${this.endpoint}/data/fetch/rmp/stats/${profId}.json`)
			.then(res => (res.ok && res.status === 200 ? res.text() : ''))
			.then(rawString =>
				rawString
					? {
							difficulty: +rawString.substring(
								rawString.indexOf('easy') + 6,
								rawString.indexOf('clarity') - 2
							),
							clarity: +rawString.substring(
								rawString.indexOf('clarity') + 9,
								rawString.indexOf('overall') - 2
							),
							overall: +rawString.substring(
								rawString.indexOf('overall') + 9,
								rawString.indexOf('quality') - 2
							),
					  }
					: ({} as model.professorRating)
			);
	}
}

const API = new _API();
(window as any)['API'] = API; // TODO: remove it
export default API;
