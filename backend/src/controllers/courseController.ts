import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { cloudinary } from '../utils/cloudinary';
import fileUpload from 'express-fileupload';

const prisma = new PrismaClient();


//create course(lecturer only)
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { title, credits } = req.body;
    const course = await prisma.course.create({
      data: {
        title,
        credits: Number(credits),
        lecturerId: user.id
      }
    });

    res.status(201).json({
      status: 201,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error creating course',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


//get courses
export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({
        status: 401,
        message: 'Unauthorized: No user ID found in request'
      });
      return;
    }

    // Get enrolled course IDs where status is approved or pending
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: userId,
        status: {
          in: ['approved', 'pending']
        }
      },
      select: {
        courseId: true
      }
    });

    const enrolledCourseIds = enrollments.map(e => e.courseId);

    // 2. Fetch only courses the user is NOT already enrolled in
    const courses = await prisma.course.findMany({
      where: {
        id: {
          notIn: enrolledCourseIds
        }
      },
      include: {
        lecturer: {
          select: {
            id: true,
            email: true,
            role: true,
          }
        }
      }
    });

    res.status(200).json({
      status: 200,
      message: 'Courses fetched successfully',
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching courses',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


//get lecturer courses
export const getLecturerCourses = async (req: Request, res: Response): Promise<void> => {
  const user = req.user
  try {
    const courses = await prisma.course.findMany({
      where: {
        lecturerId: user.id,
      },
      include: {
        lecturer: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 200,
      message: 'Courses fetched successfully',
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching courses',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};


//enroll in course(student only)
export const enrollCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { courseId } = req.body;

    const existing = await prisma.enrollment.findFirst({
      where: {
        courseId,
        studentId: user.id,
        status:'pending'
      }
    });

    if (existing) {
      res.status(400).json({
        status: 'error',
        message: 'Already enrolled or pending',
        errorMessage: 'Duplicate enrollment'
      });
      return;
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        courseId,
        studentId: user.id,
        status: 'pending'
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Course enrolled successfully, pending approval',
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error enrolling in course',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};




// Upload or update syllabus (lecturer only)
export const uploadSyllabus = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { courseId } = req.body;

    if (!courseId) {
      res.status(400).json({ message: 'courseId is required' });
      return;
    }

    if (!req.files || !req.files.syllabus) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    if (course.lecturerId !== user.id) {
      res.status(403).json({ message: 'Not authorized to upload syllabus for this course' });
      return;
    }

    const file = req.files.syllabus as fileUpload.UploadedFile;

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'auto',
      folder: 'academic-crm',
      public_id: `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`,
    });

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { syllabus: result.secure_url },
    });

    res.status(200).json({
      status: 200,
      message: 'Syllabus uploaded and attached to course',
      data: updatedCourse,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
};




// Update course details
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { id, title, credits } = req.body;

    const course = await prisma.course.findUnique({ where: { id: id } });

    if (!course || course.lecturerId !== user.id) {
      res.status(403).json({ status: 'error', message: 'Unauthorized or course not found' });
      return;
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        title,
        credits: Number(credits)
      }
    });

    res.status(200).json({
      status: 200,
      message: 'Course updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating course',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


export const getEnrolledCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;

    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: user.id,
        status: {
          in: ['approved', 'pending']
        }
      },
      include: {
        course: {
          include: {
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
    const enrolledCourses = enrollments.map((enrollment) => ({
      enrollmentId: enrollment.id,
      course: enrollment.course,
      status: enrollment.status
    }));

    res.status(200).json({
      status: 'success',
      message: 'Enrolled courses fetched successfully',
      data: enrolledCourses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching enrolled courses',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


// Student drops a course
export const dropCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    const { courseId } = req.body;

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        id:courseId,
        studentId: user.id
      }
    });

    if (!enrollment) {
      res.status(404).json({
        status: 'error',
        message: 'Enrollment not found'
      });
      return;
    }

    await prisma.enrollment.delete({
      where: { id: enrollment.id }
    });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Dropped course successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error dropping course',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};



