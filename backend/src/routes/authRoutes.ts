import  express  from "express";
import { fetchUserDetails, getLecturerMetrics, getStudentMetrics, login, registerUser } from "../controllers/authControllers";
import { authAllRoles, lecturerAuth, studentAuth } from "../middlewares/authMiddleware";
const authRoutes = express.Router()

authRoutes.post('/register', registerUser);
authRoutes.post('/login', login);
authRoutes.get('/get_user/:id', authAllRoles,fetchUserDetails);

//metrics
authRoutes.get('/lecturer_metrics', lecturerAuth, getLecturerMetrics)
authRoutes.get('/student_metrics', studentAuth, getStudentMetrics)


export default authRoutes;