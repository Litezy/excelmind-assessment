import React, { useCallback, useEffect } from 'react';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import { useAtom } from 'jotai';
import { PROFILE, DASHBOARDMETRICS, STUDENT_GRADES, isSidebarExpandedAtom } from '../services/store';
import { Apis, AuthGetApi } from '../services/API';
import { handleApiError } from '../utils/pageUtils';
import type { DashboardMetrics } from '../services/atomTypes';

const DashboardLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user] = useAtom(PROFILE);
  const [, setMetrics] = useAtom(DASHBOARDMETRICS);
  const [, setGrades] = useAtom(STUDENT_GRADES);
  const [isExpanded] = useAtom(isSidebarExpandedAtom);

  const fetchDashBoardMetrics = useCallback(async () => {
    if (!user?.role) return;

    try {
      const endpoint =
        user.role === 'lecturer'
          ? Apis.auth.fetch_lecturer_metrics
          : user?.role === 'student'
          ? Apis.auth.fetch_student_metrics
          : Apis.admin.fetch_admin_metrics;

      const res = await AuthGetApi(endpoint);
      if (res.status === 200 && res.data) setMetrics(res.data as DashboardMetrics);
    } catch (error) {
      handleApiError(error);
    }
  }, [user?.role, setMetrics]);

  useEffect(() => {
    fetchDashBoardMetrics();
  }, [fetchDashBoardMetrics]);

  const fetchStudentGrades = async () => {
    try {
      const res = await AuthGetApi(Apis.assignments.get_student_grades);
      if (res.status === 200) {
        setGrades({ data: res.data, weightedAverage: res.weightedAverage });
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  useEffect(() => {
    if (user?.role === 'student') fetchStudentGrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen z-40 bg-gray-50 flex">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <div className={`fixed right-0 top-0 ${isExpanded ? 'lg:w-[81.1%]' : 'lg:w-[95.5%]'} w-full`}>
          <Header />
        </div>
        <div
          className={`flex-1   transition-all duration-300 ${
            isExpanded ? 'ml-0 lg:ml-[17rem]' : 'lg:ml-[5rem] ml-0'
          } mt-[5rem] lg:mt-[5rem] overflow-y-auto overflow-x-hidden`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;