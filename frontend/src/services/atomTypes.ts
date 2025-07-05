
export interface ProfileProps {
    email?: string;
    id?: string;
    role?: string;
}

export interface LecturerDashboardMetrics {
    totalCourses: number;
    totalEnrollments: number;
    totalSubmissions: number;
}
export interface AdminDashboardMetrics {
    totalUsers:number,
    totalStudents:number,
    totalLecturers:number
}

export interface StudentDashboardMetrics {
    totalEnrolledCourses: number;
    totalSubmissions: number;
    totalGraded: number;
    totalGrade: number;
}


export interface CourseInfo {
  id: string;
  title: string;
  credits: number;
}

export interface GradeEntry {
  id: string;
  submission: string;
  grade: number;
  status: string;
  updatedAt: string;
  course: CourseInfo;
}


export type DashboardMetrics = LecturerDashboardMetrics | StudentDashboardMetrics | AdminDashboardMetrics;
