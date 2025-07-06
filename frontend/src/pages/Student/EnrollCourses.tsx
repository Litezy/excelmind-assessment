import { useEffect, useState } from 'react'
import DashboardLayout from '../../layout/DashboardLayout'
import { Apis, AuthGetApi, AuthPostApi } from '../../services/API';
import { ErrorMessage, handleApiError, SuccessMessage } from '../../utils/pageUtils';
import { BookOpen, Star } from 'lucide-react';
import moment from 'moment';

const EnrollCourses = () => {

    const [availableCourses, setAvailableCourses] = useState<any[]>([]);
    const [enrollLoading, setEnrollLoading] = useState(null);
    const [, setLoading] = useState(false)


    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = async () => {
        try {
            const response = await AuthGetApi(Apis.courses.get_courses)
            const data = await response.data;
            if (response.status === 'success' || response.status === 200) {
                setAvailableCourses(data);
            }
            setLoading(false);
        } catch (error) {
            handleApiError(error)
            setLoading(false);
        }
    };


    const handleEnroll = async (courseId: any) => {
        try {
            setEnrollLoading(courseId);
            const formdata = {
                courseId: courseId
            }
            const response = await AuthPostApi(Apis.courses.enroll_course, formdata)
            const data = await response.data;
            if (data.status === 'success' || response.status === 201) {
                fetchCourses(); // Refresh enrolled courses
                await new Promise((res) => setTimeout(res, 2000))
                SuccessMessage(response.message)
            } else {
                ErrorMessage(response.message)
            }
        } catch (error) {
            handleApiError(error)
        } finally {
            setEnrollLoading(null);
        }
    };



    // const isEnrolled = (courseId: string) => {
    //     if (enrolledCourses) {
    //         return enrolledCourses.some(course => course.id === courseId);
    //     }
    // }




    return (
        <DashboardLayout>
            {/* Available Courses Section */}
            <div className="p-6 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Available Courses</h2>
                        <p className="text-gray-600">Explore and enroll in new courses</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableCourses && availableCourses.length > 0 ? (
                        availableCourses.map((course) => (
                            <div
                                key={course.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-3xl">
                                            <BookOpen className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm text-gray-600">4.8</span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                                    <div className="flex items-center space-x-2 mb-4">
                                        <div>👩‍🏫</div>
                                        <span className="text-sm text-gray-600">{course.lecturer.email.split('@')[0]}</span>
                                    </div>

                                    {course.credits && (
                                        <div className="flex items-center space-x-2 mb-4">
                                            <span className="text-sm text-gray-600">Credits: {course.credits}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            Created: {moment(course?.createdAt).format(`DD/MM/YYYY hh:mm a`)}
                                        </span>

                                        <button
                                            onClick={() => handleEnroll(course.id)}
                                            disabled={enrollLoading === course.id}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            {enrollLoading === course.id ? 'Enrolling...' : 'Enroll →'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16 flex flex-col items-center justify-center text-gray-500">
                            <div className="text-6xl mb-4">🎓</div>
                            <h3 className="text-lg font-semibold">No Courses Available</h3>
                            <p className="text-sm mt-2 max-w-md">
                                There are currently no courses to display. Please check back later or contact your lecturer/admin for updates.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    )
}

export default EnrollCourses