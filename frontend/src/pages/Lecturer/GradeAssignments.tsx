import { useEffect, useState } from 'react';
import DashboardLayout from '../../layout/DashboardLayout';
import { AuthGetApi, AuthPutApi } from '../../services/API';
import { Apis } from '../../services/API';
import { ErrorMessage, handleApiError, SuccessMessage } from '../../utils/pageUtils';
import ModalLayout from '../../shared/ModalLayout';


interface Assignment {
    id: string;
    course: {
        title: string;
    };
    student: {
        email: string;
    };
    submission: string;
    grade?: number;
    status: 'pending' | 'graded' | string;
}


const GradeAssignments = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [selected, setSelected] = useState<Assignment | null>(null);
    const [submit, setSubmit] = useState(false)
    const [grading, setGrading] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const res = await AuthGetApi(Apis.assignments.get_lecturer_assignments);
            if (res.status === 200) {
                setAssignments(res.data);
            }
        } catch (err) {
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGradeSubmit = async (assignmentId: string) => {
        const grade = grading[assignmentId];

        if (grade === undefined || grade < 0 || grade > 100) {
            ErrorMessage('Enter a valid grade between 0 and 100');
            return;
        }
        const formdata = {
            assignmentId, grade
        }
        setSubmit(true)
        // return console.log(formdata)
        try {
            const res = await AuthPutApi(Apis.assignments.grade_assignment, formdata)
            if (res.status === 200) {
                SuccessMessage('Assignment graded successfully!');
                setAssignments(prev =>
                    prev.map(a =>
                        a.id === assignmentId ? { ...a, grade, status: 'graded' } : a
                    )
                );
                await new Promise((res) => setTimeout(res, 2000))
            }
        } catch (err) {
            handleApiError(err);
        } finally {
            setSubmit(false)
        }
    };

    const openModal = (val: any) => {
        setSelected(val)
        setModal(true)
    }
    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">

                {modal && selected && (
                    <ModalLayout modalclass="max-w-2xl mx-auto" setModal={setModal}>
                        <div className="p-6 space-y-4 w-full bg-white rounded-md">
                            <h2 className="text-lg font-semibold text-gray-800">Submission Preview</h2>
                            <div className="text-sm text-gray-600">
                                <p><span className="font-medium text-gray-800">Student:</span> {selected.student.email}</p>
                                <p><span className="font-medium text-gray-800">Course:</span> {selected.course.title}</p>
                            </div>
                            <div className="mt-4 p-4 bg-gray-100 border rounded-md max-h-96 overflow-y-auto whitespace-pre-wrap text-sm text-gray-800">
                                {selected?.submission || 'No submission text available.'}
                            </div>
                            <div className="text-right">
                                <button
                                    onClick={() => setModal(false)}
                                    className="mt-4 cursor-pointer inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </ModalLayout>
                )}

                {submit && (
                    <ModalLayout modalclass="w-11/12 mx-auto" setModal={setSubmit}>
                        <div className="p-6 flex items-center h-full justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    </ModalLayout>
                )}

                <h2 className="text-xl font-semibold text-gray-800">Grade Assignments</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : assignments.length === 0 ? (
                    <p className="text-gray-600">No submitted assignments yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assignments.map((assignment) => (
                            <div
                                key={assignment.id}
                                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-5 space-y-4"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{assignment.course.title}</h3>
                                    <p className="text-sm text-gray-500">Student: {assignment.student.email}</p>
                                    <p className="text-sm text-gray-500">Status: <span className="capitalize">{assignment.status}</span></p>
                                </div>

                                <div className="text-sm">
                                    {assignment.submission?.startsWith('http') ? (
                                        <a
                                            href={assignment.submission}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline text-sm"
                                        >
                                            View Submission
                                        </a>
                                    ) : (
                                        <button
                                            onClick={() => openModal(assignment)}
                                            className="text-blue-600 underline text-sm"
                                        >
                                            Preview Submission Text
                                        </button>
                                    )}
                                </div>

                                <div>
                                    {assignment.status === 'graded' ? (
                                        <p className="text-green-700 font-semibold text-sm">Grade: {assignment.grade}</p>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                placeholder="Enter grade"
                                                className="border px-3 py-1 w-24 rounded text-sm"
                                                value={grading[assignment.id] || ''}
                                                onChange={(e) =>
                                                    setGrading({ ...grading, [assignment.id]: parseInt(e.target.value) })
                                                }
                                            />
                                            <button
                                                onClick={() => handleGradeSubmit(assignment.id)}
                                                className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 text-sm"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>

    );
};

export default GradeAssignments;
