import { useAtom } from 'jotai';
import { BarChart3, Book, BookOpen, Brain, Home, LogOut, LucideBookMarked, LucideGraduationCap, Settings, Workflow } from 'lucide-react';
import React, { useState } from 'react';
import { PROFILE } from '../services/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { CookieName } from '../utils/pageUtils';

const SideBar = () => {
  const [, setCurrentPage] = useState('dashboard');
  const [user] = useAtom(PROFILE);
  const navigate = useNavigate()

  const logout = () => {
    Cookies.remove(CookieName, { path: '/' });
    navigate('/login')
    setCurrentPage('dashboard')
  }
  const location = useLocation();
  const buttons = [
    {
      label: 'Dashboard',
      icon: Home,
      path: `/${user?.role?.toLowerCase()}/dashboard`,
    },
    {
      label: 'Enroll in Courses',
      icon: Book,
      path: '/student/enroll',
      roles: ['student'],
    },
    {
      label: 'My Courses',
      icon: BookOpen,
      path: '/student/courses',
      roles: ['student'],
    },
    {
      label: 'Create Courses',
      icon: BookOpen,
      path: '/lecturer/create_courses',
      roles: ['lecturer'],
    },
    {
      label: 'My Courses',
      icon: Book,
      path: '/lecturer/my_courses',
      roles: ['lecturer'],
    },
    {
      label: 'Assignments',
      icon: LucideGraduationCap,
      path: '/student/assignments',
      roles: ['student'],
    },
    {
      label: 'AI Assistant',
      icon: Brain,
      path: '/student/ai_assistant',
      roles: ['student'],
    },
    {
      label: 'Grades',
      icon: BarChart3,
      path: '/student/grades',
      roles: ['student'],
    },
    {
      label: 'Manage Enrolls',
      icon: Workflow,
      path: '/admin/manage_enrolls',
      roles: ['admin'],
    },
    {
      label: 'Grade Assignments',
      icon: LucideBookMarked,
      path: '/lecturer/grade_assignments',
      roles: ['lecturer'],
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      roles: ['admin'],
    },
  ];

  return (
    <div className="w-64 hidden  fixed to-0 bg-white shadow-xl h-full lg:flex flex-col border-r border-gray-200">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ExcelMind</h1>
            <p className="text-xs text-gray-500 capitalize">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {buttons
          .filter(btn => !btn.roles || btn.roles.includes(user?.role || ''))
          .map(({ label, icon: Icon, path }) => (
            <Link
              to={path || '#'}
              key={path}
              className={`w-full flex cursor-pointer items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${location.pathname === path
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
      </nav>

      <div className="p-6 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
