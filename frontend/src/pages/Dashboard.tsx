import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Users,
  GraduationCap
} from 'lucide-react';
import DashboardLayout from '../layout/DashboardLayout';
import { useAtom } from 'jotai';
import { PROFILE, DASHBOARDMETRICS, STUDENT_GRADES } from '../services/store';
import type {
  DashboardMetrics,
  LecturerDashboardMetrics,
  StudentDashboardMetrics,
  AdminDashboardMetrics
} from '../services/atomTypes';

const isLecturerMetrics = (
  metrics: DashboardMetrics
): metrics is LecturerDashboardMetrics => {
  return 'totalCourses' in metrics;
};

const isStudentMetrics = (
  metrics: DashboardMetrics
): metrics is StudentDashboardMetrics => {
  return 'totalEnrolledCourses' in metrics;
};

const isAdminMetrics = (
  metrics: DashboardMetrics
): metrics is AdminDashboardMetrics => {
  return 'totalUsers' in metrics;
};

const Dashboard = () => {
  const [user] = useAtom(PROFILE);
  const [metrics] = useAtom(DASHBOARDMETRICS);
  const [grades] = useAtom(STUDENT_GRADES)

  const mockCourses = [
    { id: 1, title: 'Excel Fundamentals', instructor: 'Dr. Sarah Johnson' },
    { id: 2, title: 'Advanced Data Analysis', instructor: 'Prof. Mike Chen' },
    { id: 3, title: 'VBA Programming', instructor: 'Ms. Lisa Davis' },
    { id: 4, title: 'Power BI Integration', instructor: 'Dr. John Smith' }
  ];

  const studyHours = 42;
  const teachingHours = 55;

  const totalCourses =
    metrics && isLecturerMetrics(metrics)
      ? metrics.totalCourses
      : metrics && isStudentMetrics(metrics)
        ? metrics.totalEnrolledCourses
        : mockCourses.length;

  const secondMetric =
    metrics && isLecturerMetrics(metrics)
      ? metrics.totalEnrollments
      : metrics && isStudentMetrics(metrics)
        ? metrics.totalSubmissions
        : 0;

  const thirdMetric =
    metrics && isLecturerMetrics(metrics)
      ? metrics.totalSubmissions
      : metrics && isStudentMetrics(metrics)
        ? `${grades.weightedAverage}%`
        : '90%';


  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Admin Metrics */}
        {user?.role === 'admin' && metrics && isAdminMetrics(metrics) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Users</p>
                  <p className="text-3xl font-bold">{metrics.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Students</p>
                  <p className="text-3xl font-bold">{metrics.totalStudents}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Lecturers</p>
                  <p className="text-3xl font-bold">{metrics.totalLecturers}</p>
                </div>
                <Award className="w-8 h-8 text-purple-200" />
              </div>
            </div>
          </div>
        )}

        {/* Lecturer/Student Metrics */}
        {user?.role !== 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Courses</p>
                  <p className="text-3xl font-bold">{totalCourses}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">
                    {user?.role === 'lecturer' ? 'Students Enrolled' : 'Assignments Submitted'}
                  </p>
                  <p className="text-3xl font-bold">{secondMetric}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">
                    {user?.role === 'lecturer' ? 'Submissions' : 'Weighted Average Grade'}
                  </p>
                  <p className="text-3xl font-bold">{thirdMetric}</p>
                </div>
                <Award className="w-8 h-8 text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">
                    {user?.role === 'lecturer' ? 'Teaching Hours' : 'Study Hours'}
                  </p>
                  <p className="text-3xl font-bold">
                    {user?.role === 'lecturer' ? teachingHours : studyHours}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </div>
          </div>
        )}

        {/* Activities Section */}
        {user?.role === 'student' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Completed VBA Module 3</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Assignment submitted</p>
                    <p className="text-sm text-gray-600">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Deadlines */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                  <div>
                    <p className="font-medium text-gray-900">Excel Dashboard Project</p>
                    <p className="text-sm text-gray-600">Due in 2 days</p>
                  </div>
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                  <div>
                    <p className="font-medium text-gray-900">Data Analysis Quiz</p>
                    <p className="text-sm text-gray-600">Due tomorrow</p>
                  </div>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
