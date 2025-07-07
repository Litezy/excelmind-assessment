import { useEffect, useState } from 'react';
import DashboardLayout from '../../layout/DashboardLayout';
import { Apis, AuthGetApi, AuthPostApi } from '../../services/API';
import { handleApiError, SuccessMessage } from '../../utils/pageUtils';
import ModalLayout from '../../shared/ModalLayout';

interface Enrollment {
    id: string;
    courseId: string;
    studentId: string;
    status: string;
    student: {
        id: string;
        email: string;
        role: string;
    };
    course: {
        id: string;
        title: string;
        lecturer: {
            id: string;
            email: string;
        };
    };
}

const ManageEnrolls = () => {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [selected, setSelected] = useState<{ item: Enrollment | null; action: 'approved' | 'rejected' }>({
        item: null,
        action: 'approved',
    });


    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            const res = await AuthGetApi(Apis.admin.fetch_pending_enrollments);
            if (res.status === 200) {
                setEnrollments(res.data);
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setLoading(false);
        }
    };



    const handleAction = async () => {
        if (!selected.item) return;
        const { id, course } = selected.item;
        try {
            const formdata = {
                id,
                status: selected.action,
                courseId: course.id,
            };
            setConfirm(false)
            setLoading(true)
            const res = await AuthPostApi(Apis.admin.enroll_course, formdata);
            if (res.status === 200) {
                setEnrollments((prev) => prev.filter((enroll) => enroll.id !== id));
                setSelected({ item: null, action: "approved" })
                await new Promise((res) => setTimeout(res, 2000))
                SuccessMessage(res.message)
            }
        } catch (error) {
            handleApiError(error);
        }finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const confirmAction = (item: Enrollment, action: 'approved' | 'rejected') => {
        setSelected({ item, action });
        setConfirm(true);
    };

    return (
       <DashboardLayout>
    <div className="p-3 space-y-5">

        {loading &&
            <ModalLayout modalclass={`${loading && 'h-screen overflow-hidden'} w-11/12 mx-auto`} setModal={setLoading}>
                <div className="p-6 flex items-center h-full justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </ModalLayout>
        }

        {confirm && selected.item && (
            <ModalLayout modalclass="w-11/12 mx-auto lg:w-1/3" setModal={setConfirm}>
                <div className="w-full flex items-center flex-col gap-5 p-5 rounded-md bg-white ">
                    <div className="text-center text-gray-800 font-medium">
                        Are you sure you want to <strong className="capitalize">{selected.action}</strong> this enrollment for{' '}
                        <span className="text-blue-600">{selected.item.student.email?.split('@')[0]}</span> in{' '}
                        <span className="text-blue-600">{selected.item.course.title}</span>?
                    </div>
                    <div className="flex w-full items-center justify-between mt-4">
                        <button
                            onClick={() => setConfirm(false)}
                            className="w-fit px-4 cursor-pointer py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAction}
                            className={`w-fit px-4 cursor-pointer py-2 rounded-md ${selected.action === 'approved'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                        >
                            Confirm {selected.action}
                        </button>
                    </div>
                </div>
            </ModalLayout>
        )}

        <h2 className="text-xl font-semibold text-gray-800">Manage Enrollments</h2>

        {loading ? (
            <p>Loading...</p>
        ) : enrollments.length === 0 ? (
            <p className="text-gray-600">No pending enrollments.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enroll) => (
                    <div key={enroll.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200">
                        {/* Header with Status */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-600">Enrollment Request</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                                enroll.status === 'pending' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : enroll.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {enroll.status}
                            </span>
                        </div>

                        {/* Student Info */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Student</h3>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-medium text-sm">
                                        {enroll.student.email.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-700 font-medium">
                                        {enroll.student.email.split('@')[0]}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {enroll.student.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Course Info */}
                        <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Course</h4>
                            <p className="text-sm text-gray-700 font-medium mb-1">
                                {enroll.course.title}
                            </p>
                            <p className="text-xs text-gray-500">
                                Lecturer: {enroll.course.lecturer.email}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 mt-6">
                            <button
                                className="flex-1 bg-green-600 cursor-pointer py-2 px-4 rounded-md hover:bg-green-700 text-white text-sm font-medium transition-colors duration-200"
                                onClick={() => confirmAction(enroll, 'approved')}
                            >
                                Approve
                            </button>
                            <button
                                className="flex-1 bg-red-600 cursor-pointer py-2 px-4 rounded-md hover:bg-red-700 text-white text-sm font-medium transition-colors duration-200"
                                onClick={() => confirmAction(enroll, 'rejected')}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
</DashboardLayout>
    );
};

export default ManageEnrolls;
