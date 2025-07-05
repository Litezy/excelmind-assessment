import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

// Middleware to check if user's role is in allowedRoles array
const roleAuth = (allowedRoles: ('student' | 'lecturer' | 'admin')[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authorization = req.headers.authorization;

      if (!authorization || !authorization.startsWith('Bearer ')) {
        res.status(401).json({
          status: 'error',
          message: 'Unauthorized: No token provided',
        });
        return;
      }

      const token = authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        res.status(401).json({
          status: 'error',
          message: 'Unauthorized: User not found',
        });
        return;
      }

      if (!allowedRoles.includes(user.role as 'student' | 'lecturer' | 'admin')) {
        res.status(403).json({
          status: 'error',
          message: `Forbidden: Only ${allowedRoles.join(', ')} allowed`,
        });
        return;
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role as 'student' | 'lecturer' | 'admin',
      };

      next();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unauthorized: Invalid token';
      res.status(401).json({
        status: 'error',
        message: errorMessage,
      });
    }
  };
};

//  middleware that allows all roles
export const authAllRoles = roleAuth(['student', 'lecturer', 'admin']);

//  specific ones
export const studentAuth = roleAuth(['student']);
export const lecturerAuth = roleAuth(['lecturer']);
export const adminAuth = roleAuth(['admin']);
