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
	com: any[];
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

export interface trackingApiResponse {
	ok: boolean;
	results: trackingApiData[];
}
