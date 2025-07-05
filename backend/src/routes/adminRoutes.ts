import express from "express"
import { adminAuth } from "../middlewares/authMiddleware"
import { adminMetrics, assignLecturer, fetchPendingEnrollments, getCoursesAndLecturers, manageEnrollment } from "../controllers/adminControllers"
const adminRoutes = express.Router()

adminRoutes.post('/enroll_course', adminAuth, manageEnrollment)
adminRoutes.post('/assign_lecturer', adminAuth, assignLecturer)
adminRoutes.get('/admin_metrics',adminAuth, adminMetrics)
adminRoutes.get('/get_courses_and_lecturers', adminAuth, getCoursesAndLecturers)

//enrollments
adminRoutes.get('/get_enrollments', adminAuth, fetchPendingEnrollments)
export default adminRoutes