import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { cloudinary } from '../utils/cloudinary';
import fileUpload from 'express-fileupload';

const prisma = new PrismaClient();



export const submitAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;
        const { courseId, content } = req.body;

        if (!courseId) {
            res.status(400).json({ message: 'courseId is required' });
            return;
        }

        // Prevent double submissions
        const existing = await prisma.assignment.findFirst({
            where: { courseId, studentId: user.id },
        });

        if (existing) {
            res.status(400).json({ message: 'You already submitted an assignment for this course.' });
            return;
        }

        let submission: string | null = null;

        // 1. If content text was provided
        if (content) {
            submission = content;
        }
        // 2. Else if file was uploaded
        else if (req.files && req.files.file) {
            const file = req.files.file as fileUpload.UploadedFile;

            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                resource_type: 'raw',
                folder: 'academic-crm/assignments',
                public_id: `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`
            });

            submission = result.secure_url;
        }

        // Neither content nor file
        if (!submission) {
            res.status(400).json({ message: 'Please submit either content text or upload a file.' });
            return;
        }

        // Save submission
        const saved = await prisma.assignment.create({
            data: {
                courseId,
                studentId: user.id,
                submission,
            },
        });

        res.status(201).json({
            status:201,
            message: 'Assignment submitted',
            data: saved,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Assignment submission failed' });
    }
};


export const gradeAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { assignmentId, grade } = req.body;
    const lecturer = req.user;

    if (!assignmentId || grade === undefined || isNaN(grade)) {
      res.status(400).json({ message: 'assignmentId and numeric grade are required' });
      return;
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { course: true },
    });

    if (!assignment) {
      res.status(404).json({ message: 'Assignment not found' });
      return;
    }

    if (assignment.course.lecturerId !== lecturer.id) {
      res.status(403).json({ message: 'Not authorized to grade this assignment' });
      return;
    }

    const parsedGrade = parseInt(grade, 10);
    if (parsedGrade < 0 || parsedGrade > 100) {
      res.status(400).json({ message: 'Grade must be between 0 and 100' });
      return;
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        grade: parsedGrade,
        status: 'graded',
      },
    });

    res.status(200).json({
      status:200,
      message: 'Assignment graded successfully',
      assignment: updatedAssignment,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to grade assignment' });
  }
};


export const getStudentAssignments = async (req: Request, res: Response): Promise<void> => {
    try {
        const studentId = req.params.studentId;

        if (!studentId) {
            res.status(400).json({ message: 'studentId is required' });
            return;
        }

        const assignments = await prisma.assignment.findMany({
            where: { studentId },
            include: {
                course: {
                    select: { id: true, title: true }
                }
            }
        });

        res.status(200).json({
            message: 'Assignments fetched successfully',
            data: assignments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch assignments' });
    }
};



export const getCourseOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      res.status(401).json({ status: 401, message: 'Unauthorized: Student ID missing' });
      return;
    }

    // Get courseIds where student has submitted assignments
    const submittedAssignments = await prisma.assignment.findMany({
      where: { studentId },
      select: { courseId: true },
    });

    const submittedCourseIds = submittedAssignments.map((a) => a.courseId);

    // Fetch courses the student is enrolled in and approved by admin
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId,
        status: 'approved',
        courseId: {
          notIn: submittedCourseIds,
        },
      },
      select: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const courses = enrollments.map((e) => e.course);

    res.status(200).json({
      status: 200,
      message: 'Available courses fetched successfully',
      data: courses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch available courses',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};


export const getLecturerAssignments = async (req: Request, res: Response): Promise<void> => {
  try {
    const lecturerId = req.user?.id;

    if (!lecturerId) {
      res.status(401).json({ status: 401, message: 'Unauthorized' });
      return;
    }

    // Get all courses taught by this lecturer
    const courses = await prisma.course.findMany({
      where: { lecturerId },
      select: { id: true },
    });

    const courseIds = courses.map((course) => course.id);

    // Fetch all assignments submitted by students for these courses
    const assignments = await prisma.assignment.findMany({
      where: {
        courseId: { in: courseIds },
        submission: { not: null },
      },
      include: {
        course: { select: { id: true, title: true } },
        student: { select: { id: true, email: true } },
      },
    });

    res.status(200).json({
      status: 200,
      message: 'Assignments fetched successfully',
      data: assignments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch assignments',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};


export const getGradedAssignmentsWithWeightedAverage = async (req: Request, res: Response): Promise<void> => {
  try {
    const student = req.user;

    const gradedAssignments = await prisma.assignment.findMany({
      where: {
        studentId: student.id,
        grade: { not: null },
      },
      include: {
        course: {
          select: { id: true, title: true, credits: true }
        }
      }
    });

    if (!gradedAssignments.length) {
      res.status(200).json({
        message: 'No graded assignments found',
        data: [],
        weightedAverage: 0
      });
      return;
    }

    let totalWeighted = 0;
    let totalCredits = 0;

    gradedAssignments.forEach((a) => {
      if (a.grade !== null && a.course.credits > 0) {
        totalWeighted += (a.grade / 100) * a.course.credits;
        totalCredits += a.course.credits;
      }
    });

    const weightedAverage = totalCredits ? (totalWeighted / totalCredits) * 100 : 0;

    res.status(200).json({
      message: 'Graded assignments fetched',
      data: gradedAssignments,
      status:200,
      weightedAverage: Math.round(weightedAverage)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch graded assignments' });
  }
};


