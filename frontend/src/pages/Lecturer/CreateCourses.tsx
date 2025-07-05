import React, { useState } from 'react';
import { BookOpen, Plus, AlertCircle } from 'lucide-react';
import { ErrorMessage, handleApiError, SuccessMessage } from '../../utils/pageUtils';
import { Apis, AuthPostApi } from '../../services/API';
import DashboardLayout from '../../layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import ModalLayout from '../../shared/ModalLayout';
import Loader from '../../components/Loader';

interface FormData {
    title: string;
    credits: string;
}

interface Errors {
    [key: string]: string;
}



const CreateCourses: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        credits: ''
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({});
    const navigate = useNavigate()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Errors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Course title is required';
        } else if (formData.title.length < 3) {
            newErrors.title = 'Course title must be at least 3 characters';
        }

        if (!formData.credits) {
            newErrors.credits = 'Credits is required';
        } else if (Number(formData.credits) <= 0) {
            newErrors.credits = 'Credits must be a positive number';
        } else if (Number(formData.credits) > 10) {
            newErrors.credits = 'Credits cannot exceed 10';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (): Promise<void> => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await AuthPostApi(Apis.courses.create_course, formData)
            if (response.status === 201) {
                setFormData({ title: '', credits: '' });
                await new Promise((res) => setTimeout(res, 2000))
                navigate('/lecturer/my_courses')
                SuccessMessage(response.message);
            } else {
                ErrorMessage(response.message)
            }
        } catch (error) {
            handleApiError(error)
            ErrorMessage('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100">


                {isLoading &&
                    <ModalLayout modalclass={`${isLoading && 'h-screen overflow-hidden'} w-11/12 mx-auto`} setModal={setIsLoading}>
                        <div className=""><Loader /></div>
                    </ModalLayout>
                }
                <div className="max-w-4xl mx-auto p-6">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="w-8 h-8 text-blue-500" />
                            <h1 className="text-3xl font-bold text-gray-800">Create New Course</h1>
                        </div>
                        <p className="text-gray-600">Add a new course to your teaching portfolio</p>
                    </div>



                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="space-y-6">
                            {/* Course Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    onClick={() => setErrors({})}
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3  outline-none border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.title ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter course title (e.g., Introduction to Computer Science)"
                                    disabled={isLoading}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Credits */}
                            <div>
                                <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-2">
                                    Credits *
                                </label>
                                <input
                                    type="number"
                                    id="credits"
                                    name="credits"
                                    onClick={() => setErrors({})}
                                    value={formData.credits}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="10"
                                    className={`w-full outline-none px-4 py-3 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.credits ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter number of credits (1-10)"
                                    disabled={isLoading}
                                />
                                {errors.credits && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.credits}
                                    </p>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className={`flex-1 bg-blue-500 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${isLoading
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-blue-600 cursor-pointer'
                                        }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            Create Course
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ title: '', credits: '' });
                                        setErrors({});
                                    }}
                                    disabled={isLoading}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-blue-800 mb-2">Guidelines:</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Course title should be descriptive and professional</li>
                            <li>• Credits typically range from 1-6 for most courses</li>
                            <li>• All fields marked with * are required</li>
                            <li>• You can edit course details after creation</li>
                        </ul>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateCourses;