import { atom } from 'jotai'
import type { DashboardMetrics, GradeEntry, ProfileProps } from './atomTypes';



export const PROFILE = atom<ProfileProps>({});
export const DASHBOARDMETRICS = atom<DashboardMetrics | null>(null);
export const isSidebarExpandedAtom = atom(true);
export const STUDENT_GRADES = atom<{
  data: GradeEntry[];
  weightedAverage: number;
}>({
  data: [],
  weightedAverage: 0
});

