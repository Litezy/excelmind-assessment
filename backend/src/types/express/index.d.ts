// types/express/index.d.ts or anywhere imported globally

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        role: 'student' | 'lecturer' | 'admin'; 
      };
    }
  }
}

export {};  
