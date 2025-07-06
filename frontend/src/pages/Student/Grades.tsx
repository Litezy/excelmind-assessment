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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Grades</h2>
            {gradeList.length > 0 && (
              <button
                onClick={generateTranscriptPDF}
                className="flex items-center cursor-pointer space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
              >
                <Upload className="w-4 h-4" />
                <span className="text-xs">Export Transcript</span>
              </button>
            )}
          </div>

          {gradeList.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No grades found or assignments not yet graded.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gradeList.map((grade, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <h3
                    className="text-sm font-semibold text-gray-800 truncate"
                    title={grade.course?.title || 'Untitled Course'}
                  >
                    {grade.course?.title || 'Untitled Course'}
                  </h3>

                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Grade:</span>{' '}
                    <span
                      className={`font-semibold ${grade.grade >= 90
                          ? 'text-green-600'
                          : grade.grade >= 80
                            ? 'text-blue-600'
                            : grade.grade >= 70
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                    >
                      {grade.grade}%
                    </span>
                  </div>

                  <div className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">Date:</span>{' '}
                    {moment(grade.updatedAt).format('MMM D, YYYY')}
                  </div>

                  <div className="mt-2 text-xs inline-flex px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                    Graded
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

export default Grades;