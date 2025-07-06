import { BookOpen, Clock, CheckCircle, XCircle, AlertCircle, Download, FileText, Upload, } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardLayout from '../../layout/DashboardLayout';
import { Apis, AuthGetApi, AuthPostApi } from '../../services/API';
import { ErrorMessage, handleApiError, SuccessMessage } from '../../utils/pageUtils';
import moment from 'moment'
import ModalLayout from '../../shared/ModalLayout';



const Courses = () => {

  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const [id, setId] = useState({ title: '', id: "" })
  const [dropLoading] = useState(null);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);


  const fetchEnrolledCourses = async () => {
    try {
      const response = await AuthGetApi(Apis.courses.get_my_enrollments)
      const data = await response.data;
      console.log(data)
      if (response.status === 'success' || response.status === 200) {
        setEnrolledCourses(data);
      }
      setLoading(false);
    } catch (error) {
      handleApiError(error)
      setLoading(false);
    }
  };





  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  const ConfirmAction = (val: any) => {
    setId({
      ...id, title: val.course?.title, id: val.enrollmentId
    })
    setConfirm(true)
  }


  const handleDrop = async () => {
    const formdata = {
      courseId: id.id
    }
    setLoading(true)
    setConfirm(false)
    try {
      const response = await AuthPostApi(Apis.courses.drop_course, formdata)
      if (response.statusCode === 200) {
        SuccessMessage(response.message)
        fetchEnrolledCourses(); // Refresh enrolled courses
        await new Promise((res) => setTimeout(res, 2000))
      } else {
        ErrorMessage(response.message)
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }



  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">

        {confirm &&
          <ModalLayout modalclass={` w-11/12 lg:w-2/4 mx-auto`} setModal={setConfirm}>
            <div className="p-5 rounded-md w-full bg-white flex items-center flex-col gap-5">
              <div className="">Are you sure you want to drop <span className='font-bold capitalize'>{id.title}</span> course?</div>
              <div className="flex w-full items-center justify-between">
                <button
                  onClick={() => setConfirm(false)}
                  className='w-fit px-4 py-2 rounded-md cursor-pointer bg-red-500 text-white'>cancel</button>
                <button
                  onClick={handleDrop}
                  className='w-fit px-4 py-2 rounded-md cursor-pointer bg-green-500 text-white'>confirm</button>
              </div>
            </div>
          </ModalLayout>
        }

        {/* Enrolled Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Enrolled Courses</h2>
              <p className="text-gray-600">Courses you've enrolled in</p>
            </div>
          </div>

          {enrolledCourses?.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Enrolled Courses</h3>
              <p className="text-gray-600">You haven't enrolled in any courses yet. Browse available courses above to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses && enrolledCourses.map((course, ind) => (
                <div key={ind} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(course?.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course?.status)}`}>
                          {course?.status || 'Unknown'}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.course?.title}</h3>

                    <div className="flex items-center space-x-2 mb-4">
                      <div className="">👩‍🏫</div>
                      <span className="text-sm text-gray-600">{course.course?.lecturer?.email.split('@')[0]}</span>
                    </div>

                    {course.course?.credits && (
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm text-gray-600">Credits: {course.course?.credits}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Enrolled: {moment(course?.course?.updatedAt).format(`DD/MM/YYYY hh:mm a`)}
                      </span>
                      {course?.status === 'approved' && (
                        <button
                          onClick={() => ConfirmAction(course)}
                          disabled={dropLoading === course.id}
                          className="bg-red-600 cursor-pointer text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors  disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {dropLoading === course.id ? 'Dropping...' : 'Drop Course'}
                        </button>
                      )}
                    </div>
                    <div className="my-4">
                      {course?.course?.syllabus ? (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <FileText className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">
                            Syllabus uploaded
                          </span>
                          <a
                            href={course?.course?.syllabus}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                            title="download syllabus"
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

export default Courses;