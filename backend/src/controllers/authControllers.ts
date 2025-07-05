
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { signToken } from '../utils/jwt';
import { serverError } from '../utils/utils';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            res.status(400).json({ status: 400, message: 'Missing fields' });
            return;
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            res.status(409).json({ message: 'Email already exists' });
            return;
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashed, role },
        });

        const token = signToken({ id: user.id, role: user.role, email: user.email });
        res.status(201).json({ status: 201, token, message: 'Sign up successful', user: { id: user.id, email: user.email, role: user.role } });
        return;
    } catch (error) {
        serverError(res, error)
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            res.status(404).json({ status: 400, message: 'User not found' });
            return;
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            res.status(401).json({ status: 401, message: 'Invalid credentials' });
            return;
        }

        const token = signToken({ id: user.id, role: user.role, email: user.email });
        res.status(200).json({ status: 200, token, user: { id: user.id, email: user.email, role: user.role } });
        return;
    } catch (error) {
        serverError(res, error)
    }
};


export const fetchUserDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        if (!id) {
            res.status(400).json({ status: 400, message: "ID missing from request" })
            return;
        }
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        res.status(200).json({ status: 200, message: "details fetched successfully", data: user })
        return;
    } catch (error) {
        serverError(res, error)
    }
}


export const getLecturerMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;

        // 1. Fetch all course IDs created by this lecturer
        const courses = await prisma.course.findMany({
            where: { lecturerId: user.id },
            select: { id: true },
        });
        const courseIds = courses.map(course => course.id);
        const totalCourses = courseIds.length;

        // 2. Count all enrollments in those courses
        const totalEnrollments = await prisma.enrollment.count({
            where: { courseId: { in: courseIds } },
        });

        // 3. Fetch all assignment IDs from those courses
        const assignments = await prisma.assignment.findMany({
            where: { courseId: { in: courseIds } },
            select: { id: true },
        });
        const assignmentIds = assignments.map(a => a.id);

        // 4. Count all submissions to those assignments
        const totalSubmissions = await prisma.assignment.count({
            where: { id: { in: assignmentIds } },
        });

        res.status(200).json({
            status: 200,
            message: 'Dashboard data fetched successfully',
            data: {
                totalCourses,
                totalEnrollments,
                totalSubmissions,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch dashboard metrics',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};



export const getStudentMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;

        // 1. Approved Enrollments (Courses)
        const approvedEnrollments = await prisma.enrollment.findMany({
            where: {
                studentId: user.id,
                status: 'approved',
            },
            select: { courseId: true },
        });
        const enrolledCourseIds = approvedEnrollments.map(enroll => enroll.courseId);
        const totalEnrolledCourses = enrolledCourseIds.length;

        // 2. Assignment Submissions
        const submissions = await prisma.assignment.findMany({
            where: { studentId: user.id },
            select: { grade: true },
        });
        const totalSubmissions = submissions.length;

        // 3. Graded Assignments
        const gradedAssignments = submissions.filter(sub => sub.grade !== null);
        const totalGraded = gradedAssignments.length;

        // 4. Total Grades
        const totalGrade = gradedAssignments.reduce((sum, sub) => sum + (sub.grade ?? 0), 0);

        res.status(200).json({
            status: 200,
            message: 'Student dashboard fetched successfully',
            data: {
                totalEnrolledCourses,
                totalSubmissions,
                totalGraded,
                totalGrade,
            },
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch student dashboard metrics',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};






export const getTranscriptData = async (req: Request, res: Response) => {
  const student = req.user;

  const gradedAssignments = await prisma.assignment.findMany({
    where: {
      studentId: student.id,
      grade: { not: null },
    },
    include: {
      course: { select: { title: true, credits: true } },
    },
  });

  if (!gradedAssignments.length) {
    return res.status(404).json({ message: 'No graded courses found' });
  }

  let totalWeighted = 0;
  let totalCredits = 0;

  const data = gradedAssignments.map(a => {
    const weighted = (a.grade! / 100) * a.course.credits;
    totalWeighted += weighted;
    totalCredits += a.course.credits;

    return {
      course: a.course.title,
      credits: a.course.credits,
      grade: a.grade,
      date: new Date(a.updatedAt).toLocaleDateString(),
    };
  });

  const weightedAverage = Math.round((totalWeighted / totalCredits) * 100);

  res.json({
    student: {
      name: `${student.email}`,
      email: student.email,
    },
    courses: data,
    weightedAverage,
  });
};
