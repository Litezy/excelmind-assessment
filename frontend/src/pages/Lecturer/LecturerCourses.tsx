import React, { useState, useEffect } from 'react';
import { BookOpen, Upload, Edit, FileText, Save, X, Download } from 'lucide-react';
import DashboardLayout from '../../layout/DashboardLayout';
import { ErrorMessage, handleApiError, SuccessMessage } from '../../utils/pageUtils';
import { Apis, AuthGetApi, AuthPostApi, AuthPutApi } from '../../services/API';

interface Course {
    id: string;
    title: string;
    credits: number;
    syllabus?: string;
    lecturerId: string;
    lecturer: {
        id: string;
        email: string;
        role: string;
    };
}

interface EditingCourse {
    id: string;
    title: string;
    credits: number;
}

const LecturerCoursesDashboard: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [uploadingCourse, setUploadingCourse] = useState<string | null>(null);
    const [editingCourse, setEditingCourse] = useState<EditingCourse | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
    const [updating, setUpdating] = useState<boolean>(false);



    const fetchCourses = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await AuthGetApi(Apis.courses.get_lecturer_courses)
            console.log(response)
            if (response.status === 200) {
                const data = response.data
                setCourses(data || []);
            }
        } catch (error) {
            handleApiError(error)
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, courseId: string): void => {
        const file = event.target.files?.[0];
        if (!file) return;

        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        const maxSize = 10 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {
            ErrorMessage('Only PDF or DOC/DOCX files are allowed.');
            return;
        }

        if (file.size > maxSize) {
            ErrorMessage('File is too large. Max size is 10MB.');
            return;
        }

        setSelectedFiles(prev => ({ ...prev, [courseId]: file }));
    };




    const uploadSyllabus = async (courseId: string): Promise<void> => {
        const file = selectedFiles[courseId];
        if (!file) {
            ErrorMessage('Please select a file first');
            return;
        }
        try {
            setUploadingCourse(courseId);
            const formData = new FormData();
            formData.append('syllabus', file);
            formData.append('courseId', courseId);

            const response = await AuthPostApi(Apis.courses.upload_syllabus, formData);
            if (response.status === 200) {
                const data = await response.data;
                setCourses(prev => prev.map(course =>
                    course.id === courseId ? { ...course, syllabus: data.syllabus } : course
                ));
                setSelectedFiles(prev => ({ ...prev, [courseId]: null }));
                SuccessMessage('Syllabus uploaded successfully!');
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setUploadingCourse(null);
        }
    };


    const startEditing = (course: Course): void => {
        setEditingCourse({
            id: course.id,
            title: course.title,
            credits: Number(course.credits)
        });
    };

    const cancelEditing = (): void => {
        setEditingCourse(null);
    };


    const updateCourse = async (): Promise<void> => {
        if (!editingCourse) return;

        try {
            setUpdating(true);
            const response = await AuthPutApi(Apis.courses.update_course, editingCourse)
            if (response.status !== 200) {
                throw new Error('Failed to update course');
            }
            const data = await response.data;

            // Update course in state
            setCourses(prev => prev.map(course =>
                course.id === editingCourse.id
                    ? { ...course, title: data.title, credits: data.credits }
                    : course
            ));
            setEditingCourse(null);
            SuccessMessage(response.message);
        } catch (error) {
            handleApiError(error)
        } finally {
            setUpdating(false);
        }
    };

    const handleEditChange = (field: 'title' | 'credits', value: string): void => {
        if (editingCourse) {
            setEditingCourse({
                ...editingCourse,
                [field]: value
            });
        }
    };

    // Fetch courses on component mount
    useEffect(() => {
        fetchCourses();
    }, []);



    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your courses...</p>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-8 h-8 text-blue-500" />
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
                                    <p className="text-gray-600">Manage your courses and upload syllabi</p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                {courses.length} course{courses.length !== 1 ? 's' : ''} total
                            </div>
                        </div>
                    </div>

                    {/* Courses Grid */}
                    {courses.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses yet</h3>
                            <p className="text-gray-500">Start by creating your first course</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div key={course.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                                    <div className="p-6">
                                        {/* Course Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                {editingCourse?.id === course.id ? (
                                                    <div className="space-y-2">
                                                        <input
                                                            type="text"
                                                            value={editingCourse.title}
                                                            onChange={(e) => handleEditChange('title', e.target.value)}
                                                            className="w-full outline-none px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Course title"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={editingCourse.credits}
                                                            onChange={(e) => handleEditChange('credits', e.target.value)}
                                                            className="w-20 px-2 py-1 border rounded focus:ring-1 outline-none focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Credits"
                                                            min="1"
                                                            max="10"
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                            {course.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {course.credits} credit{course.credits !== 1 ? 's' : ''}
                                                        </p>
                                                    </>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 ml-4">
                                                {editingCourse?.id === course.id ? (
                                                    <>
                                                        <button
                                                            onClick={updateCourse}
                                                            disabled={updating}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Save changes"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                            title="Cancel editing"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => startEditing(course)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit course"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Syllabus Status */}
                                        <div className="mb-4">
                                            {course.syllabus ? (
                                                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                                    <FileText className="w-5 h-5 text-green-600" />
                                                    <span className="text-sm text-green-700 font-medium">
                                                        Syllabus uploaded
                                                    </span>
                                                    <a
                                                        href={course.syllabus}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-auto p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                                                        title="View syllabus"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                                                    <Upload className="w-5 h-5 text-yellow-600" />
                                                    <span className="text-sm text-yellow-700 font-medium">
                                                        No syllabus uploaded
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Upload Section */}
                                        <div className="border-t pt-4">
                                            <div className="flex flex-col gap-3">
                                                <input
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={(e) => handleFileSelect(e, course.id)}
                                                    className="hidden"
                                                    id={`file-${course.id}`}
                                                />

                                                <label
                                                    htmlFor={`file-${course.id}`}
                                                    className="flex-1 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors"
                                                >
                                                    {selectedFiles[course.id]?.name || 'Choose syllabus file'}
                                                </label>

                                                {selectedFiles[course.id] && (
                                                    <button
                                                        onClick={() => uploadSyllabus(course.id)}
                                                        disabled={uploadingCourse === course.id}
                                                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                    >
                                                        {uploadingCourse === course.id ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                Uploading...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload className="w-4 h-4" />
                                                                Upload Syllabus
                                                            </>
                                                        )}
                                                    </button>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LecturerCoursesDashboard;