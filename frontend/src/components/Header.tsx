import { useAtom } from 'jotai';
import { Menu, X, Bell, User } from 'lucide-react';
import React, { useState } from 'react';
import { PROFILE } from '../services/store';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { CookieName } from '../utils/pageUtils';
import {
  Home, Book, BookOpen, LucideGraduationCap, BarChart3,
  Workflow, LucideBookMarked, Settings, LogOut, Brain as BrainIcon
} from 'lucide-react';
import ModalLayout from '../shared/ModalLayout';

const Header = () => {
  const [user] = useAtom(PROFILE);
  const [openMenu, setOpenMenu] = useState(false);
  const username = user?.email?.split('@')[0] || '';
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const logout = () => {
    setLoading(true)
    Cookies.remove(CookieName, { path: '/' });
    setTimeout(() => {
      navigate('/login');
      setLoading(false)
    }, 3000)

  };

  const buttons = [
    { label: 'Dashboard', icon: Home, path: `/${user?.role?.toLowerCase()}/dashboard` },
    { label: 'Enroll in Courses', icon: Book, path: '/student/enroll', roles: ['student'] },
    { label: 'My Courses', icon: BookOpen, path: '/student/courses', roles: ['student'] },
    { label: 'Create Courses', icon: BookOpen, path: '/lecturer/create_courses', roles: ['lecturer'] },
    { label: 'My Courses', icon: Book, path: '/lecturer/my_courses', roles: ['lecturer'] },
    { label: 'Assignments', icon: LucideGraduationCap, path: '/student/assignments', roles: ['student'] },
    { label: 'AI Assistant', icon: BrainIcon, path: '/student/ai_assistant', roles: ['student'] },
    { label: 'Grades', icon: BarChart3, path: '/student/grades', roles: ['student'] },
    { label: 'Manage Enrolls', icon: Workflow, path: '/admin/manage_enrolls', roles: ['admin'] },
    { label: 'Grade Assignments', icon: LucideBookMarked, path: '/lecturer/grade_assignments', roles: ['lecturer'] },
    { label: 'Settings', icon: Settings, path: '/admin/settings', roles: ['admin'] },
  ];

  const message = (() => {
    switch (user?.role) {
      case 'lecturer': return 'Welcome, esteemed Lecturer! 👩‍🏫';
      case 'admin': return 'Welcome, Admin! 🛠️';
      default: return 'Welcome back to your learning journey! 📚';
    }
  })();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-[13.3px] relative z-50">

      {loading &&
        <ModalLayout modalclass={`${loading && 'h-screen overflow-hidden'} w-11/12 mx-auto`} setModal={setLoading}>
          <div className="p-6 flex items-center h-full justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </ModalLayout>
      }
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 capitalize">Hi {username}</h2>
          <p className="text-gray-600 text-sm mt-1">{message}</p>
        </div>

        {/* Desktop Icons */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600 hover:text-gray-800 cursor-pointer" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </div>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="lg:hidden">
          <button
            className="text-gray-700 cursor-pointer focus:outline-none"
            onClick={() => setOpenMenu(!openMenu)}
          >
            {openMenu ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {openMenu && (
        <div className="md:hidden mt-4 border-t pt-4 space-y-2">
          {buttons
            .filter(btn => !btn.roles || btn.roles.includes(user?.role || ''))
            .map(({ label, icon: Icon, path }) => (
              <Link
                key={path}
                to={path || '#'}
                onClick={() => setOpenMenu(false)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition ${location.pathname === path
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          <button
            onClick={logout}
            className="flex items-center cursor-pointer w-full space-x-3 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
