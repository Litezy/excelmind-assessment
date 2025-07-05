import express from "express";
const courseRoutes = express.Router()

import {
  createCourse,
  getCourses,
  enrollCourse,
  dropCourse,
  updateCourse,
  uploadSyllabus,
  getEnrolledCourses,
  getLecturerCourses
} from '../controllers/courseController';
import { lecturerAuth, studentAuth } from "../middlewares/authMiddleware";

courseRoutes.get('/get', studentAuth, getCourses);
courseRoutes.get('/get_lecturer_courses', lecturerAuth, getLecturerCourses);
courseRoutes.post('/create', lecturerAuth, createCourse);
courseRoutes.post('/enroll', studentAuth, enrollCourse);
courseRoutes.put('/update', lecturerAuth, updateCourse);
courseRoutes.post('/syllabus', lecturerAuth,uploadSyllabus);
courseRoutes.post('/drop', studentAuth, dropCourse);
courseRoutes.get('/my-enrollments', studentAuth, getEnrolledCourses);


export default courseRoutes;