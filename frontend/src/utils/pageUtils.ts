import { toast } from "sonner";

export const CookieName = 'ExcelMindi47839!!'

export const ErrorMessage = (message: string) => {
    return toast.error(message, {
        position: "top-center",
        style: {
            backgroundColor: "#dc2626",
            color: "#ffffff"
        }
    });
};


export const SuccessMessage = (message: string) => {
    return toast.success(message, {
        position: "top-center",
        style: {
            backgroundColor: "#5ea95d",
            color: 'white'
        }

    })
}


export const UserRoles = [
    {
        role: 'student',
        url: '/student/dashboard'
    },
    {
        role: 'admin',
        url: '/admin/dashboard'
    },
    {
        role: 'lecturer',
        url: '/lecturer/dashboard'
    },
]


export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must include at least one number';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must include at least one special character';

  return null; // valid password
};



export const handleApiError = (err: any) => {
    const message =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        err?.message ||
        "Something went wrong. Please try again.";

    ErrorMessage(message);
};