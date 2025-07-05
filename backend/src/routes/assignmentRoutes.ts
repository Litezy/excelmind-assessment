import express from 'express';
import { lecturerAuth, studentAuth } from '../middlewares/authMiddleware';
import {
  getCourseOptions,
  getGradedAssignmentsWithWeightedAverage,
  getLecturerAssignments,
  getStudentAssignments,
  gradeAssignment,
  submitAssignment,
} from '../controllers/assignmentControllers';

const assignmentRoutes = express.Router();

assignmentRoutes.post('/submit', studentAuth, submitAssignment);
assignmentRoutes.put('/grade', lecturerAuth, gradeAssignment);
assignmentRoutes.get('/get_student_grades', studentAuth, getGradedAssignmentsWithWeightedAverage);
assignmentRoutes.get('/submissions/:studentId', studentAuth, getStudentAssignments);
assignmentRoutes.get('/course_options', studentAuth, getCourseOptions);
assignmentRoutes.get('/get_lecturer_assignments', lecturerAuth, getLecturerAssignments);

export default assignmentRoutes;
