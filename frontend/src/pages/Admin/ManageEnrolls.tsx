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
            <div className="p-6 space-y-6">

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
                    <div className="overflow-auto">
                        <table className="min-w-full bg-white rounded-md shadow-sm">
                            <thead className="bg-gray-100 text-left text-sm font-medium text-gray-600">
                                <tr>
                                    <th className="px-4 py-3">Student Email</th>
                                    <th className="px-4 py-3">Course Title</th>
                                    <th className="px-4 py-3">Lecturer Email</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Approve</th>
                                    <th className="px-4 py-3">Reject</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                                {enrollments.map((enroll) => (
                                    <tr key={enroll.id} className="border-t border-gray-200">
                                        <td className="px-4 py-3">{enroll.student.email}</td>
                                        <td className="px-4 py-3">{enroll.course.title}</td>
                                        <td className="px-4 py-3">{enroll.course.lecturer.email}</td>
                                        <td className="px-4 py-3 capitalize">{enroll.status}</td>
                                        <td className="px-4 py-3 space-x-2">
                                            <button
                                                className="bg-green-600  cursor-pointer truncate py-2 px-3 rounded-md hover:bg-green-700 text-white"
                                                onClick={() => confirmAction(enroll, 'approved')}
                                            >
                                                Approve
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 space-x-2">
                                            <button
                                                className="bg-red-600 cursor-pointer  py-2 px-3 rounded-md hover:bg-red-700 text-white"
                                                onClick={() => confirmAction(enroll, 'rejected')}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ManageEnrolls;
