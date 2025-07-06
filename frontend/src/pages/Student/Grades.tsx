import { Upload } from 'lucide-react';
import DashboardLayout from '../../layout/DashboardLayout';
import { useAtom } from 'jotai';
import { STUDENT_GRADES, PROFILE } from '../../services/store';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TranscriptCourse {
  course: string;
  credits: number;
  grade: number;
  date: string;
}

const Grades = () => {
  const [grades] = useAtom(STUDENT_GRADES);
  const [user] = useAtom(PROFILE);
  const gradeList = grades?.data || [];
  const username = user?.email?.split('@')[0]
  const transcriptData = {
    student: {
      name: username || 'Student',
      email: user?.email || '',
    },
    weightedAverage: grades?.weightedAverage || 0,
    courses: gradeList.map((grade: any) => ({
      course: grade.course?.title || 'Untitled Course',
      credits: grade.course?.credits || 3,
      grade: grade.grade,
      date: moment(grade.updatedAt).format('MMM D, YYYY'),
    })),
  };

  const generateTranscriptPDF = () => {
    const doc = new jsPDF();

    // Set font size and add title
    doc.setFontSize(18);
    doc.text('ExcelMind Student Transcript', 14, 20);

    // Add student information
    doc.setFontSize(12);
    doc.text(`Name: ${transcriptData.student.name}`, 14, 30);
    doc.text(`Email: ${transcriptData.student.email}`, 14, 37);
    doc.text(`Weighted Average: ${transcriptData.weightedAverage}%`, 14, 44);

    // Prepare table data
    const headers = [['Course', 'Credits', 'Grade', 'Date']];
    const rows = transcriptData.courses.map((c: TranscriptCourse) => [
      c.course,
      c.credits.toString(),
      `${c.grade}%`,
      c.date,
    ]);

    // Add table using autoTable
    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 50,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Save the PDF
    doc.save(`${username}-transcript.pdf`);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Grades</h2>
            {gradeList.length > 0 && (
              <button
                onClick={generateTranscriptPDF}
                className="flex items-center cursor-pointer space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
              >
                <Upload className="w-4 h-4" />
                <span>Export Transcript</span>
              </button>
            )}
          </div>

          {gradeList.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No grades found or assignments not yet graded.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Course</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Grade</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeList.map((grade, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 truncate font-medium text-gray-900">
                        {grade.course?.title || 'Untitled Course'}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${grade.grade >= 90
                              ? 'bg-green-100 text-green-800'
                              : grade.grade >= 80
                                ? 'bg-blue-100 text-blue-800'
                                : grade.grade >= 70
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {grade.grade}%
                        </span>
                      </td>
                      <td className="py-4 truncate px-4 text-gray-600">
                        {moment(grade.updatedAt).format('MMM D, YYYY')}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Graded
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Grades;