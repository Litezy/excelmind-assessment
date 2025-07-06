import AiAssistant from "./pages/Student/AiAssistant";
import Courses from "./pages/Student/Courses";
import Dashboard from "./pages/Dashboard";
import EnrollCourses from "./pages/Student/EnrollCourses";
import Grades from "./pages/Student/Grades";
import Home from "./pages/GeneralPages/Home";
import Login from "./pages/GeneralPages/Login";
import Signup from "./pages/GeneralPages/Signup";
import CreateCourses from "./pages/Lecturer/CreateCourses";
import LecturerCourses from "./pages/Lecturer/LecturerCourses";
import Settings from "./pages/Admin/Settings";
import ManageEnrolls from "./pages/Admin/ManageEnrolls";
import Assignments from "./pages/Student/Assignments";
import GradeAssignments from "./pages/Lecturer/GradeAssignments";
import ErrorPage from "./pages/GeneralPages/ErrorPage";



export const GeneralPages = [
    { path: '*', component: ErrorPage },
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup }
]

export const AuthPages = [
    { path: '/:role/dashboard', component: Dashboard },
    { path: '/student/enroll', component: EnrollCourses },
    { path: '/student/courses', component: Courses },
    { path: '/student/ai_assistant', component: AiAssistant },
    { path: '/student/assignments', component: Assignments },
    { path: '/student/grades', component: Grades },

    //lecturer
    { path: '/lecturer/create_courses', component: CreateCourses },
    { path: '/lecturer/my_courses', component: LecturerCourses },
    { path: '/lecturer/grade_assignments', component: GradeAssignments },

    //admin
    { path: '/admin/manage_enrolls', component: ManageEnrolls },
    { path: '/admin/settings', component: Settings }
]
