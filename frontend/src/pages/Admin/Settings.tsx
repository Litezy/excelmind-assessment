import { useEffect, useState } from 'react';
import DashboardLayout from '../../layout/DashboardLayout';
import { Apis, AuthGetApi, AuthPostApi } from '../../services/API';
import { ErrorMessage, handleApiError, SuccessMessage } from '../../utils/pageUtils';
import ModalLayout from '../../shared/ModalLayout';

const Settings = () => {
    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedLecturer, setSelectedLecturer] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            const res = await AuthGetApi(Apis.admin.fetch_courses_and_lecturers)
            if (res.status === 200) {
                const data = res.data
                setCourses(data.courses)
                setLecturers(data.lecturers)
            }
        } catch (error) {
            handleApiError(error);
        }
    };

    const assignLecturer = async () => {
        if (!selectedCourse || !selectedLecturer) {
            ErrorMessage('Select both a course and a lecturer');
            return;
        }
        const formdata = {
            courseId: selectedCourse,
            lecturerId: selectedLecturer,
        }
        setSubmitting(true);
        try {
            const res = await AuthPostApi(Apis.admin.assign_lecturer, formdata)
            if (res.status ===200) {
                SuccessMessage(`Lecturer assigned successfully ✅`)
                setSelectedCourse('');
                setSelectedLecturer('');
                await new Promise((res) => setTimeout(res, 2000))
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">


                {submitting &&
                    <ModalLayout modalclass={` w-11/12 mx-auto`} setModal={setSubmitting}>
                        <div className="p-6 flex items-center h-full justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    </ModalLayout>
                }

                <h2 className="text-xl font-semibold text-gray-800">Assign Course to Lecturer</h2>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4 max-w-xl">
                    {/* Course Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                        <select
                            className="w-full py-2 border-gray-300 rounded-md"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">-- Choose a course --</option>
                            {courses.map((course: any) => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Lecturer Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign Lecturer</label>
                        <select
                            className="w-full border-gray-300 py-2 rounded-md"
                            value={selectedLecturer}
                            onChange={(e) => setSelectedLecturer(e.target.value)}
                        >
                            <option value="">-- Choose a lecturer --</option>
                            {lecturers.map((lecturer: any) => (
                                <option key={lecturer.id} value={lecturer.id}>
                                    {lecturer.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={assignLecturer}
                            disabled={submitting}
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting ? 'Assigning...' : 'Assign Lecturer'}
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
