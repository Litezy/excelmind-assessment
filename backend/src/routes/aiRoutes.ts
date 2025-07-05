import express from 'express'
import { studentAuth } from '../middlewares/authMiddleware'
import { generateSyllabus, recommendCourses } from '../controllers/aiController'
const aiRoutes = express.Router()

aiRoutes.post('/recommend', studentAuth, recommendCourses)
aiRoutes.post('/generate_syllabus', studentAuth, generateSyllabus)
export default aiRoutes