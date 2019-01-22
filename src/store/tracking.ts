import { Action } from 'redux';
import * as APIModel from '../models/course.model';
import API from '../services/api';

export interface TrackingState {
  courseEnrollment: APIModel.CourseEnrollment[];
}
