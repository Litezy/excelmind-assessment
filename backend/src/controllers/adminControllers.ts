import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Admin approves/rejects enrollment
export const manageEnrollment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId, id, status } = req.body;

        if (!courseId || !id) {
            res.status(400).json({ message: 'Enrollment and course Ids are required' });
            return;
        }

        const existingEnrollment = await prisma.enrollment.findFirst({
            where: {
                id,
            },
        });

        if (!existingEnrollment) {
            res.status(404).json({ message: 'Enrollment not found' });
            return;
        }

        const arr = ['approved', 'rejected']
        if (!arr.includes(status)) {
            res.status(400).json({ status: 'error', message: 'Invalid status' });
            return;
        }

        const enrollment = await prisma.enrollment.update({
            where: { id },
            data: { status }
        });

        res.status(200).json({
            status: 200,
            message: `Enrollment ${status}`,
            data: enrollment
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error managing enrollment',
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Admin assigns lecturer
export const assignLecturer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId, lecturerId } = req.body;

        if (!courseId || !lecturerId) {
            res.status(400).json({status:400, message: "Course and Lecturer Ids missing from request" })
            return;
        }
        const course = await prisma.course.update({
            where: { id: courseId },
            data: { lecturerId }
        });

        res.status(200).json({
            status: 200,
            message: 'Lecturer assigned',
            data: course
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error assigning lecturer',
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const adminMetrics = async (req: Request, res: Response): Promise<void> => {
    try {

        const user = req.user
        if (user?.role !== 'admin') {
            res.status(404).json({ status: 404, message: "Not authorized" })
            return
        }
        // Count all users excluding admins
        const totalUsers = await prisma.user.count({
            where: {
                NOT: { role: 'admin' }
            }
        });

        // Count students only
        const totalStudents = await prisma.user.count({
            where: { role: 'student' }
        });

        // Count lecturers only
        const totalLecturers = await prisma.user.count({
            where: { role: 'lecturer' }
        });

        res.status(200).json({
            status: 200,
            message: 'Admin metrics fetched successfully',
            data: {
                totalUsers,
                totalStudents,
                totalLecturers
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching admin metrics',
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};



export const fetchPendingEnrollments = async (req: Request, res: Response): Promise<void> => {
  try {
    const pendingEnrollments = await prisma.enrollment.findMany({
      where: {
        status: 'pending',
      },
      include: {
        student: {
          select: {
            id: true,
            email: true,
            role: true,
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            lecturer: {
              select: {
                id: true,
                email: true,
              }
            }
          }
        }
      }
    });

    res.status(200).json({
      status: 200,
      message: 'Pending enrollments fetched successfully',
      data: pendingEnrollments,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch pending enrollments',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};


//fetch courses and lecturers
export const getCoursesAndLecturers = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await prisma.course.findMany({});
    const lecturers = await prisma.user.findMany({
      where: {
        role: 'lecturer',
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
    res.status(200).json({
      status: 'success',
      message: 'Courses and lecturers fetched successfully',
      data: {
        courses,
        lecturers,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch courses and lecturers',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
