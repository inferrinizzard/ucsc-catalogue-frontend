interface Term {
  code: string;
  name: string;
}

interface Setting {
  day: string[];
  time: {
    start: string;
    end: string;
  };
  location: string;
}

interface Instructor {
  display: string[];
  first: string;
  last: string;
  middle?: string;
}

interface Course {
  code: string;
  section: string;
  name: string;
  number: number;
  settings: Setting[];
  capacity: number;
  instructor: Instructor;
  subject: string;
}

interface CourseList {
  [CourseId: string]: Course;
}

type EnrollmentStatus = 'Wait List' | 'Open' | 'Closed' | string;

interface SectionEnrollment {
  capacity: number;
  number: number;
  name: string;
  waitlist: number;
  status: EnrollmentStatus;
  enrolled: number;
  waitlistCapacity: number;
}

interface CourseEnrollment {
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
