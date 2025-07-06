import  { useEffect, useState } from 'react';
import DashboardLayout from '../../layout/DashboardLayout';
import { AuthGetApi, AuthPostApi } from '../../services/API';
import { Apis } from '../../services/API';
import { ErrorMessage, handleApiError, SuccessMessage } from '../../utils/pageUtils';
import ModalLayout from '../../shared/ModalLayout';

interface Course {
  id: string;
  title: string;
}

const Assignments = () => {
  const [courseId, setCourseId] = useState('');
  const [content, setContent] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourseTitles();
  }, []);

  const fetchCourseTitles = async () => {
    try {
      const res = await AuthGetApi(Apis.assignments.get_course_options);
      if (res.status === 200) {
        setCourses(res.data);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSubmit = async () => {
    if (!courseId || (!content && !file)) {
      ErrorMessage('Please select a course and provide either text or file submission.');
      return;
    }

    const formData = new FormData();
    formData.append('courseId', courseId);
    if (content) formData.append('content', content);
    if (file) formData.append('file', file);

    try {
      setLoading(true);
      const res = await AuthPostApi(Apis.assignments.submit_assignment, formData);
      if (res.status === 201) {
        SuccessMessage('Assignment submitted successfully!');
        setContent('');
        setFile(null);
        setCourseId('');
        fetchCourseTitles();
        await new Promise((res) => setTimeout(res, 2000));
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="lg:max-w-xl w-[95%] my-10 mx-auto p-6 space-y-6 bg-white rounded-md shadow">

        {loading && (
          <ModalLayout modalclass="w-11/12 mx-auto" setModal={setLoading}>
            <div className="p-6 flex items-center h-full justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </ModalLayout>
        )}

        <h2 className="text-xl font-semibold text-gray-800">Submit Assignment</h2>

        {courses.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg">🎉 You're all caught up!</p>
            <p>You’ve submitted assignments for all available courses or there are no assignments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Select Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="">-- Select a course --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Text Submission (optional)</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full min-h-32 mt-1 p-2 border rounded-md"
                placeholder="Write your assignment here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium">File Upload (optional)</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1 w-full border border-dashed p-2"
              />
            </div>

            <button
              disabled={loading}
              onClick={handleSubmit}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full"
            >
              {loading ? 'Submitting...' : 'Submit Assignment'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Assignments;
