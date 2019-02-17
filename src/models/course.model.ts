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

export interface Section {
  number: number; // class number
  classSection: string; // class section e.g. 01A
  settings: Setting[] | null;
  instructor: string; // this is a string
  capacity: number;
}

export interface Course {
  code: string; // code in the subject e.g. 80T
  classSection: string; //
  name: string;
  description: string;
  type: string; // Lecture, Studio, etc.
  credit: number; // number of credits
  ge: string[];
  prerequisites: string | null;
  combinedSections: string[]; // Array of course Number (in string)
  sections: Section[];
  number: number;
  settings: Setting[] | null;
  capacity: number | null;
  instructor: Instructor | null;
  subject: string;
  subjectCode: string;
  level: CourseLevel;
}

export type EnrollmentStatus = 'Wait List' | 'Open' | 'Closed' | string;
export type CourseLevel = 'Lower Div' | 'Upper Div' | 'Graduate' | string;

export interface SectionEnrollment {
  capacity: number; // capacity of the section
  number: number; // section id
  name: string; // name of section e.g. 01A
  waitlist: number; // number of people on the waitlist
  status: EnrollmentStatus; // status
  enrolled: number; // number of people enrolled
  waitlistCapacity: number; // number of people that can be on the waitlist
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
