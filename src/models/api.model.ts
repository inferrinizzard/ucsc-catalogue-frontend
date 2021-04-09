import * as CourseModel from './course.model';

export interface TermsApiCourse {
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
}

export interface TermsApiResponse {
	[subject: string]: TermsApiCourse[];
}

export interface CourseApiCourse {
	ty: string;
	cr: number;
	ge: string[];
	re: string;
	com: string[];
	sec: {
		num: number;
		sec: string;
		loct: {
			t: {
				day: string[];
				time: {
					start: string;
					end: string;
				};
			};
			loc: string;
		}[];
		ins: string;
		cap: number;
	}[];
	desc: string;
}

export interface CoursesApiResponse {
	[courseNumber: string]: CourseApiCourse;
}

export interface trackingApiData {
	termId: string;
	courseNum: number;
	date: number;
	status: CourseModel.EnrollmentStatus;
	avail: number;
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
}

export interface TrackingApiResponse<T> {
	ok: boolean;
	results: T[];
}

export interface AvailableTermsResponse {
	code: number | string;
	name: string;
	date: {
		start: string;
		end: string;
	};
}

type AvailableTerm = Omit<AvailableTermsResponse, 'data'> & { date: { start: Date; end: Date } };

export type AvailableTermData = { [code: number]: AvailableTerm };

export interface RmpApiResponse {
	// 	Response {type: "cors", url: "https://andromeda.miragespace.net/slugsurvival/data/fetch/rmp/stats/691015.json", redirected: false, status: 200, ok: true, …}
	// body: (...)
	// bodyUsed: true
	// headers: Headers {}
	// ok: true
	// redirected: false
	// status: 200
	// statusText: ""
	// type: "cors"
	// url: "https://andromeda.miragespace.net/slugsurvival/data/fetch/rmp/stats/691015.json"
	// __proto__: Response
}
