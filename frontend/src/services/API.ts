import axios from 'axios';
import Cookies from 'js-cookie';
import { CookieName } from '../utils/pageUtils';

let BASEURL: string;
if (window.origin.includes('localhost')) {
    BASEURL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'
} else {
    BASEURL = import.meta.env.VITE_LIVE_BASE_URL
}


// Declare routes
const auth: string = 'api/auth/';
const courses: string = 'api/courses/';
const admin: string = 'api/admin/';
const assignments: string = 'api/assignments/';
const ai: string = 'api/ai/';

const authUrls = {
    register: auth + 'register',
    login: auth + 'login',
    fetch_user: auth + "get_user",
    fetch_lecturer_metrics: auth + "lecturer_metrics",
    fetch_student_metrics: auth + "student_metrics",
};
const courseUrls = {
    get_courses: courses + 'get',
    get_lecturer_courses: courses + 'get_lecturer_courses',
    create_course: courses + 'create',
    enroll_course: courses + 'enroll',
    update_course: courses + 'update',
    upload_syllabus: courses + 'syllabus',
    drop_course: courses + 'drop',
    get_my_enrollments: courses + 'my-enrollments',
};

const assignmentUrls = {
    submit_assignment: assignments + 'submit',
    grade_assignment: assignments + 'grade',
    get_my_submissions: assignments + 'submissions',
    get_course_options: assignments + 'course_options',
    get_lecturer_assignments: assignments + 'get_lecturer_assignments',
    get_student_grades: assignments + 'get_student_grades',
}

const adminUrls = {
    enroll_course: admin + 'enroll_course',
    assign_lecturer: admin + 'assign_lecturer',
    fetch_admin_metrics: admin + "admin_metrics",
    fetch_pending_enrollments: admin + 'get_enrollments',
    fetch_courses_and_lecturers: admin + 'get_courses_and_lecturers'
}

const aiUrls = {
    recommend: ai + 'recommend',
    generate_syllabus: ai + 'generate_syllabus'
}

//group and export the urls to be used 
export const Apis = {
    auth: authUrls,
    courses: courseUrls,
    assignments: assignmentUrls,
    admin: adminUrls,
    ai: aiUrls
};


// Generic POST
export const PostApi = async <T = any>(endpoint: string, data: any): Promise<T> => {
    const response = await axios.post(`${BASEURL}/${endpoint}`, data);
    return response.data;
};



// Authenticated GET
export const AuthGetApi = async <T = any>(endpoint: string): Promise<T> => {
    const token = Cookies.get(CookieName);
    const response = await axios.get(`${BASEURL}/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// Authenticated POST
export const AuthPostApi = async <T = any>(endpoint: string, data: any): Promise<T> => {
    const token = Cookies.get(CookieName);
    const response = await axios.post(`${BASEURL}/${endpoint}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// Authenticated POST
export const AuthPutApi = async <T = any>(endpoint: string, data: any): Promise<T> => {
    const token = Cookies.get(CookieName);
    const response = await axios.put(`${BASEURL}/${endpoint}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
