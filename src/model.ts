export interface Term {
  code: string;
  name: string;
}

export interface Setting {
  day: string[];
  time: {
    start: string;
    end: string;
  };
  location: string;
}

export interface Instructor {
  display: string[];
  first: string;
  last: string;
  middle?: string;
}

export interface Course {
  code: string;
  section: string;
  name: string;
  number: number;
  settings: Setting[] | null;
  capacity: number | null;
  instructor: Instructor | null;
  subject: string;
}

export type EnrollmentStatus = 'Wait List' | 'Open' | 'Closed' | string;

export interface SectionEnrollment {
  capacity: number;
  number: number;
  name: string;
  waitlist: number;
  status: EnrollmentStatus;
  enrolled: number;
  waitlistCapacity: number;
}

export interface CourseEnrollment {
  termId: string;
  courseNum: number;
  date: number;
  status: EnrollmentStatus;
  available: number;
  capacity: number;
  enrolled: number;
  waitlistCapacity: number;
  waitlistTotal: number;
  sections: SectionEnrollment[];
}
